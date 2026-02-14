import { useState, useEffect } from 'react';
import caseAnalysisService from '../../../services/caseAnalysis.service';
import caseService from '../../../services/case.service';

const DamagesTracking = () => {
    const [selectedCase, setSelectedCase] = useState('');
    const [cases, setCases] = useState([]);
    const [damages, setDamages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    useEffect(() => {
        if (selectedCase) {
            fetchDamages();
        }
    }, [selectedCase]);

    const fetchCases = async () => {
        try {
            const data = await caseService.getAllCases();
            setCases(data.cases || []);
            if (data.cases && data.cases.length > 0) {
                setSelectedCase(data.cases[0]._id);
            }
        } catch (error) {
            console.error('Failed to load cases:', error);
        }
    };

    const fetchDamages = async () => {
        try {
            setLoading(true);
            const data = await caseAnalysisService.getDamagesByCase(selectedCase);
            setDamages(data || []);
        } catch (error) {
            console.error('Failed to load damages:', error);
            setDamages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this damage item?')) return;
        
        try {
            await caseAnalysisService.deleteDamage(id);
            alert('Damage item deleted successfully');
            fetchDamages();
        } catch (error) {
            alert('Failed to delete damage item: ' + error.message);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Verified': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'verified': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'Pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Estimated': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'estimated': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        };
        return colors[status] || colors['Pending'];
    };

    const totalDamages = damages.reduce((sum, item) => sum + item.amount, 0);
    const verifiedDamages = damages.filter(d => d.status === 'Verified' || d.status === 'verified').reduce((sum, item) => sum + item.amount, 0);
    const estimatedDamages = damages.filter(d => d.status === 'Estimated' || d.status === 'estimated').reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="max-w-7xl mx-auto">
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

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Select Case:</label>
                    <select
                        className="flex-1 max-w-md px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                        value={selectedCase}
                        onChange={(e) => setSelectedCase(e.target.value)}
                    >
                        {cases.map(c => (
                            <option key={c._id} value={c._id}>{c.title} ({c.caseNumber})</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0891b2] mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading damages...</p>
                    </div>
                </div>
            )}

            {!loading && (
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
            )}

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
                            {!loading && damages.length > 0 ? damages.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{new Date(item.date).toLocaleDateString()}</td>
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
                                            <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Delete">
                                                <span className="material-icons text-slate-400 hover:text-red-500">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : !loading && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        No damage items found for this case
                                    </td>
                                </tr>
                            )}
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
