import PDFDocument from "pdfkit";

const COLOR = {
  title: "#111827",
  heading: "#111827",
  text: "#374151",
  muted: "#6B7280",
  rule: "#E5E7EB",
};

const FONT = {
  title: 22,
  subtitle: 11.5,
  heading: 13.5,
  text: 10.5,
  footer: 8.5,
};

const MARGIN = { top: 60, bottom: 55, left: 56, right: 56 };

const sanitizeText = (str = "") =>
  String(str)
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-") // hyphen/dash variants -> "-"
    .replace(/[\u2018\u2019]/g, "'") // curly single quotes -> straight
    .replace(/[\u201C\u201D]/g, '"') // curly double quotes -> straight
    .replace(/\u2026/g, "...") // ellipsis -> three dots
    .replace(/[\u00A0\u202F\u2009\u200A]/g, " "); // nbsp/narrow/thin space -> normal space

export const generatePdf = (data = {}) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: MARGIN,
        bufferPages: true,
        info: {
          Title: data.title || "Document",
          Subject: data.subtitle || "",
          Author: "VortexAI",
          Creator: "VortexAI",
        },
      });

      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const width = doc.page.width - MARGIN.left - MARGIN.right;
      const bottomLimit = doc.page.height - MARGIN.bottom;

      const ensureSpace = (neededHeight) => {
        if (doc.y + neededHeight > bottomLimit) doc.addPage();
      };

      // ---- Title ----
      doc
        .font("Helvetica-Bold")
        .fontSize(FONT.title)
        .fillColor(COLOR.title)
        .text(sanitizeText(data.title) || "Untitled Document", { width });

      if (data.subtitle) {
        doc.moveDown(0.25);
        doc
          .font("Helvetica")
          .fontSize(FONT.subtitle)
          .fillColor(COLOR.muted)
          .text(sanitizeText(data.subtitle), { width });
      }

      doc.moveDown(0.5);
      doc
        .strokeColor(COLOR.rule)
        .lineWidth(1)
        .moveTo(MARGIN.left, doc.y)
        .lineTo(doc.page.width - MARGIN.right, doc.y)
        .stroke();
      doc.moveDown(0.75);

      // ---- Block renderers ----
      const heading = (text) => {
        ensureSpace(FONT.heading + 20);
        doc.moveDown(0.6);
        doc
          .font("Helvetica-Bold")
          .fontSize(FONT.heading)
          .fillColor(COLOR.heading)
          .text(sanitizeText(text), { width });
        doc.moveDown(0.25);
      };

      const paragraph = (text) => {
        doc
          .font("Helvetica")
          .fontSize(FONT.text)
          .fillColor(COLOR.text)
          .text(sanitizeText(text), { width, lineGap: 2 });
        doc.moveDown(0.3);
      };

      const list = (items = [], ordered) => {
        items.forEach((item, i) => {
          const marker = ordered ? `${i + 1}.` : "\u2022";
          doc
            .font("Helvetica")
            .fontSize(FONT.text)
            .fillColor(COLOR.text)
            .text(`${marker}  ${sanitizeText(item)}`, { width, lineGap: 2 });
        });
        doc.moveDown(0.3);
      };

      const renderers = {
        heading: (b) => heading(b.text),
        paragraph: (b) => paragraph(b.text),
        bullets: (b) => list(b.items, false),
        numbered: (b) => list(b.items, true),
      };

      (Array.isArray(data.blocks) ? data.blocks : []).forEach((b) => {
        renderers[b?.type]?.(b);
      });

      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);

        const originalBottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;

        doc
          .font("Helvetica")
          .fontSize(FONT.footer)
          .fillColor(COLOR.muted)
          .text(`${i + 1}`, MARGIN.left, doc.page.height - 34, {
            width,
            align: "center",
            lineBreak: false,
          });

        doc.page.margins.bottom = originalBottomMargin;
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
