import { useState } from 'react';

const DamagesTracking = () => {
    const [selectedCase, setSelectedCase] = useState('2024-MED-042');

    const damages = [
        {
            id: 1,
            category: 'Medical Expenses',
            description: 'Emergency Room Treatment',
            date: '2024-06-15',
            amount: 12500,
            status: 'Verified',
            documentation: 'Hospital Bill #4521'
        },
        {
            id: 2,
            category: 'Medical Expenses',
            description: 'Surgical Procedure',
            date: '2024-06-16',
            amount: 45000,
            status: 'Verified',
            documentation: 'Surgical Invoice #8842'
        },
        {
            id: 3,
            category: 'Lost Wages',
            description: 'Work Absence (3 months)',
            date: '2024-06-15',
            amount: 18000,
            status: 'Pending',
            documentation: 'Employment Records'
        },
        {
            id: 4,
            category: 'Pain & Suffering',
            description: 'Physical and Emotional Distress',
            date: '2024-06-15',
            amount: 75000,
            status: 'Estimated',
            documentation: 'Medical Assessment'
        },
        {
            id: 5,
            category: 'Future Medical Care',
            description: 'Ongoing Physical Therapy',
            date: '2024-06-15',
            amount: 25000,
            status: 'Estimated',
            documentation: 'Treatment Plan'
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Verified': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'Pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Estimated': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        };
        return colors[status] || colors['Pending'];
    };

    const totalDamages = damages.reduce((sum, item) => sum + item.amount, 0);
    const verifiedDamages = damages.filter(d => d.status === 'Verified').reduce((sum, item) => sum + item.amount, 0);
    const estimatedDamages = damages.filter(d => d.status === 'Estimated').reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Damages Tracking</h1>
                    <p className="text-slate-500 mt-1">Document injuries and calculate damages</p>
                </div>
                <button className="bg-[#0891b2] hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all transform active:scale-95">
                    <span className="material-icons text-sm">add</span>
                    Add Damage Item
                </button>
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-icons text-purple-600">attach_money</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">${(totalDamages / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Total Damages</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="material-icons text-green-600">verified</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">${(verifiedDamages / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Verified</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-icons text-blue-600">calculate</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">${(estimatedDamages / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Estimated</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <span className="material-icons text-orange-600">description</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{damages.length}</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Line Items</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Damages Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white">Damage Items</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase text-slate-400">
                            <tr>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Amount</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Documentation</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {damages.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            ${item.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.documentation}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Edit">
                                                <span className="material-icons text-slate-400 hover:text-[#0891b2]">edit</span>
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Delete">
                                                <span className="material-icons text-slate-400 hover:text-red-500">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                    Total Damages:
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-lg font-bold text-[#0891b2]">
                                        ${totalDamages.toLocaleString()}
                                    </span>
                                </td>
                                <td colSpan="3"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DamagesTracking;
