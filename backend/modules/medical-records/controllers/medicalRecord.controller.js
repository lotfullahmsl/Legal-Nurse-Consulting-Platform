const MedicalRecord = require('../../../models/MedicalRecord.model');
const AppError = require('../../../shared/errors/AppError');
const { processOCRWithAPI } = require('../services/ocr.service');

// Get all medical records
exports.getAllRecords = async (req, res, next) => {
    try {
        const { caseId, documentType, search, page = 1, limit = 20 } = req.query;

        const query = { isDeleted: false };
        if (caseId) query.case = caseId;
        if (documentType) query.documentType = documentType;
        if (search) query.$text = { $search: search };

        const records = await MedicalRecord.find(query)
            .populate('case', 'caseNumber caseName')
            .populate('uploadedBy', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await MedicalRecord.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                records,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get record by ID
exports.getRecordById = async (req, res, next) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate('case', 'caseNumber caseName client')
            .populate('uploadedBy', 'fullName email')
            .populate('chainOfCustody.user', 'fullName');

        if (!record || record.isDeleted) {
            throw new AppError('Medical record not found', 404);
        }

        // Log access
        record.chainOfCustody.push({
            action: 'viewed',
            user: req.user._id,
            ipAddress: req.ip
        });
        await record.save();

        // Include OCR text in response
        const recordData = record.toObject();
        if (record.ocrText) {
            recordData.ocrText = record.ocrText;
        }

        res.status(200).json({
            success: true,
            data: { record: recordData }
        });
    } catch (error) {
        next(error);
    }
};

// Upload medical record
exports.uploadRecord = async (req, res, next) => {
    try {
        const recordData = {
            ...req.body,
            uploadedBy: req.user._id,
            ocrStatus: 'pending',
            chainOfCustody: [{
                action: 'uploaded',
                user: req.user._id,
                ipAddress: req.ip
            }]
        };

        const record = await MedicalRecord.create(recordData);

        await record.populate([
            { path: 'case', select: 'caseNumber caseName' },
            { path: 'uploadedBy', select: 'fullName email' }
        ]);

        // Trigger OCR processing asynchronously
        processOCR(record._id).catch(err => {
            console.error('OCR processing error:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Medical record uploaded successfully. OCR processing initiated.',
            data: { record }
        });
    } catch (error) {
        next(error);
    }
};

// OCR Processing Function
async function processOCR(recordId) {
    try {
        const record = await MedicalRecord.findById(recordId).select('+fileData');
        if (!record) return;

        record.ocrStatus = 'processing';
        await record.save();

        let extractedText = '';

        if (record.fileData) {
            try {
                // Determine mimeType from fileData or fileName
                let mimeType = record.mimeType;
                if (!mimeType && record.fileData) {
                    // Try to detect from base64 data URI
                    if (record.fileData.startsWith('data:')) {
                        mimeType = record.fileData.split(';')[0].split(':')[1];
                    } else if (record.fileName) {
                        // Fallback: detect from file extension
                        const ext = record.fileName.toLowerCase().split('.').pop();
                        const mimeMap = {
                            'pdf': 'application/pdf',
                            'jpg': 'image/jpeg',
                            'jpeg': 'image/jpeg',
                            'png': 'image/png',
                            'gif': 'image/gif',
                            'bmp': 'image/bmp'
                        };
                        mimeType = mimeMap[ext] || 'application/octet-stream';
                    }
                }

                console.log(`Processing OCR for ${record.fileName} with mimeType: ${mimeType}`);

                // Use Tesseract/pdf-parse to extract text
                const ocrText = await processOCRWithAPI(record.fileData, mimeType);

                // Build full text with metadata
                extractedText = `Document: ${record.fileName}\n`;
                extractedText += `Type: ${record.documentType}\n`;
                extractedText += `Provider: ${record.provider?.name || 'N/A'}\n`;
                extractedText += `Date: ${record.recordDate ? new Date(record.recordDate).toLocaleDateString() : 'N/A'}\n`;
                extractedText += `File Size: ${record.fileSize} bytes\n`;
                extractedText += `Pages: ${record.pageCount}\n`;
                extractedText += `\n${'='.repeat(80)}\n`;
                extractedText += `[OCR EXTRACTED TEXT]\n`;
                extractedText += `${'='.repeat(80)}\n\n`;
                extractedText += ocrText;

            } catch (ocrError) {
                console.error('OCR API error:', ocrError.message);
                // Store error information
                extractedText = `Document: ${record.fileName}\n`;
                extractedText += `Type: ${record.documentType}\n`;
                extractedText += `Provider: ${record.provider?.name || 'N/A'}\n`;
                extractedText += `Date: ${record.recordDate ? new Date(record.recordDate).toLocaleDateString() : 'N/A'}\n`;
                extractedText += `\n[OCR Processing Failed]\n`;
                extractedText += `Error: ${ocrError.message}\n`;

                record.ocrStatus = 'failed';
            }
        }

        record.ocrText = extractedText;
        if (record.ocrStatus !== 'failed') {
            record.ocrStatus = 'completed';
        }
        record.ocrProcessedAt = new Date();
        await record.save();

        console.log(`OCR ${record.ocrStatus} for record ${recordId}`);
    } catch (error) {
        console.error(`OCR failed for record ${recordId}:`, error);
        try {
            const record = await MedicalRecord.findById(recordId);
            if (record) {
                record.ocrStatus = 'failed';
                record.ocrText = `OCR processing failed: ${error.message}`;
                await record.save();
            }
        } catch (updateError) {
            console.error('Failed to update OCR status:', updateError);
        }
    }
}

// Download medical record file
exports.downloadRecord = async (req, res, next) => {
    try {
        const record = await MedicalRecord.findById(req.params.id).select('+fileData');

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found'
            });
        }

        // Log download action
        record.chainOfCustody.push({
            action: 'downloaded',
            user: req.user._id,
            ipAddress: req.ip
        });
        await record.save();

        // If fileData exists (base64), send it
        if (record.fileData) {
            res.status(200).json({
                success: true,
                data: {
                    fileName: record.fileName,
                    fileType: record.fileType,
                    fileData: record.fileData
                }
            });
        } else {
            // If no fileData, return the fileUrl for external download
            res.status(200).json({
                success: true,
                data: {
                    fileName: record.fileName,
                    fileType: record.fileType,
                    fileUrl: record.fileUrl
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

// Update medical record
exports.updateRecord = async (req, res, next) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);

        if (!record || record.isDeleted) {
            throw new AppError('Medical record not found', 404);
        }

        Object.assign(record, req.body);
        record.chainOfCustody.push({
            action: 'modified',
            user: req.user._id,
            ipAddress: req.ip,
            details: 'Record metadata updated'
        });

        await record.save();

        res.status(200).json({
            success: true,
            message: 'Medical record updated successfully',
            data: { record }
        });
    } catch (error) {
        next(error);
    }
};

// Delete medical record (soft delete)
exports.deleteRecord = async (req, res, next) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);

        if (!record || record.isDeleted) {
            throw new AppError('Medical record not found', 404);
        }

        record.isDeleted = true;
        record.chainOfCustody.push({
            action: 'deleted',
            user: req.user._id,
            ipAddress: req.ip
        });

        await record.save();

        res.status(200).json({
            success: true,
            message: 'Medical record deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get records by case
exports.getRecordsByCase = async (req, res, next) => {
    try {
        const records = await MedicalRecord.find({
            case: req.params.caseId,
            isDeleted: false
        })
            .populate('uploadedBy', 'fullName')
            .sort({ recordDate: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { records }
        });
    } catch (error) {
        next(error);
    }
};

// Trigger OCR processing
exports.triggerOCR = async (req, res, next) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);

        if (!record || record.isDeleted) {
            throw new AppError('Medical record not found', 404);
        }

        record.ocrStatus = 'processing';
        await record.save();

        // TODO: Integrate with OCR service (Tesseract, AWS Textract, etc.)
        // For now, just update status
        setTimeout(async () => {
            record.ocrStatus = 'completed';
            record.ocrProcessedAt = new Date();
            await record.save();
        }, 5000);

        res.status(200).json({
            success: true,
            message: 'OCR processing initiated',
            data: { record }
        });
    } catch (error) {
        next(error);
    }
};

// Get statistics
exports.getStats = async (req, res, next) => {
    try {
        const total = await MedicalRecord.countDocuments({ isDeleted: false });
        const byType = await MedicalRecord.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: '$documentType', count: { $sum: 1 } } }
        ]);
        const ocrPending = await MedicalRecord.countDocuments({
            ocrStatus: 'pending',
            isDeleted: false
        });

        res.status(200).json({
            success: true,
            data: {
                total,
                byType,
                ocrPending
            }
        });
    } catch (error) {
        next(error);
    }
};
