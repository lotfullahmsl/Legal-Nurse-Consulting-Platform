const { createWorker } = require('tesseract.js');
const pdfParse = require('pdf-parse');

/**
 * Process OCR using Tesseract.js for images or pdf-parse for PDFs
 * @param {string} base64Data - Base64 encoded file data (without data URI prefix)
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text
 */
async function processOCRWithAPI(base64Data, mimeType) {
    try {
        console.log(`Processing file with mimeType: ${mimeType}`);

        // Handle PDFs with pdf-parse
        if (mimeType === 'application/pdf') {
            console.log('Processing PDF with pdf-parse...');
            return await processPDF(base64Data);
        }

        // Handle images with Tesseract.js
        console.log('Processing image with Tesseract.js...');
        return await processImage(base64Data, mimeType);
    } catch (error) {
        console.error('OCR processing error:', error.message);
        throw error;
    }
}

/**
 * Process PDF files using pdf-parse
 * @param {string} base64Data - Base64 encoded PDF data
 * @returns {Promise<string>} - Extracted text
 */
async function processPDF(base64Data) {
    try {
        // Remove data URI prefix if present
        const base64String = base64Data.replace(/^data:application\/pdf;base64,/, '');

        // Convert base64 to buffer
        const pdfBuffer = Buffer.from(base64String, 'base64');

        // Parse PDF using the module directly
        const data = await pdfParse(pdfBuffer);

        console.log(`PDF parsed successfully. Pages: ${data.numpages}, Text length: ${data.text.length}`);

        if (!data.text || data.text.trim().length === 0) {
            throw new Error('No text could be extracted from the PDF');
        }

        return data.text;
    } catch (error) {
        console.error('PDF parsing error:', error.message);
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
}

/**
 * Process image files using Tesseract.js
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<string>} - Extracted text
 */
async function processImage(base64Data, mimeType) {
    const worker = await createWorker('eng');

    try {
        // Prepare the image data
        let imageData = base64Data;
        if (!imageData.startsWith('data:')) {
            imageData = `data:${mimeType || 'image/jpeg'};base64,${base64Data}`;
        }

        // Perform OCR
        const { data: { text, confidence } } = await worker.recognize(imageData);

        console.log(`Tesseract OCR completed with confidence: ${confidence}%`);

        if (!text || text.trim().length === 0) {
            throw new Error('No text could be extracted from the image');
        }

        return text;
    } catch (error) {
        console.error('Tesseract OCR error:', error.message);
        throw new Error(`Failed to process image: ${error.message}`);
    } finally {
        await worker.terminate();
    }
}

module.exports = {
    processOCRWithAPI
};
