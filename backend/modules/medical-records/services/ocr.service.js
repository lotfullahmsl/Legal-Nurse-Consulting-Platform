const axios = require('axios');
const FormData = require('form-data');

/**
 * OCR Service using OCR.space API for Vercel
 * Works for both images and PDFs
 * Optimized for serverless with 10-second timeout
 */

async function processOCRWithAPI(base64Data, mimeType) {
    try {
        const apiKey = process.env.OCR_SPACE_API_KEY || 'K83420428988957';

        console.log(`[OCR] Processing ${mimeType} with OCR.space API`);

        let base64String = base64Data;
        if (base64String.startsWith('data:')) {
            base64String = base64String.split(',')[1];
        }

        const formData = new FormData();
        formData.append('base64Image', `data:${mimeType};base64,${base64String}`);
        formData.append('apikey', apiKey);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        formData.append('OCREngine', '2');

        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: formData.getHeaders(),
            timeout: 25000
        });

        if (!response.data) {
            throw new Error('No response from OCR API');
        }

        if (response.data.IsErroredOnProcessing) {
            const errorMessage = response.data.ErrorMessage?.[0] || 'Unknown OCR error';
            throw new Error(`OCR API error: ${errorMessage}`);
        }

        if (!response.data.ParsedResults || response.data.ParsedResults.length === 0) {
            throw new Error('No text extracted');
        }

        let extractedText = '';
        response.data.ParsedResults.forEach((result, index) => {
            if (response.data.ParsedResults.length > 1) {
                extractedText += `\n--- Page ${index + 1} ---\n`;
            }
            extractedText += result.ParsedText || '';
        });

        if (!extractedText || extractedText.trim().length === 0) {
            throw new Error('No text extracted');
        }

        console.log(`[OCR] Success: ${extractedText.length} characters`);
        return extractedText.trim();

    } catch (error) {
        console.error('[OCR] Error:', error.message);

        if (error.code === 'ECONNABORTED') {
            throw new Error('OCR timeout - file too large');
        }

        if (error.response?.status === 403) {
            throw new Error('OCR API key invalid or rate limit exceeded');
        }

        throw new Error(`OCR failed: ${error.message}`);
    }
}

module.exports = {
    processOCRWithAPI
};
