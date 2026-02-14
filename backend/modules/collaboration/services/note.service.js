const Note = require('../../../models/Note.model');

class NoteService {
    async getCaseNoteStats(caseId) {
        const notes = await Note.find({ case: caseId });

        const stats = {
            total: notes.length,
            byType: {},
            byPriority: {},
            pinned: notes.filter(n => n.isPinned).length,
            withAttachments: notes.filter(n => n.attachments.length > 0).length
        };

        notes.forEach(note => {
            // Count by type
            stats.byType[note.type] = (stats.byType[note.type] || 0) + 1;

            // Count by priority
            stats.byPriority[note.priority] = (stats.byPriority[note.priority] || 0) + 1;
        });

        return stats;
    }

    async notifyMentionedUsers(note, mentionedBy) {
        // This would integrate with notification service
        // For now, just return the mentioned users
        return note.mentions;
    }

    async getAllTags(caseId) {
        const notes = await Note.find({ case: caseId }).select('tags');
        const allTags = notes.reduce((acc, note) => {
            return [...acc, ...note.tags];
        }, []);

        // Get unique tags with counts
        const tagCounts = {};
        allTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });

        return Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);
    }

    async searchNotes(query, filters = {}) {
        const searchFilter = {
            $text: { $search: query }
        };

        if (filters.caseId) searchFilter.case = filters.caseId;
        if (filters.type) searchFilter.type = filters.type;
        if (filters.tags) searchFilter.tags = { $in: filters.tags };
        if (filters.createdBy) searchFilter.createdBy = filters.createdBy;

        const notes = await Note.find(searchFilter, { score: { $meta: 'textScore' } })
            .populate('case', 'title caseNumber')
            .populate('createdBy', 'name email')
            .sort({ score: { $meta: 'textScore' } })
            .limit(50);

        return notes;
    }

    async getRecentNotes(userId, limit = 10) {
        return await Note.find({ createdBy: userId })
            .populate('case', 'title caseNumber')
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async getNotesByTags(tags, caseId) {
        const filter = { tags: { $in: tags } };
        if (caseId) filter.case = caseId;

        return await Note.find(filter)
            .populate('case', 'title caseNumber')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
    }

    async duplicateNote(noteId, userId) {
        const originalNote = await Note.findById(noteId);
        if (!originalNote) {
            throw new Error('Note not found');
        }

        const duplicatedNote = new Note({
            case: originalNote.case,
            title: `${originalNote.title} (Copy)`,
            content: originalNote.content,
            type: originalNote.type,
            priority: originalNote.priority,
            tags: [...originalNote.tags],
            isPrivate: originalNote.isPrivate,
            createdBy: userId
        });

        await duplicatedNote.save();
        return duplicatedNote;
    }

    async exportNotes(caseId, format = 'json') {
        const notes = await Note.find({ case: caseId })
            .populate('case', 'title caseNumber')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        if (format === 'json') {
            return notes;
        }

        // Could add CSV, PDF export here
        return notes;
    }
}

module.exports = new NoteService();
