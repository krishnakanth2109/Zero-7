// ✅ File: backend/utils/pdfParser.js
// ESM-compatible import for CommonJS module "pdf-parse"

import pkg from 'pdf-parse';
const pdfParse = pkg.default || pkg;

/**
 * Parses a PDF file buffer and extracts text content.
 * @param {Buffer} fileBuffer - The PDF file buffer from multer upload.
 * @returns {Promise<string>} - Extracted text content from the PDF.
 */
export async function parsePdf(fileBuffer) {
  try {
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new Error('Invalid file buffer passed to parsePdf');
    }

    // Extract text from the PDF buffer
    const data = await pdfParse(fileBuffer);

    if (!data || !data.text) {
      throw new Error('No text content extracted from the PDF');
    }

    return data.text;
  } catch (err) {
    console.error('❌ CRITICAL ERROR inside pdfParser.js helper:', err);
    throw new Error('PDF parsing failed inside the dedicated helper.');
  }
}
