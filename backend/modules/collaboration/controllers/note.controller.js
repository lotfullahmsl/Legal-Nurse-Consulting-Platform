const Note = require('../../../models/Note.model');
const Case = require('../../../models/Case.model');
const noteService = require('../services/note.service');

exports.getAllNotes = async (req, res, next) => {
    try {
        const { case: caseId, type, tags, search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (caseId) filter.case = caseId;
        if (type) filter.type = type;
        if (tags) filter.tags = { $in: tags.split(',') };

        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        const notes = await Note.find(filter)
            .populate('case', 'title caseNumber')
            .populate('createdBy', 'name email')
            .populate('lastEditedBy', 'name email')
            .populate('mentions', 'name email')
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Note.countDocuments(filter);

        res.json({
            notes,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

exports.getNoteById = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('case', 'title caseNumber')
            .populate('createdBy', 'name email')
            .populate('lastEditedBy', 'name email')
            .populate('mentions', 'name email')
            .populate('attachments.uploadedBy', 'name email');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        next(error);
    }
};

exports.getNotesByCase = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { type, isPinned } = req.query;

        const filter = { case: caseId };
        if (type) filter.type = type;
        if (isPinned !== undefined) filter.isPinned = isPinned === 'true';

        const notes = await Note.find(filter)
            .populate('createdBy', 'name email')
            .populate('lastEditedBy', 'name email')
            .populate('mentions', 'name email')
            .sort({ isPinned: -1, createdAt: -1 });

        const stats = await noteService.getCaseNoteStats(caseId);

        res.json({
            notes,
            stats
        });
    } catch (error) {
        next(error);
    }
};

exports.createNote = async (req, res, next) => {
    try {
        const { case: caseId, title, content, type, priority, tags, mentions, isPrivate, isPinned } = req.body;

        const caseExists = await Case.findById(caseId);
        if (!caseExists) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // Ensure we have a valid user ID
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const note = new Note({
            case: caseId,
            title,
            content,
            type,
            priority,
            tags,
            mentions,
            isPrivate: isPrivate || false,
            isPinned: isPinned || false,
            createdBy: userId
        });

        await note.save();

        // Populate after save to ensure we get the user data
        const populatedNote = await Note.findById(note._id)
            .populate('case', 'title caseNumber')
            .populate('createdBy', 'name email')
            .populate('mentions', 'name email');

        // Notify mentioned users
        if (mentions && mentions.length > 0) {
            await noteService.notifyMentionedUsers(populatedNote, userId);
        }

        res.status(201).json(populatedNote);
    } catch (error) {
        next(error);
    }
};

exports.updateNote = async (req, res, next) => {
    try {
        const { title, content, type, priority, tags, mentions, isPrivate, isPinned } = req.body;

        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Update fields
        if (title) note.title = title;
        if (content) {
            note.content = content;
            note.lastEditedBy = req.user.id;
        }
        if (type) note.type = type;
        if (priority) note.priority = priority;
        if (tags) note.tags = tags;
        if (mentions) note.mentions = mentions;
        if (isPrivate !== undefined) note.isPrivate = isPrivate;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();
        await note.populate('case', 'title caseNumber');
        await note.populate('createdBy', 'name email');
        await note.populate('lastEditedBy', 'name email');
        await note.populate('mentions', 'name email');

        res.json(note);
    } catch (error) {
        next(error);
    }
};

exports.deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.deleteOne();
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.addAttachment = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const { filename, originalName, mimeType, size, path } = req.body;

        note.attachments.push({
            filename,
            originalName,
            mimeType,
            size,
            path,
            uploadedBy: req.user.id
        });

        await note.save();
        await note.populate('attachments.uploadedBy', 'name email');

        res.json(note);
    } catch (error) {
        next(error);
    }
};

exports.removeAttachment = async (req, res, next) => {
    try {
        const { id, attachmentId } = req.params;

        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.attachments = note.attachments.filter(
            att => att._id.toString() !== attachmentId
        );

        await note.save();
        res.json({ message: 'Attachment removed successfully', note });
    } catch (error) {
        next(error);
    }
};

exports.getNoteHistory = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('history.editedBy', 'name email')
            .select('history version');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({
            currentVersion: note.version,
            history: note.history
        });
    } catch (error) {
        next(error);
    }
};

exports.addTags = async (req, res, next) => {
    try {
        const { tags } = req.body;

        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Add new tags without duplicates
        const newTags = tags.filter(tag => !note.tags.includes(tag));
        note.tags.push(...newTags);

        await note.save();
        res.json(note);
    } catch (error) {
        next(error);
    }
};

exports.removeTags = async (req, res, next) => {
    try {
        const { tags } = req.body;

        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.tags = note.tags.filter(tag => !tags.includes(tag));

        await note.save();
        res.json(note);
    } catch (error) {
        next(error);
    }
};

exports.searchNotes = async (req, res, next) => {
    try {
        const { q, case: caseId, type, tags } = req.query;

        const filter = { $text: { $search: q } };
        if (caseId) filter.case = caseId;
        if (type) filter.type = type;
        if (tags) filter.tags = { $in: tags.split(',') };

        const notes = await Note.find(filter, { score: { $meta: 'textScore' } })
            .populate('case', 'title caseNumber')
            .populate('createdBy', 'name email')
            .sort({ score: { $meta: 'textScore' } })
            .limit(50);

        res.json(notes);
    } catch (error) {
        next(error);
    }
};

exports.pinNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        res.json({ message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`, note });
    } catch (error) {
        next(error);
    }
};
