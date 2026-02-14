const FileShare = require('../../../models/FileShare.model');
const MedicalRecord = require('../../../models/MedicalRecord.model');
const AppError = require('../../../shared/errors/AppError');

// Get shared files
exports.getSharedFiles = async (req, res, next) => {
    try {
        const query = {
            isRevoked: false,
            $or: [
                { sharedWith: req.user._id },
                { sharedBy: req.user._id }
            ]
        };

        // Check if expired
        query.$or.push({ expiresAt: { $gt: new Date() } });
        query.$or.push({ expiresAt: null });

        const sharedFiles = await FileShare.find(query)
            .populate('file')
            .populate('case', 'caseNumber caseName')
            .populate('sharedWith', 'fullName email')
            .populate('sharedBy', 'fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { sharedFiles }
        });
    } catch (error) {
        next(error);
    }
};

// Share file
exports.shareFile = async (req, res, next) => {
    try {
        const { fileId, sharedWithUserId, caseId, accessLevel, expiresAt } = req.body;

        // Check if file exists
        const file = await MedicalRecord.findById(fileId);
        if (!file || file.isDeleted) {
            throw new AppError('File not found', 404);
        }

        const shareData = {
            file: fileId,
            case: caseId,
            sharedWith: sharedWithUserId,
            sharedBy: req.user._id,
            accessLevel: accessLevel || 'view',
            expiresAt: expiresAt || null
        };

        const fileShare = await FileShare.create(shareData);
        await fileShare.populate('file sharedWith sharedBy');

        // Log in chain of custody
        file.chainOfCustody.push({
            action: 'shared',
            user: req.user._id,
            ipAddress: req.ip,
            details: `Shared with ${fileShare.sharedWith.fullName}`
        });
        await file.save();

        res.status(201).json({
            success: true,
            message: 'File shared successfully',
            data: { fileShare }
        });
    } catch (error) {
        next(error);
    }
};

// Get access log
exports.getAccessLog = async (req, res, next) => {
    try {
        const fileShare = await FileShare.findById(req.params.id)
            .populate('file')
            .populate('sharedWith', 'fullName email')
            .populate('sharedBy', 'fullName');

        if (!fileShare) {
            throw new AppError('File share not found', 404);
        }

        res.status(200).json({
            success: true,
            data: {
                fileShare,
                accessLog: fileShare.accessLog
            }
        });
    } catch (error) {
        next(error);
    }
};

// Download shared file
exports.downloadSharedFile = async (req, res, next) => {
    try {
        const fileShare = await FileShare.findById(req.params.id)
            .populate('file');

        if (!fileShare || fileShare.isRevoked) {
            throw new AppError('File share not found or revoked', 404);
        }

        // Check expiration
        if (fileShare.expiresAt && fileShare.expiresAt < new Date()) {
            throw new AppError('File share has expired', 403);
        }

        // Check access
        if (fileShare.sharedWith.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized to access this file', 403);
        }

        // Log access
        fileShare.accessLog.push({
            action: 'downloaded',
            timestamp: new Date(),
            ipAddress: req.ip
        });
        await fileShare.save();

        res.status(200).json({
            success: true,
            data: {
                fileUrl: fileShare.file.fileUrl,
                fileName: fileShare.file.fileName
            }
        });
    } catch (error) {
        next(error);
    }
};

// Revoke file access
exports.revokeAccess = async (req, res, next) => {
    try {
        const fileShare = await FileShare.findById(req.params.id);

        if (!fileShare) {
            throw new AppError('File share not found', 404);
        }

        // Only the person who shared can revoke
        if (fileShare.sharedBy.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized to revoke this share', 403);
        }

        fileShare.isRevoked = true;
        fileShare.revokedAt = new Date();
        fileShare.revokedBy = req.user._id;
        await fileShare.save();

        res.status(200).json({
            success: true,
            message: 'File access revoked successfully'
        });
    } catch (error) {
        next(error);
    }
};
