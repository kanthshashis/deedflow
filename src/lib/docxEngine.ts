import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export interface TemplateLinterResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedTags: string[];
}

/**
 * Preflight Linter for .docx templates.
 * Inspects raw XML runs for unclosed braces, syntax errors, and missing matching loop tags.
 */
export function lintDocxTemplate(buffer: Buffer | ArrayBuffer): TemplateLinterResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const detectedTags: Set<string> = new Set();

  try {
    const zip = new PizZip(buffer);
    const documentXml = zip.file("word/document.xml")?.asText();

    if (!documentXml) {
      return {
        isValid: false,
        errors: ["Invalid DOCX: 'word/document.xml' not found in package."],
        warnings: [],
        detectedTags: [],
      };
    }

    // Strip internal XML tags to read text runs cleanly
    const plainText = documentXml.replace(/<[^>]+>/g, "");

    // Regex for {variable_name} or {#block}...{/block}
    const tagRegex = /\{([#^/]?[\w_.]+)\}/g;
    let match;
    const blockStack: string[] = [];

    while ((match = tagRegex.exec(plainText)) !== null) {
      const fullTag = match[0];
      const tagContent = match[1];

      detectedTags.add(tagContent);

      if (tagContent.startsWith("#") || tagContent.startsWith("^")) {
        blockStack.push(tagContent.slice(1));
      } else if (tagContent.startsWith("/")) {
        const closedBlock = tagContent.slice(1);
        const lastBlock = blockStack.pop();
        if (lastBlock !== closedBlock) {
          errors.push(`Mismatched loop tag: expected {/${lastBlock}}, found {/${closedBlock}}`);
        }
      }
    }

    if (blockStack.length > 0) {
      errors.push(`Unclosed loop block(s): ${blockStack.map((b) => `{/#${b}}`).join(", ")}`);
    }

    // Check for broken or unclosed brackets e.g. "{" without "}"
    const openCount = (plainText.match(/\{/g) || []).length;
    const closeCount = (plainText.match(/\}/g) || []).length;
    if (openCount !== closeCount) {
      errors.push(`Bracket mismatch: ${openCount} opening '{' vs ${closeCount} closing '}'`);
    }
  } catch (err: any) {
    errors.push(`DOCX Parsing Error: ${err.message || String(err)}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    detectedTags: Array.from(detectedTags),
  };
}

/**
 * Injects structured data into a .docx template buffer using docxtemplater and pizzip.
 */
export function fillDocxTemplate(
  templateBuffer: Buffer | ArrayBuffer,
  data: Record<string, any>
): Buffer {
  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: (part) => {
      // Gracefully substitute empty placeholder instead of throwing or printing "undefined"
      return `[Missing: ${part.value}]`;
    },
  });

  doc.render(data);

  return doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
}
