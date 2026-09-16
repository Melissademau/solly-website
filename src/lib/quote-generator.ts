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

  // Solly Logo text & subtitle
  page.drawText('SOLLY', {
    x: 40,
    y: 795,
    size: 26,
    font: fontBold,
    color: pink,
  });
  page.drawText('La beaute en bouchees  |  Dakar, Senegal', {
    x: 40,
    y: 780,
    size: 9,
    font,
    color: charcoal,
  });
  page.drawText('hello@monsolly.com  |  +221 77 690 04 58', {
    x: 40,
    y: 768,
    size: 8.5,
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

  // 2. CLIENT & EVENT SUMMARY CARD
  page.drawRectangle({
    x: 40,
    y: 672,
    width: 515.28,
    height: 82,
    color: softPink,
    borderColor: pink,
    borderWidth: 0.8,
  });

  page.drawText('RECAPITULATIF CLIENT & EVENEMENT', {
    x: 52,
    y: 738,
    size: 9.5,
    font: fontBold,
    color: pink,
  });

  // Column 1: Client Info
  const fullPhone = `${formData.countryCode || '+221'} ${formData.phone}`.trim();
  page.drawText(`Client : ${sanitizeForPdf(formData.name)}`, { x: 52, y: 720, size: 8.5, font: fontBold, color: charcoal });
  page.drawText(`Telephone : ${sanitizeForPdf(fullPhone)}`, { x: 52, y: 706, size: 8.5, font, color: charcoal });
  page.drawText(`Lieu / Zone : ${sanitizeForPdf(formData.location || 'Dakar')}`, { x: 52, y: 692, size: 8.5, font, color: charcoal });
  page.drawText(`Type : ${sanitizeForPdf(formData.eventType || 'Evenement prive')}`, { x: 52, y: 678, size: 8.5, font, color: charcoal });

  // Column 2: Event Details
  page.drawText(`Date prevue : ${sanitizeForPdf(eventDateFormatted)}`, { x: 300, y: 720, size: 8.5, font: fontBold, color: charcoal });
  page.drawText(`Creneau : ${sanitizeForPdf(formData.timeSlot || 'A convenir')}`, { x: 300, y: 706, size: 8.5, font, color: charcoal });
  page.drawText(`Nombre d'invites : ${formData.guestCount} personnes`, { x: 300, y: 692, size: 8.5, font: fontBold, color: pink });
  if (formData.message) {
    const note = sanitizeForPdf(formData.message).substring(0, 50);
    page.drawText(`Note : ${note}`, { x: 300, y: 678, size: 8, font: fontOblique, color: muted });
  }

  // 3. TABLE OF LINE ITEMS
  const tableY = 645;
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
  }
  const items: LineItem[] = [];

  if (formData.selectedBars.includes('cake-bar')) {
    const pkg = orderChoices.packageType || "L'experience Solly (80 000 FCFA)";
    const barq = orderChoices.cakeBar?.barquette || 'Standard Solly';
    const base = orderChoices.cakeBar?.base || 'Vanille';
    const sauces = orderChoices.cakeBar?.sauces?.length ? orderChoices.cakeBar.sauces.join(', ') : 'Chocolat';
    const toppings = orderChoices.cakeBar?.composants?.length ? orderChoices.cakeBar.composants.join(', ') : 'Oreo, Speculoos';
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
      details: `Saveurs selectionnees : ${juices} (Servi frais avec verres et garnitures)`,
      qte: `${formData.guestCount} pers.`,
    });
  }

  if (formData.selectedBars.includes('charcuterie')) {
    const fmt = orderChoices.charcuterie?.format || 'Cornet';
    const comps = orderChoices.charcuterie?.composants?.length ? orderChoices.charcuterie.composants.join(', ') : 'Rosettes, Fromage, Olives, Crackers';
    items.push({
      title: 'Bar a Charcuterie & Fromages Solly',
      details: `Format : ${fmt} | Compositions : ${comps}`,
      qte: `${formData.guestCount} pers.`,
    });
  }

  // Mandatory / standard event logistics rows
  items.push({
    title: 'Chariot Solly, Nappage & Arts de la table',
    details: 'Chariot rose & creme signature, bonbonnieres, contenants et signaletique',
    qte: '1 forfait',
  });
  items.push({
    title: 'Service, Maitre de Bar & Animation',
    details: "Installation, service attentif tout au long de l'evenement et demontage",
    qte: '1 forfait',
  });
  items.push({
    title: 'Logistique & Deplacement (Dakar)',
    details: `Acheminement du materiel a ${sanitizeForPdf(formData.location || 'Dakar')}`,
    qte: '1 forfait',
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

    // Details snippet (truncated if needed)
    const lineDetails = sanitizeForPdf(item.details).substring(0, 55);
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
    page.drawText('............ FCFA', {
      x: 370,
      y: currentY + 18,
      size: 7.5,
      font: fontOblique,
      color: muted,
    });

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
    page.drawText('............ FCFA', {
      x: 470,
      y: currentY + 18,
      size: 7.5,
      font: fontOblique,
      color: muted,
    });
  });

  // 4. TOTALS RECAP CARD (Right aligned)
  const totalsY = currentY - 80;
  page.drawRectangle({
    x: 300,
    y: totalsY,
    width: 255.28,
    height: 70,
    color: softPink,
    borderColor: pink,
    borderWidth: 0.8,
  });

  page.drawText('Sous-total HT :', { x: 312, y: totalsY + 52, size: 8, font, color: charcoal });
  page.drawText('.................................... FCFA', { x: 400, y: totalsY + 52, size: 8, font: fontBold, color: charcoal });

  page.drawText('Remise commerciale :', { x: 312, y: totalsY + 38, size: 8, font, color: charcoal });
  page.drawText('.................................... FCFA', { x: 400, y: totalsY + 38, size: 8, font, color: charcoal });

  page.drawText('TOTAL A PAYER (FCFA) :', { x: 312, y: totalsY + 20, size: 9, font: fontBold, color: pink });
  page.drawText('.................................... FCFA', { x: 420, y: totalsY + 20, size: 9, font: fontBold, color: pink });

  page.drawText('Acompte 50% :', { x: 312, y: totalsY + 6, size: 7.5, font, color: muted });
  page.drawText('....................... FCFA  |  Solde le jour J', { x: 375, y: totalsY + 6, size: 7.5, font, color: muted });

  // 5. PAYMENT TERMS & SIGNATURE BOX
  const signY = totalsY - 75;
  page.drawRectangle({
    x: 40,
    y: signY,
    width: 515.28,
    height: 65,
    color: cream,
    borderColor: borderGray,
    borderWidth: 0.6,
  });

  page.drawText('CONDITIONS DE REGLEMENT & VALIDATION', {
    x: 52,
    y: signY + 50,
    size: 8.5,
    font: fontBold,
    color: pink,
  });
  page.drawText('- Devis valable 15 jours. Confirmation par acompte de 50%.', {
    x: 52,
    y: signY + 36,
    size: 7.5,
    font,
    color: charcoal,
  });
  page.drawText('- Paiement accepte : Wave ou Orange Money au +221 77 690 04 58, ou Especes/Virement.', {
    x: 52,
    y: signY + 24,
    size: 7.5,
    font,
    color: charcoal,
  });
  page.drawText('Bon pour accord (Date et Signature client) :', {
    x: 52,
    y: signY + 10,
    size: 8,
    font: fontBold,
    color: charcoal,
  });
  page.drawText('....................................................................', {
    x: 235,
    y: signY + 10,
    size: 8,
    font,
    color: muted,
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

  // Prepare items for DOCX table
  interface DocxLineItem {
    title: string;
    details: string;
    qte: string;
  }
  const items: DocxLineItem[] = [];

  if (formData.selectedBars.includes('cake-bar')) {
    const pkg = orderChoices.packageType || "L'expérience Solly (80 000 FCFA)";
    const barq = orderChoices.cakeBar?.barquette || 'Standard Solly';
    const base = orderChoices.cakeBar?.base || 'Vanille';
    const sauces = orderChoices.cakeBar?.sauces?.length ? orderChoices.cakeBar.sauces.join(', ') : 'Chocolat';
    const toppings = orderChoices.cakeBar?.composants?.length ? orderChoices.cakeBar.composants.join(', ') : 'Oreo, Spéculoos';
    items.push({
      title: 'Cake Bar Solly (Chariot gourmand)',
      details: `${pkg}\nBarquette : ${barq} | Base : ${base}\nSauces : ${sauces}\nToppings : ${toppings}`,
      qte: `${formData.guestCount} personnes`,
    });
  }

  if (formData.selectedBars.includes('drinks')) {
    const juices = orderChoices.drinks?.length ? orderChoices.drinks.join(', ') : 'Bissap glacé, Jus d’ananas, Orange-passion';
    items.push({
      title: 'Bar à Boissons Solly (Jus frais locaux)',
      details: `Saveurs sélectionnées : ${juices}\nServi frais avec verres, pailles et garnitures`,
      qte: `${formData.guestCount} personnes`,
    });
  }

  if (formData.selectedBars.includes('charcuterie')) {
    const fmt = orderChoices.charcuterie?.format || 'Cornet';
    const comps = orderChoices.charcuterie?.composants?.length ? orderChoices.charcuterie.composants.join(', ') : 'Rosettes, Fromage doux, Olives, Crackers';
    items.push({
      title: 'Bar à Charcuterie & Fromages Solly',
      details: `Format : ${fmt}\nIngrédients : ${comps}`,
      qte: `${formData.guestCount} personnes`,
    });
  }

  items.push({
    title: 'Chariot Solly, Décoration & Arts de la table',
    details: 'Chariot rose & crème signature Solly, bonbonnières, contenants personnalisés, nappage et signalétique festive',
    qte: '1 forfait',
  });
  items.push({
    title: 'Service, Maître de Bar & Animation',
    details: "Installation complète, service souriant tout au long de l'événement et démontage par l'équipe Solly",
    qte: '1 forfait',
  });
  items.push({
    title: 'Logistique & Déplacement (Dakar)',
    details: `Acheminement sécurisé et retour du matériel à ${formData.location || 'Dakar'}`,
    qte: '1 forfait',
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
                  children: [new TextRun({ text: '..................... FCFA', color: '999999' })],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: '..................... FCFA', color: '999999' })],
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
          // Solly Title
          new Paragraph({
            children: [
              new TextRun({ text: 'SOLLY', bold: true, size: 44, color: 'DE1B52' }),
              new TextRun({ text: '  —  DEVIS ÉVÉNEMENT GOURMAND', bold: true, size: 26, color: '2E1C14' }),
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
              new TextRun({ text: `Référence : ${quoteRef}  |  Date : ${quoteDate}`, bold: true, size: 20, color: 'DE1B52' }),
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
              new TextRun({ text: 'RÉCAPITULATIF FINANCIER (À COMPLÉTER)', bold: true, size: 22, color: 'DE1B52' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Sous-total HT : ................................................................ FCFA\n' }),
              new TextRun({ text: 'Remise commerciale : ..................................................... FCFA\n' }),
              new TextRun({ text: 'TOTAL À PAYER TTC : .................................................... FCFA\n', bold: true, color: 'DE1B52' }),
              new TextRun({ text: 'Acompte de réservation (50%) : ................................... FCFA\n' }),
              new TextRun({ text: 'Solde restant le jour J (50%) : .................................... FCFA' }),
            ],
            spacing: { after: 200 },
          }),

          // Terms
          new Paragraph({
            children: [
              new TextRun({ text: 'MODALITÉS DE RÈGLEMENT & VALIDATION', bold: true, size: 20, color: '2E1C14' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Acompte de 50% exigé pour le blocage de la date et de l’équipe Solly.\n• Paiement par Wave ou Orange Money au +221 77 690 04 58 ou Virement.\n• Solde de 50% réglable sur place le jour de l’événement.\n\nBon pour accord (Date et Signature du client) : ............................................................................',
                size: 19,
                color: '444444',
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
    <!-- Header -->
    <div style="background: #DE1B52; padding: 28px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px;">SOLLY</h1>
      <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95;">Nouvelle demande de réservation reçue ! ✨</p>
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
          Toppings : ${orderChoices.cakeBar.composants.join(', ') || 'Oreo'}
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
          Ingrédients : ${orderChoices.charcuterie.composants.join(', ')}
        </span>
      </div>
      ` : ''}

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
        1. <strong>devis-solly-${formData.name.toLowerCase().replace(/\s+/g, '-')}.pdf</strong> : Devis prêt à être imprimé ou annoté.<br>
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
