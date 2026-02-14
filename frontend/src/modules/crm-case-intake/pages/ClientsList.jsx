import { useState } from 'react';

const ClientsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [referralFilter, setReferralFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');

    const clients = [
        {
            id: 1,
            name: 'Jameson Daugherty',
            firm: 'Daugherty Legal Group LLP',
            initials: 'JD',
            color: 'bg-[#0891b2]/20 text-[#0891b2]',
            email: 'j.daugherty@dlg-law.com',
            phone: '(555) 012-8844',
            referralSource: 'Direct Referral',
            activeCases: 12,
            status: 'active'
        },
        {
            id: 2,
            name: 'Samantha Reynolds',
            firm: 'Reynolds Medical Law',
            initials: 'SR',
            color: 'bg-amber-500/20 text-amber-600',
            email: 'sreynolds@reynoldslaw.io',
            phone: '(555) 998-3321',
            referralSource: 'ABA Conference',
            activeCases: 4,
            status: 'active'
        },
        {
            id: 3,
            name: 'Marcus Thorne',
            firm: 'Thorne & Associates',
            initials: 'MT',
            color: 'bg-indigo-500/20 text-indigo-600',
            email: 'm.thorne@thornelegal.com',
            phone: '(555) 441-2900',
            referralSource: 'Organic Search',
            activeCases: 0,
            status: 'inactive'
        },
        {
            id: 4,
            name: 'Linda Wu',
            firm: 'Coastal Injury Law',
            initials: 'LW',
            color: 'bg-[#0891b2]/20 text-[#0891b2]',
            email: 'lwu@coastal-injury.com',
            phone: '(555) 772-0199',
            referralSource: 'Website Lead',
            activeCases: 7,
            status: 'active'
        },
        {
            id: 5,
            name: 'Benjamin Kael',
            firm: 'Kael Medical Litigation',
            initials: 'BK',
            color: 'bg-emerald-500/20 text-emerald-600',
            email: 'b.kael@kael-litigation.org',
            phone: '(555) 233-1104',
            referralSource: 'Referral',
            activeCases: 2,
            status: 'on-hold'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Client Directory</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage HIPAA-compliant attorney relationships and firm records.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-medium">
                            <span className="material-icons text-sm mr-2">file_download</span>
                            Export CSV
                        </button>
                        <button className="flex items-center px-5 py-2.5 bg-[#0891b2] hover:bg-teal-700 text-white rounded-lg shadow-lg shadow-[#0891b2]/20 transition-all text-sm font-semibold">
                            <span className="material-icons text-sm mr-2">person_add</span>
                            New Client
                        </button>
                    </div>
                </div>
            </header>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 mb-6 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0891b2]/50 focus:border-[#0891b2] outline-none text-sm transition-all text-slate-700 dark:text-slate-200"
                        placeholder="Search by name, firm, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-[#0891b2]/50 outline-none"
                        value={referralFilter}
                        onChange={(e) => setReferralFilter(e.target.value)}
                    >
                        <option value="all">Referral Source: All</option>
                        <option value="direct">Direct Outreach</option>
                        <option value="conference">Legal Conference</option>
                        <option value="referral">Referral</option>
                        <option value="website">Website</option>
                    </select>
                    <select
                        className="bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-[#0891b2]/50 outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="active">Status: Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending Intake</option>
                    </select>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden lg:block"></div>
                <button className="text-slate-500 hover:text-[#0891b2] transition-colors p-2">
                    <span className="material-icons">filter_list</span>
                </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#0891b2]/5 border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Client & Firm
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Contact Details
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Referral Source
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                                    Active Cases
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-[#0891b2]/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full ${client.color} flex items-center justify-center font-bold text-sm`}>
                                                {client.initials}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{client.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{client.firm}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-700 dark:text-slate-300">{client.email}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">{client.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                            {client.referralSource}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md bg-[#0891b2]/10 text-[#0891b2] text-xs font-bold border border-[#0891b2]/20">
                                            {client.activeCases}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${client.status === 'active' ? 'bg-green-500' :
                                                    client.status === 'on-hold' ? 'bg-amber-400' :
                                                        'bg-slate-400'
                                                }`}></span>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                                                {client.status === 'on-hold' ? 'On Hold' : client.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-slate-400 hover:text-[#0891b2] transition-colors">
                                                <span className="material-icons text-lg">visibility</span>
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-[#0891b2] transition-colors">
                                                <span className="material-icons text-lg">edit</span>
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                                <span className="material-icons text-lg">more_vert</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-[#0891b2]/5 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Showing <span className="font-bold text-slate-700 dark:text-slate-200">1</span> to{' '}
                        <span className="font-bold text-slate-700 dark:text-slate-200">5</span> of{' '}
                        <span className="font-bold text-slate-700 dark:text-slate-200">42</span> clients
                    </p>
                    <div className="flex items-center space-x-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all">
                            <span className="material-icons text-sm">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0891b2] text-white text-xs font-bold shadow-sm shadow-[#0891b2]/20">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 text-xs font-bold transition-all">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 text-xs font-bold transition-all">
                            3
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all">
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* System Stats Footer */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 flex items-center">
                    <div className="p-3 bg-[#0891b2]/10 rounded-lg text-[#0891b2] mr-4">
                        <span className="material-icons">handshake</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Active Clients</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">38</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 flex items-center">
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500 mr-4">
                        <span className="material-icons">trending_up</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">New Leads (30d)</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">+12.4%</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 flex items-center">
                    <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 mr-4">
                        <span className="material-icons">verified</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Compliance Status</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">HIPAA Secure</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientsList;
