import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  PageNumber,
  PageBreak,
  TabStopType,
  TabStopPosition,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import { formatDatum } from "./formatters";

// ============================================================
// VERTRAGSNUMMER GENERIEREN
// ============================================================
export function generiereVertragsnummer(prefix = "EPV") {
  const datum = new Date();
  const y = datum.getFullYear().toString().slice(-2);
  const m = String(datum.getMonth() + 1).padStart(2, "0");
  const id = crypto.randomUUID().slice(0, 8).toUpperCase();
  return `${prefix}-${y}${m}-${id}`;
}

// ============================================================
// ELITE PV DOCX CONSTANTS
// ============================================================
const ELITE_BLUE = "4AB4D4";
const ELITE_YELLOW = "F5C518";
const ELITE_DARK = "1C1C1C";
const ELITE_MID = "888888";

const PAGE_WIDTH_DXA = 11906; // A4
const PAGE_HEIGHT_DXA = 16838;
const MARGIN_LEFT_DXA = 1700; // ~3.0 cm (Platz für Lochung)
const MARGIN_DXA = 1440; // 1 inch = ~2.54cm
const CONTENT_WIDTH_DXA = PAGE_WIDTH_DXA - MARGIN_LEFT_DXA - MARGIN_DXA; // ~8766

const BORDER_LIGHT = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: "DDDDDD",
};
const BORDERS_LIGHT = {
  top: BORDER_LIGHT,
  bottom: BORDER_LIGHT,
  left: BORDER_LIGHT,
  right: BORDER_LIGHT,
};

// ============================================================
// DOCX HEADER (Briefkopf)
// ============================================================
export function createDocxHeader(documentTitle, documentSubtitle) {
  const paragraphs = [];

  // Firmenname + Adresse
  paragraphs.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Elite PV GmbH",
          bold: true,
          size: 28,
          font: "DM Sans",
          color: ELITE_DARK,
        }),
        new TextRun({
          text: "  |  Lindenhof 4b, 92670 Windischeschenbach",
          size: 18,
          font: "DM Sans",
          color: ELITE_MID,
        }),
      ],
    })
  );

  // Gelbe Trennlinie
  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: ELITE_YELLOW,
          space: 1,
        },
      },
      children: [],
    })
  );

  // Dokumenttitel
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [
        new TextRun({
          text: documentTitle,
          bold: true,
          size: 36,
          font: "DM Sans",
          color: ELITE_DARK,
        }),
      ],
    })
  );

  // Untertitel
  if (documentSubtitle) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: documentSubtitle,
            size: 22,
            font: "DM Sans",
            color: ELITE_MID,
          }),
        ],
      })
    );
  }

  return paragraphs;
}

// ============================================================
// DOCX TABLE
// ============================================================
export function createDocxTable(headers, rows, options = {}) {
  const {
    headerBg = ELITE_DARK,
    headerColor = ELITE_YELLOW,
    colWidths,
    highlightLastRow = false,
  } = options;

  const numCols = headers.length;
  const defaultColWidth = Math.floor(CONTENT_WIDTH_DXA / numCols);
  const widths = colWidths || headers.map(() => defaultColWidth);

  const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

  // Header row
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map(
      (h, i) =>
        new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          shading: { fill: headerBg, type: ShadingType.CLEAR },
          borders: BORDERS_LIGHT,
          margins: cellMargins,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  size: 18,
                  font: "DM Sans",
                  color: headerColor,
                }),
              ],
            }),
          ],
        })
    ),
  });

  // Data rows
  const dataRows = rows.map(
    (row, rowIdx) =>
      new TableRow({
        children: row.map(
          (cell, colIdx) =>
            new TableCell({
              width: { size: widths[colIdx], type: WidthType.DXA },
              shading: {
                fill:
                  highlightLastRow && rowIdx === rows.length - 1
                    ? ELITE_YELLOW
                    : rowIdx % 2 === 0
                    ? "FFFFFF"
                    : "F7F8FA",
                type: ShadingType.CLEAR,
              },
              borders: BORDERS_LIGHT,
              margins: cellMargins,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: String(cell),
                      size: 18,
                      font: "DM Sans",
                      bold: highlightLastRow && rowIdx === rows.length - 1,
                      color:
                        highlightLastRow && rowIdx === rows.length - 1
                          ? ELITE_DARK
                          : undefined,
                    }),
                  ],
                }),
              ],
            })
        ),
      })
  );

  return new Table({
    width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows],
  });
}

