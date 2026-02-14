import { useState } from 'react';

const CaseAnalysis = () => {
    const [selectedCase, setSelectedCase] = useState('2024-MED-042');
    const [activeTab, setActiveTab] = useState('standards');

    const standardsOfCare = [
        {
            id: 1,
            category: 'Pre-Operative Assessment',
            standard: 'Complete patient history and physical examination required',
            finding: 'Incomplete cardiovascular assessment documented',
            deviation: 'Yes',
            severity: 'High',
            evidence: 'Hospital Records p. 12-15'
        },
        {
            id: 2,
            category: 'Informed Consent',
            standard: 'Patient must be informed of all risks and alternatives',
            finding: 'Consent form signed but risks not fully documented',
            deviation: 'Yes',
            severity: 'Medium',
            evidence: 'Consent Form, Surgical Notes'
        },
        {
            id: 3,
            category: 'Post-Operative Monitoring',
            standard: 'Vital signs every 15 minutes for first hour',
            finding: 'Monitoring conducted as per protocol',
            deviation: 'No',
            severity: 'None',
            evidence: 'Nursing Notes p. 45-48'
        }
    ];

    const deviations = [
        {
            id: 1,
            title: 'Failure to Perform Complete Pre-Op Assessment',
            date: '2024-06-15',
            provider: 'Dr. Robert Smith',
            impact: 'High',
            description: 'Cardiovascular assessment was incomplete prior to surgery, missing critical risk factors.'
        },
        {
            id: 2,
            title: 'Inadequate Informed Consent Documentation',
            date: '2024-06-15',
            provider: 'Dr. Robert Smith',
            impact: 'Medium',
            description: 'Consent form lacks detailed documentation of specific surgical risks discussed with patient.'
        }
    ];

    const getSeverityColor = (severity) => {
        const colors = {
            'High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'Medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Low': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'None': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
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
                        <option value="2024-MED-042">Miller vs. City Hospital (#2024-MED-042)</option>
                        <option value="2024-MED-039">Ramirez Malpractice (#2024-MED-039)</option>
                        <option value="2024-MED-015">Thompson - Ortho Review (#2024-MED-015)</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-icons text-blue-600">rule</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">24</p>
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
                            <p className="text-2xl font-bold">5</p>
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
                            <p className="text-2xl font-bold">2</p>
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
                            <p className="text-2xl font-bold">19</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Standards Met</p>
                        </div>
                    </div>
                </div>
            </div>

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
                                    <th className="px-6 py-3 text-left">Finding</th>
                                    <th className="px-6 py-3 text-left">Deviation</th>
                                    <th className="px-6 py-3 text-left">Severity</th>
                                    <th className="px-6 py-3 text-left">Evidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {standardsOfCare.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.category}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{item.standard}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{item.finding}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.deviation === 'Yes'
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                {item.deviation}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(item.severity)}`}>
                                                {item.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.evidence}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Deviations Tab */}
                {activeTab === 'deviations' && (
                    <div className="p-6 space-y-4">
                        {deviations.map((deviation) => (
                            <div key={deviation.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{deviation.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons text-xs">calendar_today</span>
                                                {deviation.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons text-xs">person</span>
                                                {deviation.provider}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(deviation.impact)}`}>
                                        {deviation.impact} Impact
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{deviation.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseAnalysis;
