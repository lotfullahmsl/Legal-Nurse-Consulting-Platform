const axios = require('axios');
const FormData = require('form-data');

/**
 * Hybrid OCR Service for Vercel
 * - Uses Tesseract.js for images (free, works on Vercel)
 * - Uses OCR.space API for PDFs (fallback)
 * 
 * This approach maximizes free usage while maintaining reliability
 */

/**
 * Process OCR using appropriate method based on file type
 * @param {string} base64Data - Base64 encoded file data
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text
 */
async function processOCRWithAPI(base64Data, mimeType) {
    try {
        console.log(`Processing OCR for ${mimeType}`);

        // Use Tesseract.js for images (free, works on Vercel)
        if (mimeType.startsWith('image/')) {
            return await processImageWithTesseract(base64Data, mimeType);
        }

        // Use OCR.space API for PDFs (pdf-parse doesn't work on Vercel)
        if (mimeType === 'application/pdf') {
            return await processWithOCRSpace(base64Data, mimeType);
        }

        throw new Error(`Unsupported file type for OCR: ${mimeType}`);
    } catch (error) {
        console.error('OCR processing error:', error.message);
        throw new Error(`OCR processing failed: ${error.message}`);
    }
}

/**
 * Process images using Tesseract.js (works on Vercel!)
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<string>} - Extracted text
 */
async function processImageWithTesseract(base64Data, mimeType) {
    try {
        console.log('Processing image with Tesseract.js...');

        // Lazy load Tesseract to avoid issues if not installed
        const { createWorker } = require('tesseract.js');

        // Prepare the image data
        let imageData = base64Data;
        if (!imageData.startsWith('data:')) {
            imageData = `data:${mimeType};base64,${base64Data}`;
        }

        // Create worker and process
        const worker = await createWorker('eng');

        try {
            const { data: { text, confidence } } = await worker.recognize(imageData);

            console.log(`Tesseract OCR completed with confidence: ${confidence.toFixed(2)}%`);

            if (!text || text.trim().length === 0) {
                throw new Error('No text could be extracted from the image');
            }

            return text.trim();
        } finally {
            await worker.terminate();
        }
    } catch (error) {
        console.error('Tesseract OCR error:', error.message);

        // Fallback to OCR.space if Tesseract fails
        console.log('Falling back to OCR.space API...');
        return await processWithOCRSpace(base64Data, mimeType);
    }
}

/**
 * Process files using OCR.space API (fallback for PDFs and failed images)
 * @param {string} base64Data - Base64 encoded file data
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text
 */
async function processWithOCRSpace(base64Data, mimeType) {
    try {
        const apiKey = process.env.OCR_SPACE_API_KEY || 'K83420428988957';

        console.log(`Processing with OCR.space API for ${mimeType}`);

        // Prepare the base64 data
        let base64String = base64Data;
        if (base64String.startsWith('data:')) {
            base64String = base64String.split(',')[1];
        }

        // Create form data
        const formData = new FormData();
        formData.append('base64Image', `data:${mimeType};base64,${base64String}`);
        formData.append('apikey', apiKey);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2'); // Engine 2 is better for complex documents

        // Call OCR.space API
        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: {
                ...formData.getHeaders()
            },
            timeout: 60000 // 60 second timeout
        });

        if (!response.data) {
            throw new Error('No response from OCR API');
        }

        if (response.data.IsErroredOnProcessing) {
            const errorMessage = response.data.ErrorMessage?.[0] || 'Unknown OCR error';
            throw new Error(`OCR API error: ${errorMessage}`);
        }

        if (!response.data.ParsedResults || response.data.ParsedResults.length === 0) {
            throw new Error('No text could be extracted from the document');
        }

        // Extract text from all pages
        let extractedText = '';
        response.data.ParsedResults.forEach((result, index) => {
            if (response.data.ParsedResults.length > 1) {
                extractedText += `\n--- Page ${index + 1} ---\n`;
            }
            extractedText += result.ParsedText || '';
        });

        if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('No text could be extracted from the document');
        }

        console.log(`OCR.space completed successfully. Extracted ${extractedText.length} characters`);
        return extractedText.trim();

    } catch (error) {
        console.error('OCR.space API error:', error.message);

        if (error.code === 'ECONNABORTED') {
            throw new Error('OCR processing timeout. The document may be too large or complex.');
        }

        if (error.response?.status === 403) {
            throw new Error('OCR API key is invalid or rate limit exceeded.');
        }

        throw new Error(`OCR processing failed: ${error.message}`);
    }
}

module.exports = {
    processOCRWithAPI
};