// ============================================================
// SECTION HEADING
// ============================================================
export function createSectionHeading(text) {
  return new Paragraph({
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        font: "DM Sans",
        color: ELITE_DARK,
      }),
    ],
  });
}

// ============================================================
// KEY-VALUE ROW (einfache Zeile: Label → Wert)
// ============================================================
export function createKeyValueTable(entries) {
  const labelWidth = Math.floor(CONTENT_WIDTH_DXA * 0.45);
  const valueWidth = CONTENT_WIDTH_DXA - labelWidth;
  const cellMargins = { top: 50, bottom: 50, left: 100, right: 100 };

  const rows = entries.map(
    ([label, value], idx) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: labelWidth, type: WidthType.DXA },
            borders: BORDERS_LIGHT,
            margins: cellMargins,
            shading: { fill: idx % 2 === 0 ? "FFFFFF" : "F7F8FA", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: label,
                    size: 18,
                    font: "DM Sans",
                    color: ELITE_MID,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: valueWidth, type: WidthType.DXA },
            borders: BORDERS_LIGHT,
            margins: cellMargins,
            shading: { fill: idx % 2 === 0 ? "FFFFFF" : "F7F8FA", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: String(value),
                    bold: true,
                    size: 18,
                    font: "DM Sans",
                    color: ELITE_DARK,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
  );

  return new Table({
    width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: [labelWidth, valueWidth],
    rows,
  });
}

// ============================================================
// HIGHLIGHT BOX (gelber Kasten für Ergebnis)
// ============================================================
export function createHighlightBox(label, mainText, subText) {
  const cellMargins = { top: 100, bottom: 100, left: 150, right: 150 };

  return new Table({
    width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH_DXA],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
            shading: { fill: ELITE_YELLOW, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            margins: cellMargins,
            children: [
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: label,
                    size: 20,
                    font: "DM Sans",
                    color: ELITE_DARK,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: mainText,
                    bold: true,
                    size: 26,
                    font: "DM Sans",
                    color: ELITE_DARK,
                  }),
                ],
              }),
              ...(subText
                ? [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: subText,
                          size: 16,
                          font: "DM Sans",
                          color: ELITE_DARK,
                        }),
                      ],
                    }),
                  ]
                : []),
            ],
          }),
        ],
      }),
    ],
  });
}

