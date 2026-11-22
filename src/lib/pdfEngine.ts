import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export interface PdfFieldOverlay {
  pageIndex: number;
  x: number; // in PDF points
  y: number; // in PDF points (from bottom-left)
  text: string;
  fontSize?: number;
  whiteout?: boolean; // Draws white rect before drawing text
  whiteoutWidth?: number;
  whiteoutHeight?: number;
}

export interface GeneratePdfOptions {
  title: string;
  isDraft?: boolean;
  fields?: PdfFieldOverlay[];
  verificationHash?: string;
  contentParagraphs?: string[];
}

/**
 * Creates or modifies a PDF with professional typography, diagonal draft watermark, and QR verification stamp.
 */
export async function generateLegalPdf(options: GeneratePdfOptions): Promise<Uint8Array> {
  const { title, isDraft = true, verificationHash, contentParagraphs = [] } = options;

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Standard A4 dimensions: 595.28 x 841.89 points
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  let currentY = height - 60;

  // Header Title
  page.drawText(title, {
    x: 50,
    y: currentY,
    size: 16,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16), // #0F172A
  });

  currentY -= 30;

  // Thin separator rule
  page.drawLine({
    start: { x: 50, y: currentY },
    end: { x: width - 50, y: currentY },
    thickness: 1,
    color: rgb(0.88, 0.91, 0.94), // #E2E8F0
  });

  currentY -= 25;

  // Render Content Paragraphs with automatic line wrapping
  for (const paragraph of contentParagraphs) {
    if (!paragraph.trim()) {
      currentY -= 15;
      continue;
    }

    const words = paragraph.split(" ");
    let line = "";
    const maxWidth = width - 100;

    for (const word of words) {
      const testLine = line + (line ? " " : "") + word;
      const textWidth = fontRegular.widthOfTextAtSize(testLine, 10);
      if (textWidth > maxWidth) {
        page.drawText(line, {
          x: 50,
          y: currentY,
          size: 10,
          font: fontRegular,
          color: rgb(0.2, 0.25, 0.33),
        });
        currentY -= 16;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 10,
        font: fontRegular,
        color: rgb(0.2, 0.25, 0.33),
      });
      currentY -= 20;
    }
  }

  // Draw Diagonal Draft Watermark if flagged as draft
  if (isDraft) {
    const watermarkText = "DRAFT — FOR VERIFICATION ONLY";
    page.drawText(watermarkText, {
      x: 60,
      y: 220,
      size: 32,
      font: fontBold,
      color: rgb(0.85, 0.2, 0.2), // Red
      opacity: 0.18,
      rotate: degrees(45),
    });
  }

  // Draw QR Code Authenticity Stamp if hash provided
  if (verificationHash) {
    try {
      const verifyUrl = `https://deedflow.in/verify/${verificationHash}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 70 });
      const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      const qrSize = 55;
      page.drawImage(qrImage, {
        x: width - 50 - qrSize,
        y: 45,
        width: qrSize,
        height: qrSize,
      });

      page.drawText("Scan to verify authenticity", {
        x: width - 50 - qrSize - 120,
        y: 65,
        size: 8,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.55),
      });
      page.drawText(`Ref: ${verificationHash.slice(0, 16)}...`, {
        x: width - 50 - qrSize - 120,
        y: 53,
        size: 7,
        font: fontRegular,
        color: rgb(0.55, 0.6, 0.7),
      });
    } catch {
      // Gracefully continue without QR if rendering fails
    }
  }

  return await pdfDoc.save();
}
