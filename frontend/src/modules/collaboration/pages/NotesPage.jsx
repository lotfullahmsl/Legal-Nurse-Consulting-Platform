import { useState } from 'react';

const NotesPage = () => {
    const [selectedCase, setSelectedCase] = useState('2024-MED-042');
    const [noteContent, setNoteContent] = useState('');

    const notes = [
        {
            id: 1,
            author: 'Sarah Jenkins',
            authorRole: 'Admin',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFEs4MsZDwYKlGCffMO5mgq_LeJlPyqcvZCkHss-RgaraTQwLIAGp8QOSdO3fOGxL3gMmpUlmZZp-XF0kA9JlBXoJvRQC81yRx1qUDMJVswupgNE9qVYxTF4le-uklgq7zwWEVFG3BJT2OixOzKX0Y43hzV2G-v9zWUCqsiFL2gdChkO3t5dwLtQRGAkzKTx3APi9SK6WBLr7FLU1eB_htyJpiA2tm7bf64yQQD_UUPEHIx5llBVoqML8Z7pqiWdYOfjl2_IfRNw',
            timestamp: '2024-10-23 10:30 AM',
            content: 'Reviewed the surgical notes. Found significant discrepancies in the pre-operative assessment documentation. Need to follow up with expert witness.',
            tags: ['Important', 'Follow-up Required'],
            attachments: 2
        },
        {
            id: 2,
            author: 'David Richardson',
            authorRole: 'Attorney',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLx9zr3ATINz5h0BlFb-FZYMV40fUtf9q03fpCrkHi7GlCStAbqyljc6cug3rywj9qWCO6Tgdhw_U4GoTgtXGi68WbpvTSqBp1CFScu8uDCuKRkZ0IwUkddNdGK5gPmb9oDA3AubMvf5Hvk9L3M1lxYyk-T_bDUHeIekE8myXDCh5vCthSe2OQ1hLb6wIdSLYI1bvxCOvU19A80uhzAglqkl5xmBsD9rIW1fM5AmygpT8JGGu39JD-UDWHztDChACouf7jUPMY_RM',
            timestamp: '2024-10-22 03:15 PM',
            content: 'Client meeting scheduled for next week. Please prepare summary of medical findings and timeline of events.',
            tags: ['Meeting', 'Client'],
            attachments: 0
        },
        {
            id: 3,
            author: 'Elena Rodriguez',
            authorRole: 'Legal Nurse',
            initials: 'ER',
            timestamp: '2024-10-21 11:45 AM',
            content: 'Completed chronology for June 15-20. All medical records have been indexed and cross-referenced. Timeline shows clear pattern of delayed response.',
            tags: ['Completed', 'Timeline'],
            attachments: 1
        },
        {
            id: 4,
            author: 'Michael Chen',
            authorRole: 'Legal Nurse',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMRX-dlto7H-IfNxGJODciYPd59IG6N1Qlv2Z9j09dkAmuEqw4QJelDB4Mk2rEn37QBLxUuwuGomYIbeDEaRsjHjUjj5JlzCrHCI7LOCJzTY-w-U0j0EZmjq5Vddu-_BC9mglpxmV_-8mZF5hGeZyshP4sDm7Oo2nMAQTSs0ffcafzTF50LzZzBuRpMY2wI1rXfd4a-hKcpoixGMuTRFINzJr0nyNgINZ_DchnywG-0Lu2fIgz_ETj3WJ1d0AwQssNdojHAwkYs2Y',
            timestamp: '2024-10-20 09:20 AM',
            content: 'Lab results analysis complete. Elevated markers consistent with delayed treatment. Documentation attached.',
            tags: ['Analysis', 'Lab Results'],
            attachments: 3
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Case Notes & Collaboration</h1>
                    <p className="text-slate-500 mt-1">Team collaboration and case notes</p>
                </div>
            </div>

            {/* Case Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Select Case:</label>
                    <select
                        className="flex-1 max-w-md px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                        value={selectedCase}
                        onChange={(e) => setSelectedCase(e.target.value)}
                    >
                        <option value="2024-MED-042">Miller vs. City Hospital (#2024-MED-042)</option>
                        <option value="2024-MED-039">Ramirez Malpractice (#2024-MED-039)</option>
                        <option value="2024-MED-015">Thompson - Ortho Review (#2024-MED-015)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Notes Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Add Note Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4">Add New Note</h3>
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
                            <button className="bg-[#0891b2] hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all">
                                <span className="material-icons text-sm">send</span>
                                Post Note
                            </button>
                        </div>
                    </div>

                    {/* Notes List */}
                    {notes.map((note) => (
                        <div key={note.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                            <div className="flex items-start gap-4">
                                {note.avatar ? (
                                    <img
                                        src={note.avatar}
                                        alt={note.author}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[#1f3b61]/10 flex items-center justify-center text-[#1f3b61] text-sm font-bold ring-2 ring-white dark:ring-slate-800">
                                        {note.initials}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">{note.author}</h4>
                                            <p className="text-xs text-slate-500">{note.authorRole} • {note.timestamp}</p>
                                        </div>
                                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                            <span className="material-icons text-slate-400">more_vert</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{note.content}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {note.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                        {note.attachments > 0 && (
                                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                                <span className="material-icons text-xs">attach_file</span>
                                                {note.attachments} attachment{note.attachments > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Team Members */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4">Team Members</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeFEs4MsZDwYKlGCffMO5mgq_LeJlPyqcvZCkHss-RgaraTQwLIAGp8QOSdO3fOGxL3gMmpUlmZZp-XF0kA9JlBXoJvRQC81yRx1qUDMJVswupgNE9qVYxTF4le-uklgq7zwWEVFG3BJT2OixOzKX0Y43hzV2G-v9zWUCqsiFL2gdChkO3t5dwLtQRGAkzKTx3APi9SK6WBLr7FLU1eB_htyJpiA2tm7bf64yQQD_UUPEHIx5llBVoqML8Z7pqiWdYOfjl2_IfRNw"
                                    alt="Sarah Jenkins"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">Sarah Jenkins</p>
                                    <p className="text-xs text-slate-500">Admin</p>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLx9zr3ATINz5h0BlFb-FZYMV40fUtf9q03fpCrkHi7GlCStAbqyljc6cug3rywj9qWCO6Tgdhw_U4GoTgtXGi68WbpvTSqBp1CFScu8uDCuKRkZ0IwUkddNdGK5gPmb9oDA3AubMvf5Hvk9L3M1xYyk-T_bDUHeIekE8myXDCh5vCthSe2OQ1hLb6wIdSLYI1bvxCOvU19A80uhzAglqkl5xmBsD9rIW1fM5AmygpT8JGGu39JD-UDWHztDChACouf7jUPMY_RM"
                                    alt="David Richardson"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">David Richardson</p>
                                    <p className="text-xs text-slate-500">Attorney</p>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1f3b61]/10 flex items-center justify-center text-[#1f3b61] text-sm font-bold">
                                    ER
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">Elena Rodriguez</p>
                                    <p className="text-xs text-slate-500">Legal Nurse</p>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Summary */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4">Activity Summary</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Total Notes</span>
                                <span className="text-sm font-bold">42</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">This Week</span>
                                <span className="text-sm font-bold">8</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Attachments</span>
                                <span className="text-sm font-bold">15</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tags */}
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
        </div>
    );
};

export default NotesPage;