// ============================================================
// SIGNATURE BLOCK
// ============================================================
export function createDocxSignatureBlock(partyA, partyB, options = {}) {
  const halfWidth = Math.floor(CONTENT_WIDTH_DXA / 2) - 100;
  const noBorders = {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
  };
  const cellMargins = { top: 40, bottom: 40, left: 60, right: 60 };

  // Helper: convert base64 data URL to Uint8Array
  function base64ToUint8Array(dataUrl) {
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // Optional signature image rows (inserted before the signature line)
  const signatureImageRows = [];
  if (options.signatureImageA || options.signatureImageB) {
    const leftChildren = options.signatureImageA
      ? [new Paragraph({
          children: [
            new ImageRun({
              data: base64ToUint8Array(options.signatureImageA),
              transformation: { width: 200, height: 80 },
            }),
          ],
        })]
      : [new Paragraph({ children: [] })];

    const rightChildren = options.signatureImageB
      ? [new Paragraph({
          children: [
            new ImageRun({
              data: base64ToUint8Array(options.signatureImageB),
              transformation: { width: 200, height: 80 },
            }),
          ],
        })]
      : [new Paragraph({ children: [] })];

    signatureImageRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: halfWidth, type: WidthType.DXA },
            borders: noBorders,
            margins: cellMargins,
            children: leftChildren,
          }),
          new TableCell({
            width: { size: 200, type: WidthType.DXA },
            borders: noBorders,
            margins: cellMargins,
            children: [new Paragraph({ children: [] })],
          }),
          new TableCell({
            width: { size: halfWidth, type: WidthType.DXA },
            borders: noBorders,
            margins: cellMargins,
            children: rightChildren,
          }),
        ],
      })
    );
  }

  return [
    new Paragraph({ spacing: { before: 600 }, children: [] }),
    new Table({
      width: { size: CONTENT_WIDTH_DXA, type: WidthType.DXA },
      columnWidths: [halfWidth, 200, halfWidth],
      rows: [
        // Signature images (if provided)
        ...signatureImageRows,
        // Unterschrift-Linie
        new TableRow({
          children: [
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: ELITE_MID } },
              margins: cellMargins,
              children: [new Paragraph({ spacing: { before: 400 }, children: [] })],
            }),
            new TableCell({
              width: { size: 200, type: WidthType.DXA },
              borders: noBorders,
              margins: cellMargins,
              children: [new Paragraph({ children: [] })],
            }),
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: ELITE_MID } },
              margins: cellMargins,
              children: [new Paragraph({ spacing: { before: 400 }, children: [] })],
            }),
          ],
        }),
        // Namen
        new TableRow({
          children: [
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: noBorders,
              margins: cellMargins,
              children: [new Paragraph({ children: [new TextRun({ text: partyA, size: 16, font: "DM Sans", color: ELITE_MID })] })],
            }),
            new TableCell({
              width: { size: 200, type: WidthType.DXA },
              borders: noBorders,
              children: [new Paragraph({ children: [] })],
            }),
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: noBorders,
              margins: cellMargins,
              children: [new Paragraph({ children: [new TextRun({ text: partyB, size: 16, font: "DM Sans", color: ELITE_MID })] })],
            }),
          ],
        }),
        // Ort, Datum
        new TableRow({
          children: [
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: noBorders,
              margins: cellMargins,
              children: [new Paragraph({ children: [new TextRun({ text: "Ort, Datum", size: 16, font: "DM Sans", color: ELITE_MID })] })],
            }),
            new TableCell({
              width: { size: 200, type: WidthType.DXA },
              borders: noBorders,
              children: [new Paragraph({ children: [] })],
            }),
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: noBorders,
              margins: cellMargins,
              children: [new Paragraph({ children: [new TextRun({ text: "Ort, Datum", size: 16, font: "DM Sans", color: ELITE_MID })] })],
            }),
          ],
        }),
      ],
    }),
  ];
}

// ============================================================
// HEADER / FOOTER
// ============================================================
export function createDocxHeaderFooter(documentTitle) {
  const header = new Header({
    children: [
      new Paragraph({
        spacing: { after: 100 },
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 4,
            color: ELITE_YELLOW,
            space: 1,
          },
        },
        children: [
          new TextRun({
            text: "Elite PV GmbH",
            bold: true,
            size: 16,
            font: "DM Sans",
            color: ELITE_YELLOW,
          }),
          new TextRun({
            text: `  |  ${documentTitle}`,
            size: 16,
            font: "DM Sans",
            color: ELITE_MID,
          }),
        ],
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        border: {
          top: {
            style: BorderStyle.SINGLE,
            size: 2,
            color: "DDDDDD",
            space: 1,
          },
        },
        tabStops: [
          {
            type: TabStopType.CENTER,
            position: Math.floor(CONTENT_WIDTH_DXA / 2),
          },
          {
            type: TabStopType.RIGHT,
            position: CONTENT_WIDTH_DXA,
          },
        ],
        children: [
          new TextRun({
            text: "Elite PV GmbH",
            size: 14,
            font: "DM Sans",
            color: ELITE_MID,
          }),
          new TextRun({
            children: ["\t"],
          }),
          new TextRun({
            text: "Seite ",
            size: 14,
            font: "DM Sans",
            color: ELITE_MID,
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 14,
            font: "DM Sans",
            color: ELITE_MID,
          }),
          new TextRun({
            text: " von ",
            size: 14,
            font: "DM Sans",
            color: ELITE_MID,
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 14,
            font: "DM Sans",
            color: ELITE_MID,
          }),
          new TextRun({
            children: ["\t"],
          }),
          new TextRun({
            text: `Stand: ${formatDatum(new Date())}`,
            size: 14,
            font: "DM Sans",
            color: ELITE_MID,
          }),
        ],
      }),
    ],
  });

  return { header, footer };
}

