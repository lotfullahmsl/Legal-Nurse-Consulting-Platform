import { useEffect, useState } from 'react';
import caseService from '../../../services/case.service';
import noteService from '../../../services/note.service';

const NotesPage = () => {
    const [selectedCase, setSelectedCase] = useState('');
    const [cases, setCases] = useState([]);
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchCases();
    }, []);

    useEffect(() => {
        if (selectedCase) {
            fetchNotes();
        }
    }, [selectedCase]);

    const fetchCases = async () => {
        try {
            const response = await caseService.getAll();
            setCases(response.data.cases || []);
            if (response.data.cases?.length > 0) {
                setSelectedCase(response.data.cases[0]._id);
            }
        } catch (error) {
            console.error('Error fetching cases:', error);
        }
    };

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await noteService.getByCase(selectedCase);
            setNotes(response.data.notes || []);
            setStats(response.data.stats || null);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async () => {
        if (!noteTitle.trim() || !noteContent.trim()) return;

        try {
            await noteService.create({
                case: selectedCase,
                title: noteTitle,
                content: noteContent,
                type: 'general',
                priority: 'medium'
            });
            setNoteTitle('');
            setNoteContent('');
            fetchNotes();
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    const handlePinNote = async (noteId) => {
        try {
            await noteService.togglePin(noteId);
            fetchNotes();
        } catch (error) {
            console.error('Error pinning note:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await noteService.delete(noteId);
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Case Notes & Collaboration</h1>
                    <p className="text-slate-500 mt-1">Team collaboration and case notes</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Select Case:</label>
                    <select
                        className="flex-1 max-w-md px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                        value={selectedCase}
                        onChange={(e) => setSelectedCase(e.target.value)}
                    >
                        {cases.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.title} (#{c.caseNumber})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4">Add New Note</h3>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mb-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                            placeholder="Note title..."
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                        />
                        <textarea
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-transparent outline-none resize-none"
                            rows="4"
                            placeholder="Write your note here..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                        />
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Attach File">
                                    <span className="material-icons text-slate-400">attach_file</span>
                                </button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Add Tag">
                                    <span className="material-icons text-slate-400">label</span>
                                </button>
                            </div>
                            <button
                                onClick={handleCreateNote}
                                disabled={!noteTitle.trim() || !noteContent.trim()}
                                className="bg-[#0891b2] hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-icons text-sm">send</span>
                                Post Note
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0891b2]"></div>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
                            <span className="material-icons text-6xl text-slate-300 mb-4">note</span>
                            <p className="text-slate-500">No notes yet. Create your first note above.</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div key={note._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1f3b61]/10 flex items-center justify-center text-[#1f3b61] text-sm font-bold ring-2 ring-white dark:ring-slate-800">
                                        {note.createdBy?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">{note.createdBy?.name || 'Unknown'}</h4>
                                                <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handlePinNote(note._id)}
                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                    title={note.isPinned ? 'Unpin' : 'Pin'}
                                                >
                                                    <span className={`material-icons text-sm ${note.isPinned ? 'text-[#0891b2]' : 'text-slate-400'}`}>
                                                        push_pin
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNote(note._id)}
                                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                >
                                                    <span className="material-icons text-sm text-slate-400">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-slate-900 dark:text-white mb-2">{note.title}</h5>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{note.content}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {note.tags?.map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                            {note.attachments?.length > 0 && (
                                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                                    <span className="material-icons text-xs">attach_file</span>
                                                    {note.attachments.length} attachment{note.attachments.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                            {note.isPinned && (
                                                <span className="flex items-center gap-1 text-xs text-[#0891b2]">
                                                    <span className="material-icons text-xs">push_pin</span>
                                                    Pinned
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-6">
                    {stats && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4">Activity Summary</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Notes</span>
                                    <span className="text-sm font-bold">{stats.total || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Pinned</span>
                                    <span className="text-sm font-bold">{stats.pinned || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">With Attachments</span>
                                    <span className="text-sm font-bold">{stats.withAttachments || 0}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4">Quick Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors">
                                Important
                            </button>
                            <button className="px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                                Completed
                            </button>
                            <button className="px-3 py-1.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-medium hover:bg-yellow-200 transition-colors">
                                Follow-up
                            </button>
                            <button className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors">
                                Meeting
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default NotesPage;
