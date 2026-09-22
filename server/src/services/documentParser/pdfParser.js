import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

/**
 * Extracts raw text content and metadata from a PDF file buffer.
 * Supports both pdf-parse v2 (PDFParse class) and v1 (function).
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {Promise<{ text: string, metadata: { pageCount: number, info: object } }>}
 */
export const extractTextFromPdf = async (fileBuffer) => {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error('Invalid PDF file buffer provided.');
  }

  // Quick sanity check for PDF signature (%PDF-)
  const header = fileBuffer.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF')) {
    throw new Error('Unsupported file format. The uploaded document is not a valid PDF.');
  }

  try {
    // 1. Check for pdf-parse v2 (Class PDFParse)
    if (pdfModule.PDFParse && typeof pdfModule.PDFParse === 'function') {
      const parser = new pdfModule.PDFParse({ data: fileBuffer });
      await parser.load();
      const textResult = await parser.getText();
      let info = {};
      try {
        info = (await parser.getInfo()) || {};
      } catch (e) {
        // Ignore optional info error
      }
      try {
        await parser.destroy();
      } catch (e) {
        // Ignore optional destroy error
      }

      // In pdf-parse v2, textResult has pages array: [{ text: string, num: number }]
      let extractedText = '';
      if (Array.isArray(textResult?.pages) && textResult.pages.length > 0) {
        extractedText = textResult.pages.map((p) => p.text || '').join('\n\n').trim();
      }

      // If pages didn't provide text, fallback to textResult.text or string
      if (!extractedText && typeof textResult === 'string') {
        extractedText = textResult.trim();
      } else if (!extractedText && textResult?.text) {
        extractedText = textResult.text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '').trim();
      }

      const totalPages = textResult?.total || textResult?.pages?.length || 1;

      return {
        text: extractedText,
        metadata: {
          pageCount: totalPages,
          info,
          isScannedOrEmpty: extractedText.length === 0,
        },
      };
    }

    // 2. Check for pdf-parse v1 (Function)
    if (typeof pdfModule === 'function') {
      const data = await pdfModule(fileBuffer);
      return {
        text: data.text || '',
        metadata: {
          pageCount: data.numpages || 1,
          info: data.info || {},
        },
      };
    }

    // 3. Check for ES default export function
    if (pdfModule.default && typeof pdfModule.default === 'function') {
      const data = await pdfModule.default(fileBuffer);
      return {
        text: data.text || '',
        metadata: {
          pageCount: data.numpages || 1,
          info: data.info || {},
        },
      };
    }

    throw new Error('PDF parsing library interface unrecognized.');
  } catch (err) {
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  }
};

export default {
  extractTextFromPdf,
};
