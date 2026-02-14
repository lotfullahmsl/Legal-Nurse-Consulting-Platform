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
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Top Navigation Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-primary/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <span className="material-icons text-white">security</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary dark:text-white uppercase">LNC Secure Portal</span>
                        </div>
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <span className="material-icons absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 border border-primary/20 rounded-lg bg-background-light dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Search cases or documents..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                                <span className="material-icons text-[14px]">lock</span>
                                HIPAA SECURE
                            </div>
                            <button className="relative p-2 text-slate-500 hover:text-primary transition-colors">
                                <span className="material-icons">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="flex items-center gap-3 ml-4 border-l border-primary/10 pl-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold">David Harrison, Esq.</p>
                                    <p className="text-xs text-slate-500">Harrison & Associates</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                                    <span className="material-icons text-primary">account_circle</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Message */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary dark:text-white">Good Morning, David</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Here is the latest progress on your active legal nurse consulting cases.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area: Case Grid */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-primary dark:text-white flex items-center gap-2">
                                    <span className="material-icons">folder_open</span>
                                    Active Cases
                                </h2>
                                <button className="text-primary font-semibold text-sm hover:underline">View All Cases</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeCases.map((caseItem) => (
                                    <div key={caseItem.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Case ID: {caseItem.id}</span>
                                                <h3 className="font-bold text-lg text-primary group-hover:text-blue-700 transition-colors">{caseItem.title}</h3>
                                            </div>
                                            <span className={`${getStatusColor(caseItem.statusColor)} text-[10px] font-bold px-2 py-1 rounded uppercase`}>
                                                {caseItem.status}
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-xs font-semibold mb-1">
                                                    <span className="text-slate-500">Medical Chronology Progress</span>
                                                    <span className="text-primary">{caseItem.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${caseItem.progress}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
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
                                                <button className="bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold py-1.5 px-4 rounded transition-colors">
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
                                <h2 className="text-xl font-bold text-primary dark:text-white flex items-center gap-2">
                                    <span className="material-icons">description</span>
                                    Recent Documents
                                </h2>
                                <button className="bg-primary text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 hover:bg-primary/90 transition-colors">
                                    <span className="material-icons text-sm">cloud_upload</span> Upload Record
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-primary/5">
                                        <tr>
                                            <th className="px-6 py-3">File Name</th>
                                            <th className="px-6 py-3">Case</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {recentDocuments.map((doc, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`material-icons text-${doc.iconColor}-500`}>{doc.icon}</span>
                                                        <div>
                                                            <p className="text-sm font-semibold text-primary">{doc.name}</p>
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
                                                    <button className="text-primary hover:bg-primary/5 p-1.5 rounded-lg transition-colors">
                                                        <span className="material-icons">download</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 text-center">
                                    <button className="text-xs font-bold text-primary hover:underline">See All Documents</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Messaging & Stats */}
                    <div className="space-y-8">
                        {/* Secure Messaging Widget */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm overflow-hidden">
                            <div className="bg-primary p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-white">chat</span>
                                    <h3 className="text-white font-bold text-sm uppercase tracking-wide">Secure Messaging</h3>
                                </div>
                                <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded text-[10px] text-green-300 font-bold">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    ENCRYPTED
                                </div>
                            </div>
                            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto bg-slate-50/30">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.isOwn ? 'items-end ml-auto' : 'items-start'} max-w-[85%]`}>
                                        <div className={`${msg.isOwn ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-600 border border-slate-100'} p-3 rounded-lg ${msg.isOwn ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-sm`}>
                                            <p className="text-xs leading-relaxed">{msg.message}</p>
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1 ml-1 font-semibold">{msg.sender} • {msg.time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-primary/5">
                                <div className="relative">
                                    <textarea
                                        className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:ring-1 focus:ring-primary focus:border-primary resize-none pr-10"
                                        placeholder="Type a secure message..."
                                        rows="2"
                                    ></textarea>
                                    <button className="absolute bottom-2 right-2 text-primary hover:scale-110 transition-transform">
                                        <span className="material-icons">send</span>
                                    </button>
                                </div>
                                <p className="text-[9px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                                    <span className="material-icons text-[10px]">shield</span> All messages are 256-bit AES encrypted
                                </p>
                            </div>
                        </div>

                        {/* Firm Resources & Contact */}
                        <div className="bg-primary/5 dark:bg-slate-900/50 p-6 rounded-xl border-2 border-dashed border-primary/10">
                            <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-wide">
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
                                    <button className="w-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 px-4 rounded border border-slate-200 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-icons text-sm">schedule</span> Schedule Briefing
                                    </button>
                                    <button className="w-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 px-4 rounded border border-slate-200 transition-colors flex items-center justify-center gap-2">
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

            <footer className="mt-12 py-8 border-t border-primary/10 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 opacity-50">
                        <span className="material-icons text-sm">shield</span>
                        <span className="text-xs font-semibold">Protected by 256-bit Encryption & HIPAA Compliant Infrastructure</span>
                    </div>
                    <div className="flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">Compliance Portal</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClientDashboard;
