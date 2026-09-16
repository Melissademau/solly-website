import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  generateQuotePdf,
  generateQuoteDocx,
  generateQuoteHtmlEmail,
  BookingPayload,
} from '@/lib/quote-generator';

export async function POST(req: NextRequest) {
  try {
    const payload: BookingPayload = await req.json();
    const { formData } = payload;

    if (!formData || !formData.name || !formData.phone) {
      return NextResponse.json(
        { error: 'Coordonnées du client manquantes (nom et téléphone requis).' },
        { status: 400 }
      );
    }

    const safeClientName = formData.name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    const pdfFilename = `devis-solly-${safeClientName}.pdf`;
    const docxFilename = `devis-solly-${safeClientName}.docx`;

    // 1. Generate PDF & DOCX Buffers
    const [pdfBuffer, docxBuffer] = await Promise.all([
      generateQuotePdf(payload),
      generateQuoteDocx(payload),
    ]);

    const htmlContent = generateQuoteHtmlEmail(payload);
    const targetEmail = process.env.EMAIL_TO || 'hello@monsolly.com';

    let emailSent = false;
    let emailError: string | null = null;

    // 2. Attempt sending via Resend if RESEND_API_KEY is available
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Solly Réservations <hello@monsolly.com>',
            to: [targetEmail],
            subject: `✨ Nouvelle demande Solly : ${formData.name} (${formData.guestCount} pers.)`,
            html: htmlContent,
            attachments: [
              {
                filename: pdfFilename,
                content: pdfBuffer.toString('base64'),
              },
              {
                filename: docxFilename,
                content: docxBuffer.toString('base64'),
              },
              ...(formData.inspirationPhotos || [])
                .filter((p) => p.dataUrl)
                .map((p, idx) => ({
                  filename: p.name || `photo-inspiration-${idx + 1}.jpg`,
                  content: p.dataUrl!.split(';base64,').pop() || '',
                })),
            ],
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
          console.log(`[SendQuote] Email successfully sent to ${targetEmail} via Resend`);
        } else {
          const resendErr = await resendRes.text();
          console.warn('[SendQuote] Resend API error:', resendErr);
          emailError = resendErr;
        }
      } catch (err: any) {
        console.warn('[SendQuote] Failed sending with Resend:', err?.message);
        emailError = err?.message;
      }
    }

    // 3. Attempt sending via SMTP if configured and not yet sent
    if (!emailSent && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 465,
          secure: process.env.SMTP_SECURE !== 'false',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const smtpAttachments: any[] = [
          {
            filename: pdfFilename,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
          {
            filename: docxFilename,
            content: docxBuffer,
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
        ];

        if (formData.inspirationPhotos && formData.inspirationPhotos.length > 0) {
          formData.inspirationPhotos.forEach((photo, idx) => {
            if (photo.dataUrl) {
              const base64Str = photo.dataUrl.split(';base64,').pop();
              if (base64Str) {
                smtpAttachments.push({
                  filename: photo.name || `photo-inspiration-${idx + 1}.jpg`,
                  content: Buffer.from(base64Str, 'base64'),
                });
              }
            }
          });
        }

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `Solly Réservations <${process.env.SMTP_USER}>`,
          to: targetEmail,
          subject: `✨ Nouvelle demande Solly : ${formData.name} (${formData.guestCount} pers.)`,
          html: htmlContent,
          attachments: smtpAttachments,
        });

        emailSent = true;
        console.log(`[SendQuote] Email successfully sent to ${targetEmail} via SMTP`);
      } catch (err: any) {
        console.warn('[SendQuote] Failed sending with SMTP:', err?.message);
        emailError = err?.message;
      }
    }

    // Return response with base64 for direct download fallback
    return NextResponse.json({
      success: true,
      emailSent,
      emailError,
      targetEmail,
      pdfFilename,
      docxFilename,
      pdfBase64: pdfBuffer.toString('base64'),
      docxBase64: docxBuffer.toString('base64'),
    });
  } catch (error: any) {
    console.error('[SendQuote Error]', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erreur lors de la génération du devis.',
      },
      { status: 500 }
    );
  }
}
