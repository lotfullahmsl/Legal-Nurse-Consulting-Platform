import { useState } from 'react';

const UsersManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const users = [
        {
            id: 1,
            name: 'Sarah Jenkins',
            email: 'sarah.jenkins@lnc.com',
            role: 'Admin',
            status: 'Active',
            lastLogin: '2024-10-23 09:15 AM',
            casesAssigned: 24,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFEs4MsZDwYKlGCffMO5mgq_LeJlPyqcvZCkHss-RgaraTQwLIAGp8QOSdO3fOGxL3gMmpUlmZZp-XF0kA9JlBXoJvRQC81yRx1qUDMJVswupgNE9qVYxTF4le-uklgq7zwWEVFG3BJT2OixOzKX0Y43hzV2G-v9zWUCqsiFL2gdChkO3t5dwLtQRGAkzKTx3APi9SK6WBLr7FLU1eB_htyJpiA2tm7bf64yQQD_UUPEHIx5llBVoqML8Z7pqiWdYOfjl2_IfRNw'
        },
        {
            id: 2,
            name: 'David Richardson',
            email: 'david.r@lnc.com',
            role: 'Attorney',
            status: 'Active',
            lastLogin: '2024-10-23 08:42 AM',
            casesAssigned: 18,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLx9zr3ATINz5h0BlFb-FZYMV40fUtf9q03fpCrkHi7GlCStAbqyljc6cug3rywj9qWCO6Tgdhw_U4GoTgtXGi68WbpvTSqBp1CFScu8uDCuKRkZ0IwUkddNdGK5gPmb9oDA3AubMvf5Hvk9L3M1lxYyk-T_bDUHeIekE8myXDCh5vCthSe2OQ1hLb6wIdSLYI1bvxCOvU19A80uhzAglqkl5xmBsD9rIW1fM5AmygpT8JGGu39JD-UDWHztDChACouf7jUPMY_RM'
        },
        {
            id: 3,
            name: 'Elena Rodriguez',
            email: 'elena.rodriguez@lnc.com',
            role: 'Legal Nurse',
            status: 'Active',
            lastLogin: '2024-10-22 04:30 PM',
            casesAssigned: 32,
            initials: 'ER'
        },
        {
            id: 4,
            name: 'Michael Chen',
            email: 'michael.chen@lnc.com',
            role: 'Legal Nurse',
            status: 'Active',
            lastLogin: '2024-10-23 07:15 AM',
            casesAssigned: 28,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMRX-dlto7H-IfNxGJODciYPd59IG6N1Qlv2Z9j09dkAmuEqw4QJelDB4Mk2rEn37QBLxUuwuGomYIbeDEaRsjHjUjj5JlzCrHCI7LOCJzTY-w-U0j0EZmjq5Vddu-_BC9mglpxmV_-8mZF5hGeZyshP4sDm7Oo2nMAQTSs0ffcafzTF50LzZzBuRpMY2wI1rXfd4a-hKcpoixGMuTRFINzJr0nyNgINZ_DchnywG-0Lu2fIgz_ETj3WJ1d0AwQssNdojHAwkYs2Y'
        },
        {
            id: 5,
            name: 'Robert Vance',
            email: 'robert.vance@lnc.com',
            role: 'Attorney',
            status: 'Inactive',
            lastLogin: '2024-10-15 02:20 PM',
            casesAssigned: 12,
            initials: 'RV'
        }
    ];

    const getRoleBadgeColor = (role) => {
        const colors = {
            'Admin': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'Attorney': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'Legal Nurse': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
            'Client': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
        };
        return colors[role] || colors['Client'];
    };

    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage system users and permissions</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#0891b2] hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
                >
                    <span className="material-icons text-sm">person_add</span>
                    Add User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-icons text-blue-600">people</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">42</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="material-icons text-green-600">check_circle</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">38</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-icons text-purple-600">admin_panel_settings</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">5</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Admins</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                            <span className="material-icons text-teal-600">medical_services</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">24</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Legal Nurses</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-transparent outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="attorney">Attorney</option>
                            <option value="nurse">Legal Nurse</option>
                            <option value="client">Client</option>
                        </select>
                        <select
                            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase text-slate-400">
                            <tr>
                                <th className="px-6 py-3 text-left">User</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Role</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Last Login</th>
                                <th className="px-6 py-3 text-left">Cases</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-[#1f3b61]/10 flex items-center justify-center text-[#1f3b61] text-sm font-bold ring-2 ring-white dark:ring-slate-800">
                                                    {user.initials}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.lastLogin}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.casesAssigned}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Edit">
                                                <span className="material-icons text-slate-400 hover:text-[#0891b2]">edit</span>
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Delete">
                                                <span className="material-icons text-slate-400 hover:text-red-500">delete</span>
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="More">
                                                <span className="material-icons text-slate-400 hover:text-[#0891b2]">more_vert</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing 1-5 of 42 users</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 bg-[#0891b2] text-white rounded-lg text-sm">1</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">3</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Add New User</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none" placeholder="Enter full name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input type="email" className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none" placeholder="Enter email" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none">
                                    <option>Select role</option>
                                    <option>Admin</option>
                                    <option>Attorney</option>
                                    <option>Legal Nurse</option>
                                    <option>Client</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors">
                                    Add User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
