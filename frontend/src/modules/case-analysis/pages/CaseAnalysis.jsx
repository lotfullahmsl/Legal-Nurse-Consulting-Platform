import { useEffect, useState } from 'react';
import caseService from '../../../services/case.service';
import caseAnalysisService from '../../../services/caseAnalysis.service';

const CaseAnalysis = () => {
    const [selectedCase, setSelectedCase] = useState('');
    const [activeTab, setActiveTab] = useState('standards');
    const [cases, setCases] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    useEffect(() => {
        if (selectedCase) {
            fetchAnalysis();
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

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const data = await caseAnalysisService.getAnalysisByCase(selectedCase);
            setAnalysis(data);
        } catch (error) {
            console.error('Failed to load analysis:', error);
            setAnalysis(null);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'high': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'Medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Low': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'low': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'None': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'none': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        };
        return colors[severity] || colors['None'];
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Case Analysis</h1>
                    <p className="text-slate-500 mt-1">Analyze standards of care and identify deviations</p>
                </div>
                <button className="bg-[#0891b2] hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all transform active:scale-95">
                    <span className="material-icons text-sm">add</span>
                    Add Finding
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
                        <p className="mt-4 text-slate-500">Loading analysis...</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            {!loading && analysis && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="material-icons text-blue-600">rule</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{analysis.standardsOfCare?.length || 0}</p>
                                <p className="text-xs text-slate-500 uppercase font-bold">Standards Reviewed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <span className="material-icons text-red-600">warning</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{analysis.breaches?.length || 0}</p>
                                <p className="text-xs text-slate-500 uppercase font-bold">Deviations Found</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                <span className="material-icons text-yellow-600">priority_high</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{analysis.breaches?.filter(b => b.severity === 'high').length || 0}</p>
                                <p className="text-xs text-slate-500 uppercase font-bold">High Severity</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="material-icons text-green-600">check_circle</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{(analysis.standardsOfCare?.length || 0) - (analysis.breaches?.length || 0)}</p>
                                <p className="text-xs text-slate-500 uppercase font-bold">Standards Met</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                <div className="border-b border-slate-200 dark:border-slate-800 px-6">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('standards')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'standards'
                                ? 'border-[#0891b2] text-[#0891b2]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Standards of Care
                        </button>
                        <button
                            onClick={() => setActiveTab('deviations')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'deviations'
                                ? 'border-[#0891b2] text-[#0891b2]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Identified Deviations
                        </button>
                    </div>
                </div>

                {/* Standards Tab */}
                {activeTab === 'standards' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase text-slate-400">
                                <tr>
                                    <th className="px-6 py-3 text-left">Category</th>
                                    <th className="px-6 py-3 text-left">Standard</th>
                                    <th className="px-6 py-3 text-left">Assessment</th>
                                    <th className="px-6 py-3 text-left">Evidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {analysis && analysis.standardsOfCare && analysis.standardsOfCare.length > 0 ? analysis.standardsOfCare.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.category}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{item.standard}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{item.assessment}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.evidence}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            No standards of care documented yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Deviations Tab */}
                {activeTab === 'deviations' && !loading && (
                    <div className="p-6 space-y-4">
                        {analysis && analysis.breaches && analysis.breaches.length > 0 ? (
                            analysis.breaches.map((breach, idx) => (
                                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{breach.description}</h3>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-icons text-xs">calendar_today</span>
                                                    {new Date(breach.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(breach.severity || 'Medium')}`}>
                                            {breach.severity || 'Medium'} Impact
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{breach.impact}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No deviations identified yet
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseAnalysis;
