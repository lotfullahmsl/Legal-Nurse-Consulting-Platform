import { useState } from 'react';

const TimelineBuilder = () => {
    const [viewMode, setViewMode] = useState('timeline');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(1);

    const categories = [
        { id: 1, name: 'Surgery & Procedures', checked: true },
        { id: 2, name: 'ER & Admissions', checked: true },
        { id: 3, name: 'Medications', checked: true },
        { id: 4, name: 'Imaging / Labs', checked: true },
        { id: 5, name: 'Notes & Narrative', checked: true }
    ];

    const events = [
        {
            id: 1,
            date: 'Oct 14, 2023 @ 08:30 AM',
            title: 'Initial ER Admission',
            description: 'Patient arrived via EMS with severe abdominal pain, localized to lower right quadrant.',
            category: 'EMERGENCY',
            categoryColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            side: 'left'
        },
        {
            id: 2,
            date: 'Oct 14, 2023 @ 11:15 AM',
            title: 'Diagnostic CT Scan',
            description: 'CT Imaging confirmed appendicitis with possible perforation. Prep for surgical intervention started.',
            category: 'IMAGING',
            categoryColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            page: 'PAGE 42',
            side: 'right',
            active: true
        },
        {
            id: 3,
            date: 'Nov 02, 2023 @ 10:00 AM',
            title: 'Post-Op Follow-up',
            description: 'Incision site healing normally. Patient reports mild discomfort. Sutures removed.',
            category: 'OUTPATIENT',
            categoryColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            side: 'left'
        }
    ];

    return (
        <div className="flex flex-col h-screen -m-8">
            {/* Top Utility Bar */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14181e]/50 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1f3b61] text-white p-2 rounded-lg">
                        <span className="material-icons text-xl">timeline</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Case: Johnson vs. General Hospital</h1>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                HIPAA Secured • Autosaved 2m ago
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mr-4">
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`px-3 py-1 text-xs font-medium rounded ${viewMode === 'timeline' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''
                                }`}
                        >
                            Timeline View
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1 text-xs font-medium ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            Grid View
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-icons text-sm">share</span>
                        Share
                    </button>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#1f3b61] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                            <span className="material-icons text-sm">download</span>
                            Export Report
                            <span className="material-icons text-sm">expand_more</span>
                        </button>
                        <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50">
                            <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm flex items-center gap-2">
                                <span className="material-icons text-sm text-red-500">picture_as_pdf</span> PDF Document (.pdf)
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm flex items-center gap-2">
                                <span className="material-icons text-sm text-blue-500">description</span> MS Word (.docx)
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex flex-1 overflow-hidden">
                {/* Left Filter & Navigation Panel */}
                <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14181e]/30 p-4 flex flex-col gap-6 overflow-y-auto">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                            Search Events
                        </label>
                        <div className="relative">
                            <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-[#1f3b61]/50"
                                placeholder="Filter by keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                            Event Categories
                        </label>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        defaultChecked={category.checked}
                                        className="rounded border-slate-300 text-[#1f3b61] focus:ring-[#1f3b61]"
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-[#1f3b61] transition-colors">
                                        {category.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                            Summary Statistics
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-xs text-slate-500">Events</div>
                                <div className="text-xl font-bold">142</div>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-xs text-slate-500">Years</div>
                                <div className="text-xl font-bold">4.2</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Timeline Canvas */}
                <section className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-[#14181e] p-8">
                    <div className="max-w-3xl mx-auto relative">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 transform -translate-x-1/2 z-0"></div>

                        {/* Timeline Nodes */}
                        <div className="space-y-12 relative z-10">
                            {/* Date Header */}
                            <div className="flex justify-center">
                                <span className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                                    OCTOBER 2023
                                </span>
                            </div>

                            {/* Event Cards */}
                            {events.slice(0, 2).map((event) => (
                                <div key={event.id} className="flex items-center w-full">
                                    {event.side === 'left' ? (
                                        <>
                                            <div className="w-1/2 pr-10 text-right">
                                                <div
                                                    className={`inline-block bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border ${event.active
                                                            ? 'border-2 border-[#1f3b61] ring-4 ring-[#1f3b61]/5'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-[#1f3b61]'
                                                        } transition-colors cursor-pointer group`}
                                                    onClick={() => setSelectedEvent(event.id)}
                                                >
                                                    <div className="text-[10px] font-bold text-[#1f3b61] dark:text-blue-400 uppercase mb-1">
                                                        {event.date}
                                                    </div>
                                                    <h3 className="font-bold text-sm mb-1 group-hover:text-[#1f3b61] transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                    <div className="mt-2 flex justify-end gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${event.categoryColor}`}>
                                                            {event.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1f3b61] rounded-full border-4 border-white dark:border-[#14181e] ring-4 ring-[#1f3b61]/10"></div>
                                            <div className="w-1/2 pl-10"></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-1/2 pr-10"></div>
                                            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1f3b61] rounded-full border-4 border-white dark:border-[#14181e] ring-4 ring-[#1f3b61]/10"></div>
                                            <div className="w-1/2 pl-10">
                                                <div
                                                    className={`inline-block bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border ${event.active
                                                            ? 'border-2 border-[#1f3b61] ring-4 ring-[#1f3b61]/5'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-[#1f3b61]'
                                                        } transition-colors cursor-pointer group`}
                                                    onClick={() => setSelectedEvent(event.id)}
                                                >
                                                    <div className="text-[10px] font-bold text-[#1f3b61] dark:text-blue-400 uppercase mb-1">
                                                        {event.date}
                                                    </div>
                                                    <h3 className="font-bold text-sm mb-1">{event.title}</h3>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">{event.description}</p>
                                                    <div className="mt-2 flex gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${event.categoryColor}`}>
                                                            {event.category}
                                                        </span>
                                                        {event.page && (
                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded text-[10px] font-bold">
                                                                {event.page}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}

                            {/* Date Header */}
                            <div className="flex justify-center">
                                <span className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500 shadow-sm uppercase">
                                    November 2023
                                </span>
                            </div>

                            {/* More Events */}
                            {events.slice(2).map((event) => (
                                <div key={event.id} className="flex items-center w-full">
                                    <div className="w-1/2 pr-10 text-right">
                                        <div className="inline-block bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-[#1f3b61] transition-colors cursor-pointer group">
                                            <div className="text-[10px] font-bold text-[#1f3b61] dark:text-blue-400 uppercase mb-1">
                                                {event.date}
                                            </div>
                                            <h3 className="font-bold text-sm mb-1 group-hover:text-[#1f3b61] transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{event.description}</p>
                                            <div className="mt-2 flex justify-end gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${event.categoryColor}`}>
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1f3b61] rounded-full border-4 border-white dark:border-[#14181e] ring-4 ring-[#1f3b61]/10"></div>
                                    <div className="w-1/2 pl-10"></div>
                                </div>
                            ))}

                            {/* Add New Event */}
                            <div className="flex justify-center pt-8">
                                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:border-[#1f3b61] hover:text-[#1f3b61] transition-all">
                                    <span className="material-icons">add_circle_outline</span>
                                    <span className="font-semibold text-sm">Add New Event to Timeline</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Edit Panel */}
                <aside className="w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#14181e]/30 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-icons text-[#1f3b61]">edit_note</span>
                            Edit Event Details
                        </h2>
                        <button className="text-slate-400 hover:text-red-500">
                            <span className="material-icons">delete_outline</span>
                        </button>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Event Title
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61]"
                                defaultValue="Diagnostic CT Scan"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-2.5 text-xs text-slate-400">calendar_today</span>
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-[#1f3b61]/20"
                                        defaultValue="10/14/2023"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Time</label>
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-2.5 text-xs text-slate-400">schedule</span>
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-[#1f3b61]/20"
                                        defaultValue="11:15 AM"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Narrative Description
                            </label>
                            <textarea
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-[#1f3b61]/20"
                                rows="5"
                                defaultValue="CT Imaging confirmed appendicitis with possible perforation. Appendicolith noted in the base of the appendix. No free air detected. Prep for surgical intervention started immediately per protocol."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                Facility / Provider
                            </label>
                            <div className="relative">
                                <span className="material-icons absolute left-3 top-2.5 text-xs text-slate-400">location_on</span>
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-[#1f3b61]/20"
                                    defaultValue="St. Jude Memorial Hospital - Radiology Dept"
                                />
                            </div>
                        </div>
                        <div className="bg-[#1f3b61]/5 dark:bg-[#1f3b61]/20 border border-[#1f3b61]/20 rounded-xl p-4">
                            <label className="block text-xs font-bold text-[#1f3b61] dark:text-blue-400 uppercase tracking-widest mb-3">
                                Source Citation
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-slate-500 mb-1 block">Document ID</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                                            defaultValue="BATES_00452"
                                        />
                                    </div>
                                    <div className="w-20">
                                        <label className="text-[10px] text-slate-500 mb-1 block">Page</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                                            defaultValue="42"
                                        />
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-white dark:bg-slate-800 border border-[#1f3b61]/30 text-[#1f3b61] dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-[#1f3b61] hover:text-white transition-colors">
                                    View Source Image
                                </button>
                            </div>
                        </div>
                        <div className="pt-6 flex gap-3">
                            <button className="flex-1 py-2.5 bg-[#1f3b61] text-white rounded-lg font-semibold text-sm shadow-lg shadow-[#1f3b61]/20">
                                Save Changes
                            </button>
                            <button className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
                                Cancel
                            </button>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Overlay Hint */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl z-50">
                <span className="text-xs font-medium opacity-80">
                    Shortcut: Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px]">N</kbd> for New Event
                </span>
                <div className="w-px h-4 bg-slate-700 mx-2"></div>
                <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <span className="material-icons text-sm">help_outline</span>
                    <span className="text-xs font-medium">Quick Guide</span>
                </button>
            </div>
        </div>
    );
};

export default TimelineBuilder;
