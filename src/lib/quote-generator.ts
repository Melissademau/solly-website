import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  Packer,
  ShadingType,
  ImageRun,
} from 'docx';

export interface BookingPayload {
  formData: {
    name: string;
    phone: string;
    countryCode?: string;
    eventType: string;
    eventDate: string;
    timeSlot: string;
    guestCount: number;
    location: string;
    message?: string;
    selectedBars: string[];
    experience?: string;
    inspirations?: Array<{ name: string; size: number }>;
    inspirationPhotos?: Array<{ name: string; size: number; dataUrl?: string }>;
  };
  orderChoices: {
    packageType?: string;
    cakeBar?: {
      barquette?: string;
      base?: string;
      sauces: string[];
      composants: string[];
    };
    drinks?: string[];
    charcuterie?: {
      format?: string;
      composants: string[];
    };
  };
}

// Helper to sanitize text for PDF Helvetica (WinAnsi encoding)
function sanitizeForPdf(str: string): string {
  if (!str) return '';
  return str
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '-')
    .replace(/[…]/g, '...')
    .replace(/[✦♡✨🍹🧀🍰🎉❤️]/g, '')
    .trim();
}

/**
 * Generate a PDF Quote Template with Solly Branding
 */
export async function generateQuotePdf(payload: BookingPayload): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Colors
  const pink = rgb(222 / 255, 27 / 255, 82 / 255);       // #DE1B52
  const charcoal = rgb(46 / 255, 28 / 255, 20 / 255);   // #2E1C14
  const softPink = rgb(252 / 255, 236 / 255, 239 / 255); // #FCECEF
  const cream = rgb(250 / 255, 247 / 255, 242 / 255);    // #FAF7F2
  const borderGray = rgb(220 / 255, 220 / 255, 220 / 255);
  const muted = rgb(120 / 255, 120 / 255, 120 / 255);

  const { formData, orderChoices } = payload;
  const quoteRef = `SOL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const quoteDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const eventDateFormatted = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'A definir';

  // 1. TOP HEADER BANNER
  page.drawRectangle({
    x: 0,
    y: 834,
    width: 595.28,
    height: 8,
    color: pink,
  });

  // Real Solly Logo from public/images/solly-logo.png
  const logoPath = path.join(process.cwd(), 'public/images/solly-logo.png');
  let logoLoaded = false;
  try {
    const logoBytes = await fs.promises.readFile(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    // Aspect ratio 802 x 391 -> w: 90, h: 43.88
    page.drawImage(logoImage, {
      x: 40,
      y: 772,
      width: 90,
      height: 43.88,
    });
    logoLoaded = true;
  } catch (err) {
    console.warn('[PDF] Could not embed logo image:', err);
  }

  if (!logoLoaded) {
    page.drawText('SOLLY', {
      x: 40,
      y: 792,
      size: 26,
      font: fontBold,
      color: pink,
    });
  }

  page.drawText('La beaute en bouchees  |  Dakar, Senegal', {
    x: 40,
    y: 757,
    size: 8.5,
    font,
    color: charcoal,
  });
  page.drawText('hello@monsolly.com  |  +221 77 690 04 58', {
    x: 40,
    y: 746,
    size: 8,
    font,
    color: muted,
  });

  // Right Header: Devis Box
  page.drawText('DEVIS EVENEMENT GOURMAND', {
    x: 340,
    y: 795,
    size: 13,
    font: fontBold,
    color: charcoal,
  });
  page.drawText(`Ref : ${quoteRef}`, {
    x: 340,
    y: 780,
    size: 9.5,
    font: fontBold,
    color: pink,
  });
  page.drawText(`Date : ${quoteDate}`, {
    x: 340,
    y: 768,
    size: 8.5,
    font,
    color: muted,
  });
  page.drawText('Devis valable 72 heures', {
    x: 340,
    y: 756,
    size: 8,
    font: fontBold,
    color: pink,
  });

  // 2. CLIENT & EVENT SUMMARY CARD
  page.drawRectangle({
    x: 40,
    y: 658,
    width: 515.28,
    height: 80,
    color: softPink,
    borderColor: pink,
    borderWidth: 0.8,
  });

  page.drawText('RECAPITULATIF CLIENT & EVENEMENT', {
    x: 52,
    y: 724,
    size: 9.5,
    font: fontBold,
    color: pink,
  });

  // Column 1: Client Info
  const fullPhone = `${formData.countryCode || '+221'} ${formData.phone}`.trim();
  page.drawText(`Client : ${sanitizeForPdf(formData.name)}`, { x: 52, y: 708, size: 8.5, font: fontBold, color: charcoal });
  page.drawText(`Telephone : ${sanitizeForPdf(fullPhone)}`, { x: 52, y: 694, size: 8.5, font, color: charcoal });
  page.drawText(`Lieu / Zone : ${sanitizeForPdf(formData.location || 'Dakar')}`, { x: 52, y: 680, size: 8.5, font, color: charcoal });
  page.drawText(`Type : ${sanitizeForPdf(formData.eventType || 'Evenement prive')}`, { x: 52, y: 666, size: 8.5, font, color: charcoal });

  // Column 2: Event Details
  page.drawText(`Date prevue : ${sanitizeForPdf(eventDateFormatted)}`, { x: 300, y: 708, size: 8.5, font: fontBold, color: charcoal });
  page.drawText(`Creneau : ${sanitizeForPdf(formData.timeSlot || 'A convenir')}`, { x: 300, y: 694, size: 8.5, font, color: charcoal });
  page.drawText(`Nombre d'invites : ${formData.guestCount} personnes`, { x: 300, y: 680, size: 8.5, font: fontBold, color: pink });
  if (formData.message) {
    const note = sanitizeForPdf(formData.message).substring(0, 50);
    page.drawText(`Note : ${note}`, { x: 300, y: 666, size: 8, font: fontOblique, color: muted });
  }

  // 3. TABLE OF LINE ITEMS
  const tableY = 635;
  const rowHeight = 44;

  // Table Header Row
  page.drawRectangle({
    x: 40,
    y: tableY - 20,
    width: 515.28,
    height: 20,
    color: pink,
  });
  page.drawText('Prestation / Composition Choisie', { x: 48, y: tableY - 14, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Qte', { x: 315, y: tableY - 14, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Prix Unit. (FCFA)', { x: 365, y: tableY - 14, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Total (FCFA)', { x: 468, y: tableY - 14, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

  // Build Item Rows based on user selections
  interface LineItem {
    title: string;
    details: string;
    qte: string;
    isIncluded?: boolean;
  }
  const items: LineItem[] = [];

  if (formData.selectedBars.includes('cake-bar')) {
    const pkg = orderChoices.packageType || "L'experience Solly (80 000 FCFA)";
    const barq = orderChoices.cakeBar?.barquette || 'Standard Solly';
    const base = orderChoices.cakeBar?.base || 'Vanille';
    const sauces = orderChoices.cakeBar?.sauces?.length ? orderChoices.cakeBar.sauces.join(', ') : 'Chocolat';
    const toppings = orderChoices.cakeBar?.composants?.length ? orderChoices.cakeBar.composants.join(', ') : '6 toppings choisis';
    items.push({
      title: 'Cake Bar Solly (Chariot gourmand)',
      details: `${pkg} | Barquette: ${barq} | Base: ${base} | Sauces: ${sauces} | Toppings: ${toppings}`,
      qte: `${formData.guestCount} pers.`,
    });
  }

  if (formData.selectedBars.includes('drinks')) {
    const juices = orderChoices.drinks?.length ? orderChoices.drinks.join(', ') : 'Bissap, Ananas, Passion';
    items.push({
      title: 'Bar a Boissons Solly (Jus frais locaux)',
      details: `Saveurs selectionnees (3 max) : ${juices} (Servi frais avec verres)`,
      qte: `${formData.guestCount} pers.`,
    });
  }

  if (formData.selectedBars.includes('charcuterie')) {
    const fmt = orderChoices.charcuterie?.format || 'Cornet';
    const comps = orderChoices.charcuterie?.composants?.length ? orderChoices.charcuterie.composants.join(', ') : '6 composants choisis';
    items.push({
      title: 'Bar a Charcuterie & Fromages Solly',
      details: `Format : ${fmt} | Compositions : ${comps}`,
      qte: `${formData.guestCount} pers.`,
    });
  }

  // Mandatory / standard event logistics rows (exactement 2 lignes)
  items.push({
    title: "Inclus dans l'experience",
    details: 'Chariot Solly jaune  -  Service pendant la prestation  -  Demontage',
    qte: '1 forfait',
    isIncluded: true,
  });
  items.push({
    title: 'Logistique & Deplacement (Dakar)',
    details: `Acheminement du materiel a ${sanitizeForPdf(formData.location || 'Dakar')}`,
    qte: '1 forfait',
    isIncluded: false,
  });

  let currentY = tableY - 20;

  items.slice(0, 5).forEach((item, idx) => {
    currentY -= rowHeight;
    const isEven = idx % 2 === 0;

    page.drawRectangle({
      x: 40,
      y: currentY,
      width: 515.28,
      height: rowHeight,
      color: isEven ? rgb(1, 1, 1) : cream,
      borderColor: borderGray,
      borderWidth: 0.5,
    });

    // Title
    page.drawText(sanitizeForPdf(item.title), {
      x: 48,
      y: currentY + 28,
      size: 8.5,
      font: fontBold,
      color: charcoal,
    });

    // Details snippet
    const lineDetails = sanitizeForPdf(item.details).substring(0, 65);
    page.drawText(lineDetails, {
      x: 48,
      y: currentY + 14,
      size: 7.5,
      font,
      color: muted,
    });

    // Qte
    page.drawText(item.qte, {
      x: 315,
      y: currentY + 20,
      size: 8,
      font,
      color: charcoal,
    });

    // PU Box for manual write-in
    page.drawRectangle({
      x: 360,
      y: currentY + 10,
      width: 90,
      height: 22,
      color: rgb(1, 1, 1),
      borderColor: borderGray,
      borderWidth: 0.5,
    });
    if (item.isIncluded) {
      page.drawText('Inclus', {
        x: 390,
        y: currentY + 17,
        size: 8,
        font: fontBold,
        color: pink,
      });
    } else {
      page.drawText('............ FCFA', {
        x: 370,
        y: currentY + 18,
        size: 7.5,
        font: fontOblique,
        color: muted,
      });
    }

    // Total Box for manual write-in
    page.drawRectangle({
      x: 460,
      y: currentY + 10,
      width: 90,
      height: 22,
      color: rgb(1, 1, 1),
      borderColor: borderGray,
      borderWidth: 0.5,
    });
    if (item.isIncluded) {
      page.drawText('Inclus', {
        x: 490,
        y: currentY + 17,
        size: 8,
        font: fontBold,
        color: pink,
      });
    } else {
      page.drawText('............ FCFA', {
        x: 470,
        y: currentY + 18,
        size: 7.5,
        font: fontOblique,
        color: muted,
      });
    }
  });

  // 4. TOTALS RECAP CARD (Right aligned)
  const totalsY = currentY - 66;
  page.drawRectangle({
    x: 300,
    y: totalsY,
    width: 255.28,
    height: 58,
    color: softPink,
    borderColor: pink,
    borderWidth: 0.8,
  });

  page.drawText('Sous-total HT :', { x: 312, y: totalsY + 42, size: 8, font, color: charcoal });
  page.drawText('.................................... FCFA', { x: 400, y: totalsY + 42, size: 8, font: fontBold, color: charcoal });

  page.drawText('TOTAL A PAYER (FCFA) :', { x: 312, y: totalsY + 25, size: 9, font: fontBold, color: pink });
  page.drawText('.................................... FCFA', { x: 420, y: totalsY + 25, size: 9, font: fontBold, color: pink });

  page.drawText('Acompte 70% :', { x: 312, y: totalsY + 9, size: 7.5, font: fontBold, color: charcoal });
  page.drawText('....................... FCFA  |  Solde 30% a Jour J', { x: 375, y: totalsY + 9, size: 7.5, font, color: muted });

  // 5. PAYMENT TERMS & SIGNATURE BOX
  const signY = totalsY - 96;
  page.drawRectangle({
    x: 40,
    y: signY,
    width: 515.28,
    height: 88,
    color: cream,
    borderColor: borderGray,
    borderWidth: 0.6,
  });

  page.drawText('MODALITES DE PAIEMENT & VALIDATION', {
    x: 52,
    y: signY + 74,
    size: 8.5,
    font: fontBold,
    color: pink,
  });
  page.drawText('- Devis valable 72 heures.', {
    x: 52,
    y: signY + 62,
    size: 7.5,
    font: fontBold,
    color: charcoal,
  });
  page.drawText('- Modalites de paiement : 70% a la reservation, 30% a Jour J avant le debut de la prestation.', {
    x: 52,
    y: signY + 50,
    size: 7.5,
    font,
    color: charcoal,
  });
  page.drawText("- La date de l'evenement n'est definitivement reservee qu'apres reception de l'acompte de 70%.", {
    x: 52,
    y: signY + 38,
    size: 7.5,
    font,
    color: charcoal,
  });
  page.drawText("- La reception de l'acompte constitue un accord avec acceptation des CGV sur www.monsolly.com.", {
    x: 52,
    y: signY + 26,
    size: 7.5,
    font,
    color: charcoal,
  });
  page.drawText('- Reglements acceptes : Wave ou Orange Money au +221 77 690 04 58, ou Virement bancaire.', {
    x: 52,
    y: signY + 14,
    size: 7,
    font,
    color: muted,
  });
  page.drawText('Bon pour accord (Date et Signature client) : .............................................................', {
    x: 52,
    y: signY + 3,
    size: 7.5,
    font: fontBold,
    color: charcoal,
  });

  // 6. FOOTER
  page.drawText('Solly  -  La beaute en bouchees  -  Dakar plus sucre', {
    x: 180,
    y: 20,
    size: 8,
    font: fontOblique,
    color: muted,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Generate a Word (.docx) Quote Template with Solly Branding
 */
export async function generateQuoteDocx(payload: BookingPayload): Promise<Buffer> {
  const { formData, orderChoices } = payload;
  const quoteRef = `SOL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const quoteDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const eventDateFormatted = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'À définir';
  const fullPhone = `${formData.countryCode || '+221'} ${formData.phone}`.trim();

  // Load official Solly logo for DOCX
  const logoPath = path.join(process.cwd(), 'public/images/solly-logo.png');
  let logoBuffer: Buffer | null = null;
  try {
    logoBuffer = await fs.promises.readFile(logoPath);
  } catch (err) {
    console.warn('[DOCX] Could not read logo image:', err);
  }

  // Prepare items for DOCX table
  interface DocxLineItem {
    title: string;
    details: string;
    qte: string;
    isIncluded?: boolean;
  }
  const items: DocxLineItem[] = [];

  if (formData.selectedBars.includes('cake-bar')) {
    const pkg = orderChoices.packageType || "L'expérience Solly (80 000 FCFA)";
    const barq = orderChoices.cakeBar?.barquette || 'Standard Solly';
    const base = orderChoices.cakeBar?.base || 'Vanille';
    const sauces = orderChoices.cakeBar?.sauces?.length ? orderChoices.cakeBar.sauces.join(', ') : 'Chocolat';
    const toppings = orderChoices.cakeBar?.composants?.length ? orderChoices.cakeBar.composants.join(', ') : '6 toppings choisis';
    items.push({
      title: 'Cake Bar Solly (Chariot gourmand)',
      details: `${pkg}\nBarquette : ${barq} | Base : ${base}\nSauces : ${sauces}\nToppings : ${toppings}`,
      qte: `${formData.guestCount} personnes`,
      isIncluded: false,
    });
  }

  if (formData.selectedBars.includes('drinks')) {
    const juices = orderChoices.drinks?.length ? orderChoices.drinks.join(', ') : 'Bissap glacé, Jus d’ananas, Orange-passion';
    items.push({
      title: 'Bar à Boissons Solly (Jus frais locaux)',
      details: `Saveurs sélectionnées (3 max) : ${juices}\nServi frais avec verres, pailles et garnitures`,
      qte: `${formData.guestCount} personnes`,
      isIncluded: false,
    });
  }

  if (formData.selectedBars.includes('charcuterie')) {
    const fmt = orderChoices.charcuterie?.format || 'Cornet';
    const comps = orderChoices.charcuterie?.composants?.length ? orderChoices.charcuterie.composants.join(', ') : '6 composants choisis';
    items.push({
      title: 'Bar à Charcuterie & Fromages Solly',
      details: `Format : ${fmt}\nIngrédients : ${comps}`,
      qte: `${formData.guestCount} personnes`,
      isIncluded: false,
    });
  }

  // Mandatory / standard event logistics rows (exactement 2 lignes)
  items.push({
    title: 'Inclus dans l’expérience',
    details: 'Chariot Solly jaune · Service pendant la prestation · Démontage',
    qte: '1 forfait',
    isIncluded: true,
  });
  items.push({
    title: 'Logistique & Déplacement (Dakar)',
    details: `Acheminement sécurisé et retour du matériel à ${formData.location || 'Dakar'}`,
    qte: '1 forfait',
    isIncluded: false,
  });

  const tableRows = [
    // Header Row
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Prestation & Compositions', bold: true, color: 'FFFFFF' })] })],
          shading: { fill: 'DE1B52', type: ShadingType.CLEAR },
          width: { size: 50, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Quantité', bold: true, color: 'FFFFFF' })] })],
          shading: { fill: 'DE1B52', type: ShadingType.CLEAR },
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Prix Unit. (FCFA)', bold: true, color: 'FFFFFF' })] })],
          shading: { fill: 'DE1B52', type: ShadingType.CLEAR },
          width: { size: 18, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Total (FCFA)', bold: true, color: 'FFFFFF' })] })],
          shading: { fill: 'DE1B52', type: ShadingType.CLEAR },
          width: { size: 17, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
    // Content rows
    ...items.map(
      (item) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: item.title, bold: true, color: '2E1C14' })],
                }),
                ...item.details.split('\n').map(
                  (line) =>
                    new Paragraph({
                      children: [new TextRun({ text: line, size: 18, color: '666666' })],
                    })
                ),
              ],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: item.qte, size: 20 })] })],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun(
                      item.isIncluded
                        ? { text: 'Inclus', bold: true, color: 'DE1B52' }
                        : { text: '..................... FCFA', color: '999999' }
                    ),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun(
                      item.isIncluded
                        ? { text: 'Inclus', bold: true, color: 'DE1B52' }
                        : { text: '..................... FCFA', color: '999999' }
                    ),
                  ],
                }),
              ],
            }),
          ],
        })
    ),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Real Solly Logo
          ...(logoBuffer
            ? [
                new Paragraph({
                  children: [
                    new ImageRun({
                      type: 'png',
                      data: logoBuffer,
                      transformation: { width: 130, height: 63 },
                    }),
                  ],
                  spacing: { after: 120 },
                }),
              ]
            : [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'SOLLY', bold: true, size: 44, color: 'DE1B52' }),
                  ],
                }),
              ]),
          new Paragraph({
            children: [
              new TextRun({ text: 'DEVIS ÉVÉNEMENT GOURMAND', bold: true, size: 26, color: '2E1C14' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'La beauté en bouchées • Dakar, Sénégal • hello@monsolly.com • +221 77 690 04 58',
                size: 18,
                color: '666666',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Référence : ${quoteRef}  |  Date : ${quoteDate}  |  Devis valable 72 heures`, bold: true, size: 20, color: 'DE1B52' }),
            ],
            spacing: { after: 200 },
          }),

          // Client block
          new Paragraph({
            children: [new TextRun({ text: 'INFORMATIONS CLIENT & ÉVÉNEMENT', bold: true, size: 22, color: 'DE1B52' })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Client : `, bold: true }),
              new TextRun({ text: formData.name }),
              new TextRun({ text: `   |   Téléphone : `, bold: true }),
              new TextRun({ text: fullPhone }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Type d'événement : `, bold: true }),
              new TextRun({ text: formData.eventType }),
              new TextRun({ text: `   |   Date de l'événement : `, bold: true }),
              new TextRun({ text: eventDateFormatted }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Lieu / Quartier : `, bold: true }),
              new TextRun({ text: formData.location || 'Dakar' }),
              new TextRun({ text: `   |   Nombre d'invités : `, bold: true }),
              new TextRun({ text: `${formData.guestCount} personnes`, bold: true, color: 'DE1B52' }),
              new TextRun({ text: `   |   Créneau : `, bold: true }),
              new TextRun({ text: formData.timeSlot || 'Après-midi' }),
            ],
          }),
          ...(formData.message
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: `Note particulière : `, bold: true }),
                    new TextRun({ text: formData.message, italics: true }),
                  ],
                }),
              ]
            : []),
          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Table
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Totals block
          new Paragraph({
            children: [
              new TextRun({ text: 'RÉCAPITULATIF FINANCIER', bold: true, size: 22, color: 'DE1B52' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Sous-total HT : ................................................................ FCFA\n' }),
              new TextRun({ text: 'TOTAL À PAYER TTC : .................................................... FCFA\n', bold: true, color: 'DE1B52' }),
              new TextRun({ text: 'Acompte de réservation (70%) : ................................... FCFA\n' }),
              new TextRun({ text: 'Solde restant (30% à Jour J avant le début de la prestation) : ................. FCFA' }),
            ],
            spacing: { after: 200 },
          }),

          // Terms
          new Paragraph({
            children: [
              new TextRun({ text: 'MODALITÉS DE RÈGLEMENT & VALIDATION', bold: true, size: 20, color: '2E1C14' }),
            ],
            spacing: { before: 100, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  '• Devis valable 72 heures.\n' +
                  '• Modalités de paiement : 70 % à la réservation, 30 % à Jour J avant le début de la prestation.\n' +
                  '• La date de l’événement n’est définitivement réservée qu’après réception de l’acompte de 70 % et la réception de l’acompte constitue un accord avec acceptation des CGV dans le site www.monsolly.com.\n' +
                  '• Modes de règlement acceptés : Wave ou Orange Money au +221 77 690 04 58, ou Virement bancaire.\n\n' +
                  'Bon pour accord (Date et Signature du client) : ............................................................................',
                size: 19,
                color: '333333',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

/**
 * Format HTML notification email for hello@monsolly.com
 */
export function generateQuoteHtmlEmail(payload: BookingPayload): string {
  const { formData, orderChoices } = payload;
  const fullPhone = `${formData.countryCode || '+221'} ${formData.phone}`.trim();
  const eventDateFormatted = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'À convenir';

  const barsLabels: string[] = [];
  if (formData.selectedBars.includes('cake-bar')) barsLabels.push('Cake Bar');
  if (formData.selectedBars.includes('drinks')) barsLabels.push('Bar à boissons');
  if (formData.selectedBars.includes('charcuterie')) barsLabels.push('Bar à charcuterie');

  const waLink = `https://wa.me/${formData.countryCode ? formData.countryCode.replace(/\+/g, '') : '221'}${formData.phone.replace(/\s+/g, '')}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouvelle demande de réservation Solly</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 24px; color: #2E1C14;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; border: 1px solid #FCECEF; overflow: hidden; box-shadow: 0 4px 20px rgba(222, 27, 82, 0.08);">
    <!-- Header with Authentic Solly Logo -->
    <div style="background: #ffffff; border-bottom: 2px solid #FCECEF; padding: 24px 20px; text-align: center;">
      <img src="https://www.monsolly.com/images/solly-logo.png" alt="SOLLY" style="height: 46px; width: auto; max-width: 140px; display: block; margin: 0 auto 8px;" />
      <h2 style="margin: 0; font-size: 18px; font-weight: 800; color: #DE1B52;">Nouvelle demande de réservation</h2>
      <p style="margin: 4px 0 0; font-size: 13px; color: #777;">monsolly.com · Dakar, Sénégal · Devis valable 72h</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 24px 28px;">
      <p style="font-size: 15px; line-height: 1.5; color: #2E1C14; margin-top: 0;">
        Bonjour l'équipe Solly,<br><br>
        Une nouvelle demande de réservation vient d'être enregistrée sur <strong>monsolly.com</strong>.
        Vous trouverez ci-joint le <strong>devis pré-rempli au format PDF</strong> et au format <strong>Word (.docx)</strong>, prêt à être complété avec les montants et envoyé au client.
      </p>

      <!-- Client Details Box -->
      <div style="background: #FCECEF; border-radius: 16px; padding: 18px 20px; margin: 20px 0; border: 1px solid #fad2dc;">
        <h3 style="margin: 0 0 12px; color: #DE1B52; font-size: 16px;">👤 Coordonnées du client</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #666;">Nom :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #2E1C14;">${formData.name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Téléphone :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #2E1C14;">
              <a href="tel:${fullPhone}" style="color: #DE1B52; text-decoration: none;">${fullPhone}</a>
              <span style="margin-left: 8px;">(<a href="${waLink}" style="color: #25D366; font-weight: bold; text-decoration: none;">Ouvrir sur WhatsApp</a>)</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Zone / Lieu :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #2E1C14;">${formData.location || 'Dakar'}</td>
          </tr>
        </table>
      </div>

      <!-- Event Details Box -->
      <div style="background: #FAF7F2; border-radius: 16px; padding: 18px 20px; margin: 20px 0; border: 1px solid #ede8e1;">
        <h3 style="margin: 0 0 12px; color: #DE1B52; font-size: 16px;">🎉 Détails de l'événement</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #666;">Type :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #2E1C14;">${formData.eventType}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Date :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #2E1C14;">${eventDateFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Créneau :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #2E1C14;">${formData.timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Invités :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #DE1B52;">${formData.guestCount} personnes</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Bars choisis :</td>
            <td style="padding: 4px 0; font-weight: bold; color: #2E1C14;">${barsLabels.join(' + ') || 'Aucun bar'}</td>
          </tr>
          ${formData.message ? `
          <tr>
            <td style="padding: 4px 0; color: #666;">Note client :</td>
            <td style="padding: 4px 0; font-style: italic; color: #2E1C14;">${formData.message}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <!-- Selections Summary -->
      ${formData.selectedBars.includes('cake-bar') && orderChoices.cakeBar ? `
      <div style="border-left: 3px solid #DE1B52; padding-left: 14px; margin-bottom: 14px;">
        <strong style="color: #DE1B52; font-size: 14px;">🍰 Cake Bar :</strong><br>
        <span style="font-size: 13px; color: #444;">
          Formule : ${orderChoices.packageType || 'L’expérience Solly'}<br>
          Base : ${orderChoices.cakeBar.base || 'Vanille'} | Barquette : ${orderChoices.cakeBar.barquette || 'Standard'}<br>
          Sauces : ${orderChoices.cakeBar.sauces.join(', ') || 'Chocolat'}<br>
          Toppings (6) : ${orderChoices.cakeBar.composants.join(', ') || '6 toppings choisis'}
        </span>
      </div>
      ` : ''}

      ${formData.selectedBars.includes('drinks') && orderChoices.drinks ? `
      <div style="border-left: 3px solid #DE1B52; padding-left: 14px; margin-bottom: 14px;">
        <strong style="color: #DE1B52; font-size: 14px;">🍹 Bar à Boissons (3 max) :</strong><br>
        <span style="font-size: 13px; color: #444;">
          Jus : ${orderChoices.drinks.join(', ')}
        </span>
      </div>
      ` : ''}

      ${formData.selectedBars.includes('charcuterie') && orderChoices.charcuterie ? `
      <div style="border-left: 3px solid #DE1B52; padding-left: 14px; margin-bottom: 14px;">
        <strong style="color: #DE1B52; font-size: 14px;">🧀 Bar à Charcuterie :</strong><br>
        <span style="font-size: 13px; color: #444;">
          Format : ${orderChoices.charcuterie.format || 'Cornet'}<br>
          Composants (6) : ${orderChoices.charcuterie.composants.join(', ')}
        </span>
      </div>
      ` : ''}

      <!-- Services & Logistique (2 lignes clés) -->
      <div style="background: #FAF7F2; border-radius: 14px; padding: 14px 18px; margin: 16px 0; border: 1px solid #ede8e1;">
        <div style="font-size: 13px; color: #2E1C14; margin-bottom: 6px;">
          ✓ <strong>Inclus dans l’expérience :</strong> Chariot Solly jaune · Service pendant la prestation · Démontage
        </div>
        <div style="font-size: 13px; color: #2E1C14;">
          🚚 <strong>Logistique & Déplacement :</strong> Acheminement sécurisé à ${formData.location || 'Dakar'}
        </div>
      </div>

      <!-- Conditions Reminder -->
      <div style="margin: 16px 0; padding: 12px 16px; background: #FFF8E3; border-radius: 12px; border: 1px solid #FDE68A; font-size: 12px; color: #854D0E;">
        ⏱️ <strong>Modalités de paiement :</strong> 70 % à la réservation, 30 % à Jour J avant le début de la prestation.<br>
        • Devis valable <strong>72 heures</strong>.<br>
        • La date de l’événement n’est définitivement réservée qu’après réception de l’acompte de 70 % (constitue acceptation des CGV sur monsolly.com).
      </div>

      ${formData.inspirationPhotos && formData.inspirationPhotos.length > 0 ? `
      <div style="background: #FFF8E3; border-radius: 16px; padding: 18px 20px; margin: 20px 0; border: 1px solid #fde68a;">
        <h3 style="margin: 0 0 8px; color: #b45309; font-size: 16px;">📸 Photos d'inspiration (${formData.inspirationPhotos.length})</h3>
        <p style="font-size: 12px; color: #78350f; margin: 0 0 12px;">Le client a joint ${formData.inspirationPhotos.length} photo(s) (également attachée(s) en pièces jointes) :</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${formData.inspirationPhotos.map((photo, i) => photo.dataUrl ? `
            <div style="text-align: center;">
              <img src="${photo.dataUrl}" alt="${photo.name || 'Photo'}" style="max-width: 240px; max-height: 180px; border-radius: 12px; border: 1px solid #e5e7eb; object-fit: cover;" /><br>
              <span style="font-size: 11px; color: #666;">${photo.name || `Photo ${i + 1}`}</span>
            </div>
          ` : '').join('')}
        </div>
      </div>
      ` : ''}

      <!-- Attachments note -->
      <div style="margin-top: 24px; padding: 14px; background: #fff8eb; border-radius: 12px; border: 1px solid #ffe8b5; font-size: 13px; color: #8a5300;">
        📎 <strong>Pièces jointes incluses :</strong><br>
        1. <strong>devis-solly-${formData.name.toLowerCase().replace(/\s+/g, '-')}.pdf</strong> : Devis avec logo officiel Solly, prêt à imprimer ou annoter.<br>
        2. <strong>devis-solly-${formData.name.toLowerCase().replace(/\s+/g, '-')}.docx</strong> : Fichier Word éditable pour insérer directement vos prix.<br>
        ${formData.inspirationPhotos && formData.inspirationPhotos.length > 0 ? `3. <strong>${formData.inspirationPhotos.length} photo(s) d'inspiration</strong> en pièce jointe.` : ''}
      </div>

      <!-- Quick Action Button -->
      <div style="text-align: center; margin-top: 28px;">
        <a href="${waLink}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: bold; font-size: 14px;">
          Contacter le client sur WhatsApp →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #FAF7F2; border-top: 1px solid #ede8e1; padding: 16px; text-align: center; font-size: 11px; color: #888;">
      Solly  -  La beauté en bouchées  -  Dakar plus sucré ♡<br>
      © ${new Date().getFullYear()} Solly. Tous droits réservés.
    </div>
  </div>
</body>
</html>
  `;
}