// ============================================================
// VERTRAG-KLAUSELN ALS DOCX
// ============================================================
export function createClauseParagraphs(klauseln) {
  const paragraphs = [];

  // Überschrift
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: "VERTRAGSBEDINGUNGEN",
          bold: true,
          size: 30,
          font: "DM Sans",
          color: ELITE_DARK,
        }),
      ],
    })
  );

  for (const klausel of klauseln) {
    // Klausel-Titel (mit keepNext damit Titel nicht ohne Text auf Seitenende steht)
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        keepNext: true,
        spacing: { before: 200, after: 60 },
        children: [
          new TextRun({
            text: klausel.titel,
            bold: true,
            size: 20,
            font: "DM Sans",
            color: ELITE_DARK,
          }),
        ],
      })
    );

    // Klausel-Text
    paragraphs.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: klausel.text,
            size: 18,
            font: "DM Sans",
            color: "444444",
          }),
        ],
      })
    );
  }

  return paragraphs;
}

// ============================================================
// MASTER-FUNKTION: Generiert komplettes DOCX
// ============================================================
export async function generateDocx(config) {
  const {
    title,
    subtitle,
    sections = [],
    klauseln,
    signatureParties,
    signatureImages,
    fileName,
  } = config;

  const { header, footer } = createDocxHeaderFooter(title);

  // Alle Inhalte zusammenbauen
  const children = [];

  // Briefkopf
  children.push(...createDocxHeader(title, subtitle));

  // Sektionen
  for (const section of sections) {
    if (section.type === "heading") {
      children.push(createSectionHeading(section.text));
    } else if (section.type === "keyValue") {
      children.push(createKeyValueTable(section.entries));
    } else if (section.type === "table") {
      children.push(
        createDocxTable(section.headers, section.rows, section.options)
      );
    } else if (section.type === "highlight") {
      children.push(
        createHighlightBox(section.label, section.mainText, section.subText)
      );
    } else if (section.type === "spacing") {
      children.push(
        new Paragraph({ spacing: { before: section.size || 200 }, children: [] })
      );
    } else if (section.type === "pageBreak") {
      children.push(
        new Paragraph({ children: [new PageBreak()] })
      );
    } else if (section.type === "paragraphs") {
      children.push(...section.items);
    }
  }

  // Klauseln
  if (klauseln && klauseln.length > 0) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(...createClauseParagraphs(klauseln));
  }

  // Unterschriften (PageBreak davor, damit Unterschriften nie abgeschnitten werden)
  if (signatureParties) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(
      ...createDocxSignatureBlock(signatureParties[0], signatureParties[1], signatureImages || {})
    );
  }

  const doc = new Document({
    title: title,
    creator: "Elite PV GmbH",
    description: subtitle || title,
    styles: {
      default: {
        document: {
          run: { font: "DM Sans", size: 20 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH_DXA, height: PAGE_HEIGHT_DXA },
            margin: {
              top: MARGIN_DXA,
              right: MARGIN_DXA,
              bottom: MARGIN_DXA,
              left: MARGIN_LEFT_DXA,
            },
          },
        },
        headers: { default: header },
        footers: { default: footer },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, fileName || `${title.replace(/\s+/g, "_")}_Elite_PV.docx`);
}
