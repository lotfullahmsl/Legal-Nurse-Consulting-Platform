import { useState } from 'react';
import { Link } from 'react-router-dom';

const CasesList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const cases = [
        {
            id: '#LNC-2023-104',
            created: 'Oct 12, 2023',
            firm: 'Sterling & Associates',
            client: 'Johnathan Sterling',
            type: 'Medical Malpractice',
            status: 'Active',
            statusColor: 'emerald',
            attorney: 'David Richardson',
            attorneyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLx9zr3ATINz5h0BlFb-FZYMV40fUtf9q03fpCrkHi7GlCStAbqyljc6cug3rywj9qWCO6Tgdhw_U4GoTgtXGi68WbpvTSqBp1CFScu8uDCuKRkZ0IwUkddNdGK5gPmb9oDA3AubMvf5Hvk9L3M1lxYyk-T_bDUHeIekE8myXDCh5vCthSe2OQ1hLb6wIdSLYI1bvxCOvU19A80uhzAglqkl5xmBsD9rIW1fM5AmygpT8JGGu39JD-UDWHztDChACouf7jUPMY_RM'
        },
        {
            id: '#LNC-2023-098',
            created: 'Oct 05, 2023',
            firm: 'Oakwood Law Group',
            client: 'Sarah Jenkins',
            type: 'Personal Injury',
            status: 'In Review',
            statusColor: 'amber',
            attorney: 'Elena Rodriguez',
            attorneyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFEs4MsZDwYKlGCffMO5mgq_LeJlPyqcvZCkHss-RgaraTQwLIAGp8QOSdO3fOGxL3gMmpUlmZZp-XF0kA9JlBXoJvRQC81yRx1qUDMJVswupgNE9qVYxTF4le-uklgq7zwWEVFG3BJT2OixOzKX0Y43hzV2G-v9zWUCqsiFL2gdChkO3t5dwLtQRGAkzKTx3APi9SK6WBLr7FLU1eB_htyJpiA2tm7bf64yQQD_UUPEHIx5llBVoqML8Z7pqiWdYOfjl2_IfRNw'
        },
        {
            id: '#LNC-2023-087',
            created: 'Sep 28, 2023',
            firm: 'Miller & Co. Legal',
            client: 'Thomas Miller',
            type: 'Mass Tort',
            status: 'Pending Intake',
            statusColor: 'blue',
            attorney: 'Jameson Douglas',
            attorneyInitials: 'JD'
        },
        {
            id: '#LNC-2023-082',
            created: 'Sep 20, 2023',
            firm: 'City Health Litigation',
            client: 'Legal Department',
            type: 'Medical Malpractice',
            status: 'Closed',
            statusColor: 'slate',
            attorney: 'Michael Chen',
            attorneyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMRX-dlto7H-IfNxGJODciYPd59IG6N1Qlv2Z9j09dkAmuEqw4QJelDB4Mk2rEn37QBLxUuwuGomYIbeDEaRsjHjUjj5JlzCrHCI7LOCJzTY-w-U0j0EZmjq5Vddu-_BC9mglpxmV_-8mZF5hGeZyshP4sDm7Oo2nMAQTSs0ffcafzTF50LzZzBuRpMY2wI1rXfd4a-hKcpoixGMuTRFINzJr0nyNgINZ_DchnywG-0Lu2fIgz_ETj3WJ1d0AwQssNdojHAwkYs2Y'
        }
    ];

    const getStatusClasses = (color) => {
        const colors = {
            emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
            amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
            blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            slate: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
        };
        return colors[color] || colors.slate;
    };

    return (
        <div>
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-[#1f3b61]/10 dark:border-[#1f3b61]/20 -mx-8 -mt-8 mb-8 px-8 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <nav className="flex text-xs text-[#1f3b61]/60 dark:text-[#1f3b61]/40 mb-1">
                            <Link to="/dashboard" className="hover:text-[#1f3b61] transition-colors">Dashboard</Link>
                            <span className="material-icons text-xs mx-1">chevron_right</span>
                            <span className="font-medium text-[#1f3b61] dark:text-[#1f3b61]/60">Case Management</span>
                        </nav>
                        <h1 className="text-xl font-bold text-[#1f3b61] dark:text-white flex items-center gap-2">
                            <span className="material-icons text-[#1f3b61]/80">folder_shared</span>
                            Active Cases
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center justify-center p-2 rounded-full text-[#1f3b61]/60 hover:bg-[#1f3b61]/5 dark:hover:bg-[#1f3b61]/10 transition-colors">
                            <span className="material-icons">notifications</span>
                        </button>
                        <Link to="/cases/new" className="bg-[#1f3b61] hover:bg-[#1f3b61]/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm">
                            <span className="material-icons text-sm">add</span>
                            New Case
                        </Link>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#1f3b61]/5 dark:border-[#1f3b61]/10 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-grow min-w-[300px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-icons text-[#1f3b61]/40 text-sm">search</span>
                        </span>
                        <input
                            className="block w-full pl-10 pr-3 py-2 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg bg-[#f6f7f8] dark:bg-[#14181e] text-sm placeholder-[#1f3b61]/40 focus:outline-none focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61] transition-all"
                            placeholder="Search case #, client or attorney..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="block w-48 pl-3 pr-10 py-2 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg bg-[#f6f7f8] dark:bg-[#14181e] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61] transition-all"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="review">In Review</option>
                        <option value="pending">Pending Intake</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select
                        className="block w-56 pl-3 pr-10 py-2 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg bg-[#f6f7f8] dark:bg-[#14181e] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61] transition-all"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Case Types</option>
                        <option value="malpractice">Medical Malpractice</option>
                        <option value="injury">Personal Injury</option>
                        <option value="tort">Mass Tort</option>
                        <option value="liability">Product Liability</option>
                    </select>
                    <button className="text-[#1f3b61]/60 hover:text-[#1f3b61] text-sm font-medium transition-colors px-2">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#1f3b61]/5 dark:border-[#1f3b61]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1f3b61]/5 dark:bg-[#1f3b61]/10 border-b border-[#1f3b61]/10 dark:border-[#1f3b61]/20">
                                <th className="px-6 py-4 text-xs font-semibold text-[#1f3b61]/70 dark:text-[#1f3b61]/40 uppercase tracking-wider">Case Number</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#1f3b61]/70 dark:text-[#1f3b61]/40 uppercase tracking-wider">Client / Firm</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#1f3b61]/70 dark:text-[#1f3b61]/40 uppercase tracking-wider">Case Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#1f3b61]/70 dark:text-[#1f3b61]/40 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#1f3b61]/70 dark:text-[#1f3b61]/40 uppercase tracking-wider">Assigned Attorney</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#1f3b61]/70 dark:text-[#1f3b61]/40 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f3b61]/5 dark:divide-[#1f3b61]/10">
                            {cases.map((caseItem) => (
                                <tr key={caseItem.id} className="hover:bg-[#1f3b61]/5 dark:hover:bg-[#1f3b61]/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <Link to={`/cases/${caseItem.id}`} className="font-mono font-medium text-[#1f3b61] hover:underline">
                                            {caseItem.id}
                                        </Link>
                                        <div className="text-[10px] text-slate-400 mt-0.5 italic">Created {caseItem.created}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold">{caseItem.firm}</div>
                                        <div className="text-xs text-slate-500">{caseItem.client}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{caseItem.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(caseItem.statusColor)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${caseItem.statusColor === 'emerald' ? 'bg-emerald-500' : caseItem.statusColor === 'amber' ? 'bg-amber-500' : caseItem.statusColor === 'blue' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                                            {caseItem.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {caseItem.attorneyImage ? (
                                                <img alt={caseItem.attorney} className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-800" src={caseItem.attorneyImage} />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-[#1f3b61]/10 flex items-center justify-center text-[#1f3b61] text-[10px] font-bold ring-2 ring-white dark:ring-slate-800">
                                                    {caseItem.attorneyInitials}
                                                </div>
                                            )}
                                            <span className="ml-3 text-sm font-medium">{caseItem.attorney}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#1f3b61]/40 hover:text-[#1f3b61] transition-colors p-1 rounded-md">
                                            <span className="material-icons">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-[#1f3b61]/5 dark:bg-[#1f3b61]/10 border-t border-[#1f3b61]/10 dark:border-[#1f3b61]/20 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-semibold text-slate-800 dark:text-slate-300">1</span> to <span className="font-semibold text-slate-800 dark:text-slate-300">4</span> of <span className="font-semibold text-slate-800 dark:text-slate-300">24</span> entries
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>
                            <span className="material-icons text-sm">chevron_left</span>
                        </button>
                        <button className="px-3 py-1 bg-[#1f3b61] text-white rounded-lg text-sm font-medium">1</button>
                        <button className="px-3 py-1 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors">2</button>
                        <button className="px-3 py-1 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors">3</button>
                        <span className="text-slate-400">...</span>
                        <button className="px-3 py-1 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg text-sm font-medium hover:bg-white dark:hover:bg-slate-800 transition-colors">6</button>
                        <button className="p-2 border border-[#1f3b61]/10 dark:border-[#1f3b61]/20 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* HIPAA Banner */}
            <div className="mt-8 flex items-center justify-center p-4 bg-[#1f3b61]/5 rounded-xl border border-dashed border-[#1f3b61]/20">
                <span className="material-icons text-[#1f3b61]/60 mr-2 text-lg">verified_user</span>
                <p className="text-xs text-[#1f3b61]/60 font-medium">
                    This environment is HIPAA Compliant. All session activities are logged and monitored for security.
                    <a className="underline hover:text-[#1f3b61] transition-colors ml-1" href="#">Learn more about our data protection.</a>
                </p>
            </div>
        </div>
    );
};

export default CasesList;
