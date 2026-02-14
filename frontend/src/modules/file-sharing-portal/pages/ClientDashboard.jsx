import { useState } from 'react';

const ClientDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const activeCases = [
        {
            id: '2024-8842',
            title: 'Miller vs. Sterling Medical',
            status: 'In Review',
            statusColor: 'blue',
            progress: 75,
            team: [
                { initials: 'SN', name: 'Sarah (Lead LNC)', color: 'blue' },
                { initials: '+1', name: 'Support Team', color: 'slate' }
            ]
        },
        {
            id: '2024-9120',
            title: 'Estate of J. Doe vs. Clinic',
            status: 'Intake',
            statusColor: 'orange',
            progress: 30,
            team: [
                { initials: 'EA', name: 'Expert Analyst', color: 'indigo' }
            ]
        }
    ];

    const recentDocuments = [
        {
            name: 'Preliminary Chronology_v2.pdf',
            size: '2.4 MB',
            case: 'Miller vs. Sterling',
            date: 'Oct 12, 2024',
            icon: 'picture_as_pdf',
            iconColor: 'red'
        },
        {
            name: 'Expert Witness Review - Dr. Smith.docx',
            size: '45 KB',
            case: 'Miller vs. Sterling',
            date: 'Oct 10, 2024',
            icon: 'description',
            iconColor: 'blue'
        },
        {
            name: 'Hospital Records Package 1.zip',
            size: '142 MB',
            case: 'Estate of J. Doe',
            date: 'Oct 09, 2024',
            icon: 'folder',
            iconColor: 'green'
        }
    ];

    const messages = [
        {
            sender: 'Sarah (Consultant)',
            message: "Hello David, I've just uploaded the updated medical chronology for the Miller case. Please take a look when you can.",
            time: '09:12 AM',
            isOwn: false
        },
        {
            sender: 'You',
            message: "Thanks Sarah. Does the new version include the surgical flow sheets from the June 12th admission?",
            time: '09:45 AM',
            isOwn: true
        }
    ];

    const getStatusColor = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-700',
            orange: 'bg-orange-50 text-orange-700'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <main className="p-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Good Morning, David</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Here is the latest progress on your active legal nurse consulting cases.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                            <input
                                className="w-80 pl-10 pr-4 py-2 border border-[#0891b2]/20 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-[#0891b2] focus:border-transparent outline-none transition-all"
                                placeholder="Search cases or documents..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="relative p-2 text-slate-500 hover:text-[#0891b2] transition-colors">
                            <span className="material-icons">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area: Case Grid */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-[#0891b2]">folder_open</span>
                                    Active Cases
                                </h2>
                                <button className="text-[#0891b2] font-semibold text-sm hover:underline">View All Cases</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeCases.map((caseItem) => (
                                    <div key={caseItem.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Case ID: {caseItem.id}</span>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#0891b2] transition-colors">{caseItem.title}</h3>
                                            </div>
                                            <span className={`${getStatusColor(caseItem.statusColor)} text-[10px] font-bold px-2 py-1 rounded uppercase`}>
                                                {caseItem.status}
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs font-semibold mb-1">
                                                    <span className="text-slate-500">Medical Chronology Progress</span>
                                                    <span className="text-[#0891b2]">{caseItem.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                    <div className="bg-[#0891b2] h-2 rounded-full" style={{ width: `${caseItem.progress}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex -space-x-2">
                                                    {caseItem.team.map((member, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-7 h-7 rounded-full bg-${member.color}-200 border-2 border-white flex items-center justify-center text-[10px] font-bold`}
                                                            title={member.name}
                                                        >
                                                            {member.initials}
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className="bg-[#0891b2]/10 hover:bg-[#0891b2]/20 text-[#0891b2] text-xs font-bold py-1.5 px-4 rounded transition-colors">
                                                    Open Dashboard
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Documents */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-icons text-[#0891b2]">description</span>
                                    Recent Documents
                                </h2>
                                <button className="bg-[#0891b2] text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 hover:bg-[#0891b2]/90 transition-colors">
                                    <span className="material-icons text-sm">cloud_upload</span> Upload Record
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-3">File Name</th>
                                            <th className="px-6 py-3">Case</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {recentDocuments.map((doc, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`material-icons text-${doc.iconColor}-500`}>{doc.icon}</span>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{doc.name}</p>
                                                            <p className="text-[10px] text-slate-400">{doc.size}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-slate-600 dark:text-slate-400">{doc.case}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-slate-600 dark:text-slate-400">{doc.date}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-[#0891b2] hover:bg-[#0891b2]/10 p-1.5 rounded-lg transition-colors">
                                                        <span className="material-icons">download</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 text-center">
                                    <button className="text-xs font-bold text-[#0891b2] hover:underline">See All Documents</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Messaging & Stats */}
                    <div className="space-y-8">
                        {/* Secure Messaging Widget */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="bg-[#0891b2] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-white">chat</span>
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Secure Messaging</h3>
                                </div>
                                <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded text-[10px] text-green-300 font-bold">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    ENCRYPTED
                                </div>
                            </div>
                            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto bg-slate-50/30 dark:bg-slate-800/30">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.isOwn ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}>
                                        <div className={`${msg.isOwn ? 'bg-[#0891b2] text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700'} p-3 rounded-lg ${msg.isOwn ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-sm`}>
                                            <p className="text-xs leading-relaxed">{msg.message}</p>
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1 ml-1 font-semibold">{msg.sender} • {msg.time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="relative">
                                    <textarea
                                        className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-[#0891b2] focus:border-[#0891b2] resize-none pr-10"
                                        placeholder="Type a secure message..."
                                        rows="2"
                                    ></textarea>
                                    <button className="absolute bottom-2 right-2 text-[#0891b2] hover:scale-110 transition-transform">
                                        <span className="material-icons">send</span>
                                    </button>
                                </div>
                                <p className="text-[9px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                                    <span className="material-icons text-[10px]">shield</span> All messages are 256-bit AES encrypted
                                </p>
                            </div>
                        </div>

                        {/* Firm Resources & Contact */}
                        <div className="bg-[#0891b2]/5 dark:bg-slate-900/50 p-6 rounded-xl border-2 border-dashed border-[#0891b2]/10">
                            <h3 className="text-sm font-bold text-[#0891b2] mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <span className="material-icons text-lg">contact_support</span>
                                Dedicated Support
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Sarah Nielsen, RN</p>
                                        <p className="text-[11px] text-slate-500">Lead Legal Nurse Consultant</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <button className="w-full bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-4 rounded border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-icons text-sm">schedule</span> Schedule Briefing
                                    </button>
                                    <button className="w-full bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 px-4 rounded border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-icons text-sm">mail</span> Email Team
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Secure Logout Warning */}
                        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                            <span className="material-icons text-orange-400">timer</span>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-orange-800 uppercase tracking-tighter">Session Timeout</p>
                                <p className="text-[11px] text-orange-700">Auto-logout in <span className="font-mono font-bold">14:59</span></p>
                            </div>
                            <button className="text-[10px] font-bold text-orange-800 underline uppercase">Extend</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
