# OCR Setup Guide

## Current Implementation: OCR.space API

The application uses **OCR.space API** for text extraction from medical records. This solution works perfectly on Vercel's serverless environment.

## Features

✅ Works on Vercel (no native dependencies)
✅ Supports PDF and image files (PNG, JPEG, GIF, BMP)
✅ Free tier: 25,000 requests/month
✅ Multi-page PDF support
✅ Automatic orientation detection
✅ No credit card required for free tier

## Setup Instructions

### 1. Get Your Free API Key

1. Visit: https://ocr.space/ocrapi
2. Register for a free account
3. Get your API key from the dashboard

### 2. Configure Environment Variable

Add to your `.env` file:

```env
OCR_SPACE_API_KEY=your_api_key_here
```

### 3. For Vercel Deployment

Add the environment variable in Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `OCR_SPACE_API_KEY` = `your_api_key_here`
4. Redeploy

## Default API Key

The code includes a default public API key (`K87899142388957`) that works but has strict rate limits. For production use, get your own free API key.

## API Limits

**Free Tier:**
- 25,000 requests/month
- Max file size: 1MB per request
- Rate limit: 10 requests/minute

**Paid Plans:**
- PRO: $60/month - 100,000 requests
- PRO PDF: $200/month - Unlimited requests + advanced PDF features

## How It Works

1. User uploads a medical record (PDF or image)
2. File is stored in MongoDB as base64
3. OCR service sends file to OCR.space API
4. Extracted text is stored in `ocrText` field
5. Text is searchable and viewable in the UI

## Supported File Types

- PDF documents
- PNG images
- JPEG/JPG images
- GIF images
- BMP images

## Error Handling

The service handles common errors:
- Invalid API key
- Rate limit exceeded
- Timeout (60 seconds)
- No text found
- Invalid file format

## Alternative OCR Solutions

If you need different features, consider:

1. **Google Cloud Vision API** - Better accuracy, $1.50/1000 images
2. **AWS Textract** - HIPAA compliant, medical document optimized
3. **Azure Computer Vision** - Microsoft's solution
4. **Tesseract.js** - Free but requires non-serverless hosting (Railway, Render)

## Testing

Test OCR locally:
```bash
cd backend
npm start
```

Upload a medical record through the UI and check the OCR text in the medical records list.

## Troubleshooting

**OCR fails with "API key invalid":**
- Check your `OCR_SPACE_API_KEY` in .env
- Verify the key is correct on ocr.space dashboard

**OCR times out:**
- File may be too large (>1MB)
- Try compressing the PDF or image
- Consider upgrading to PRO plan

**No text extracted:**
- Document may be scanned at low quality
- Try rescanning at higher DPI (300+ recommended)
- Ensure text is not handwritten (OCR works best with printed text)

## Production Recommendations

1. Get your own API key (don't use the default)
2. Monitor usage in OCR.space dashboard
3. Set up alerts for rate limit warnings
4. Consider paid plan if processing >25k documents/month
5. Implement retry logic for failed OCR attempts
6. Cache OCR results to avoid reprocessing

## Security Notes

- API key is stored in environment variables (not in code)
- Files are sent to OCR.space servers (third-party)
- For HIPAA compliance, review OCR.space's privacy policy
- Consider AWS Textract for full HIPAA compliance
