import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  generateQuotePdf,
  generateQuoteDocx,
  generateQuoteHtmlEmail,
  generateCustomerConfirmationEmailHtml,
  BookingPayload,
} from '@/lib/quote-generator';
import { calculateBookingPrice } from '@/lib/pricing';
import { generateBookingReference, saveBooking } from '@/lib/bookings';

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

    // 1. Generate unique human-readable booking reference (e.g. SOL-260923-001)
    const bookingRef = payload.bookingRef || generateBookingReference();
    payload.bookingRef = bookingRef;

    // 2. Ensure pricing is calculated
    const pricing =
      payload.pricing ||
      calculateBookingPrice({
        guestCount: formData.guestCount,
        hasExtraBar: formData.hasExtraBar,
        hasDrinks: formData.hasDrinks,
        hasCartCustomization: formData.hasCartCustomization,
        hasCustomPackaging: formData.hasCustomPackaging,
      });
    payload.pricing = pricing;

    // 3. Save booking in data store with initial status 'PENDING'
    try {
      await saveBooking({
        id: bookingRef,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        statusLabel: 'Demande reçue',
        client: {
          name: formData.name,
          phone: formData.phone,
          countryCode: formData.countryCode,
          email: formData.email,
        },
        event: {
          type: formData.eventType,
          date: formData.eventDate,
          time: formData.timeSlot || '',
          location: formData.location || 'Dakar',
          guestCount: formData.guestCount,
          effectiveGuests: pricing.effectiveGuests,
          message: formData.message,
        },
        configuration: {
          mainBar: formData.mainBar || 'cake-bar',
          hasExtraBar: Boolean(formData.hasExtraBar),
          extraBarType: formData.extraBarType,
          hasDrinks: Boolean(formData.hasDrinks),
          hasCartCustomization: Boolean(formData.hasCartCustomization),
          hasCustomPackaging: Boolean(formData.hasCustomPackaging),
          orderChoices: payload.orderChoices,
          inspirationPhotosCount: formData.inspirationPhotos?.length || 0,
        },
        pricing,
      });
      console.log(`[SendQuote] Booking saved: #${bookingRef} (status: PENDING)`);
    } catch (saveErr: any) {
      console.warn('[SendQuote] Booking storage warning:', saveErr?.message);
    }

    const safeClientName = formData.name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    const pdfFilename = `devis-solly-${safeClientName}-${bookingRef}.pdf`;
    const docxFilename = `devis-solly-${safeClientName}-${bookingRef}.docx`;

    // 4. Generate PDF & DOCX Buffers
    const [pdfBuffer, docxBuffer] = await Promise.all([
      generateQuotePdf(payload),
      generateQuoteDocx(payload),
    ]);

    const internalHtmlContent = generateQuoteHtmlEmail(payload);
    const targetEmail = process.env.EMAIL_TO || 'hello@monsolly.com';

    let internalEmailSent = false;
    let customerEmailSent = false;
    let emailError: string | null = null;

    // 5. Attempt sending via Resend if RESEND_API_KEY is available
    if (process.env.RESEND_API_KEY) {
      try {
        // A. Internal notification to Solly team
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Solly Réservations <hello@monsolly.com>',
            to: [targetEmail],
            subject: `✨ Demande #${bookingRef} : ${formData.name} (${formData.guestCount} pers.)`,
            html: internalHtmlContent,
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
          internalEmailSent = true;
          console.log(`[SendQuote] Internal email successfully sent to ${targetEmail} via Resend`);
        } else {
          const resendErr = await resendRes.text();
          console.warn('[SendQuote] Resend internal email error:', resendErr);
          emailError = resendErr;
        }

        // B. Automatic customer confirmation email if customer provided an email address
        if (formData.email && formData.email.includes('@')) {
          const customerHtmlContent = generateCustomerConfirmationEmailHtml(payload, bookingRef);
          const customerRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || 'Solly <hello@monsolly.com>',
              to: [formData.email.trim()],
              subject: 'Votre demande Solly est bien reçue ♡',
              html: customerHtmlContent,
            }),
          });

          if (customerRes.ok) {
            customerEmailSent = true;
            console.log(`[SendQuote] Confirmation email sent to customer ${formData.email} via Resend`);
          } else {
            console.warn('[SendQuote] Resend customer email error:', await customerRes.text());
          }
        }
      } catch (err: any) {
        console.warn('[SendQuote] Failed sending with Resend:', err?.message);
        emailError = err?.message;
      }
    }

    // 6. Attempt sending via SMTP if configured and internal email was not sent
    if (!internalEmailSent && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const port = Number(process.env.SMTP_PORT) || 465;
        const isSecure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE !== 'false' : port === 465;

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.ionos.fr',
          port: port,
          secure: isSecure,
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

        // Send internal notification
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `Solly Réservations <${process.env.SMTP_USER}>`,
          to: targetEmail,
          subject: `✨ Demande #${bookingRef} : ${formData.name} (${formData.guestCount} pers.)`,
          html: internalHtmlContent,
          attachments: smtpAttachments,
        });

        internalEmailSent = true;
        console.log(`[SendQuote] Internal email successfully sent to ${targetEmail} via SMTP`);

        // Send customer email if provided
        if (formData.email && formData.email.includes('@')) {
          const customerHtmlContent = generateCustomerConfirmationEmailHtml(payload, bookingRef);
          await transporter.sendMail({
            from: process.env.EMAIL_FROM || `Solly <${process.env.SMTP_USER}>`,
            to: formData.email.trim(),
            subject: 'Votre demande Solly est bien reçue ♡',
            html: customerHtmlContent,
          });
          customerEmailSent = true;
          console.log(`[SendQuote] Confirmation email sent to customer ${formData.email} via SMTP`);
        }
      } catch (err: any) {
        console.warn('[SendQuote] Failed sending with SMTP:', err?.message);
        emailError = err?.message;
      }
    }

    // Return response with bookingRef, status, and attachments
    return NextResponse.json({
      success: true,
      bookingRef,
      status: 'PENDING',
      statusLabel: 'Demande reçue',
      emailSent: internalEmailSent,
      customerEmailSent,
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
