import { useEffect, useState } from 'react';

const ClientReports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        // Mock data
        setReports([
            {
                id: 1,
                title: 'Attorney Summary Report',
                caseNumber: 'ML-88291',
                caseName: 'Miller vs. Sterling Medical',
                generatedDate: '2024-02-15',
                type: 'Attorney Summary',
                pages: 24,
                status: 'ready',
                description: 'Comprehensive medical expert opinion and case merits analysis'
            },
            {
                id: 2,
                title: 'Medical Chronology',
                caseNumber: 'ML-88291',
                caseName: 'Miller vs. Sterling Medical',
                generatedDate: '2024-02-10',
                type: 'Timeline',
                pages: 18,
                status: 'ready',
                description: 'Detailed chronological timeline of medical events'
            },
            {
                id: 3,
                title: 'Standards of Care Analysis',
                caseNumber: 'ML-88291',
                caseName: 'Miller vs. Sterling Medical',
                generatedDate: '2024-02-20',
                type: 'Analysis',
                pages: 32,
                status: 'generating',
                description: 'Expert analysis of care deviations and liability assessment'
            }
        ]);
    };

    const getReportIcon = (type) => {
        const icons = {
            'Attorney Summary': 'summarize',
            'Timeline': 'timeline',
            'Analysis': 'analytics',
            'Trial Brief': 'gavel'
        };
        return icons[type] || 'description';
    };

    const getStatusBadge = (status) => {
        const badges = {
            ready: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            generating: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        };
        return badges[status] || badges.generating;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Case Reports</h1>
                <p className="text-slate-600 dark:text-slate-400">Download generated reports and analysis documents</p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-[#0891b2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <span className="material-icons text-[#0891b2] text-3xl">{getReportIcon(report.type)}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{report.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusBadge(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{report.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="material-icons text-sm">folder</span>
                                        <span>{report.caseNumber} - {report.caseName}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <span className="material-icons text-sm">calendar_today</span>
                                            <span>{new Date(report.generatedDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-icons text-sm">description</span>
                                            <span>{report.pages} pages</span>
                                        </div>
                                    </div>
                                </div>

                                {report.status === 'ready' ? (
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-[#0891b2] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#0891b2]/90 transition-colors flex items-center justify-center gap-2">
                                            <span className="material-icons text-lg">download</span>
                                            Download PDF
                                        </button>
                                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <span className="material-icons">visibility</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-2">
                                        <div className="animate-spin">
                                            <span className="material-icons text-amber-600">refresh</span>
                                        </div>
                                        <span className="text-sm text-amber-700 dark:text-amber-400">Report is being generated...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-[#0891b2]/5 border border-[#0891b2]/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <span className="material-icons text-[#0891b2] text-3xl">info</span>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">About These Reports</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            All reports are prepared by board-certified legal nurse consultants and are court-ready.
                            Each report includes detailed citations to source medical records and expert analysis.
                        </p>
                        <p className="text-xs text-slate-500">
                            Reports are typically generated within 5-7 business days after medical record review is complete.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientReports;
