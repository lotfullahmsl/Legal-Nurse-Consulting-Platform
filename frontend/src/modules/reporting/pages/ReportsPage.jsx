
const ReportsPage = () => {
    const templates = [
        {
            id: 1,
            icon: 'summarize',
            title: 'Attorney-Ready Summary',
            description: 'High-level medical expert opinions and case merits formatted for legal review.',
            color: 'text-[#0891b2]'
        },
        {
            id: 2,
            icon: 'history',
            title: 'Medical Chronology',
            description: 'Detailed chronological timeline of medical events and provider interventions.',
            color: 'text-[#0891b2]'
        },
        {
            id: 3,
            icon: 'error_outline',
            title: 'Missing Records Audit',
            description: 'Systematic identification of gaps in the medical record production.',
            color: 'text-[#0891b2]'
        },
        {
            id: 4,
            icon: 'medical_services',
            title: 'Life Care Plan',
            description: 'Comprehensive projection of future medical needs and associated costs.',
            color: 'text-[#0891b2]'
        }
    ];

    const recentReports = [
        {
            id: 1,
            icon: 'picture_as_pdf',
            title: 'Medical Chronology - Johnson, Robert',
            template: 'Standard Template',
            caseId: '#4492-SMITH-HOSP',
            date: 'Oct 24, 2023, 11:20 AM',
            status: 'ready',
            statusLabel: 'Ready',
            statusColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        },
        {
            id: 2,
            icon: 'article',
            title: 'Attorney-Ready Merit Review',
            template: 'Custom Builder',
            caseId: '#8812-DAVIS-PI',
            date: 'Oct 23, 2023, 04:45 PM',
            status: 'processing',
            statusLabel: 'Processing',
            statusColor: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        },
        {
            id: 3,
            icon: 'description',
            title: 'Missing Records Affidavit - Est. 2023',
            template: 'Standard Template',
            caseId: '#5521-GARCIA-MED',
            date: 'Oct 22, 2023, 09:12 AM',
            status: 'ready',
            statusLabel: 'Ready',
            statusColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header & Main CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Report Generation Center</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                        Select a standardized template to begin your medical-legal analysis or create a custom structured report.
                    </p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-[#0891b2] hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-[#0891b2]/20 hover:shadow-[#0891b2]/40 group">
                    <span className="material-icons transition-transform group-hover:rotate-12">dashboard_customize</span>
                    Custom Report Builder
                </button>
            </div>

            {/* Report Templates Grid */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="material-icons text-[#0891b2]">description</span>
                        Standard Report Templates
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="group bg-white dark:bg-[#0891b2]/5 border border-slate-200 dark:border-[#0891b2]/10 rounded-xl p-5 hover:border-[#0891b2]/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <div className={`w-12 h-12 rounded-lg bg-[#0891b2]/10 ${template.color} flex items-center justify-center mb-4 group-hover:bg-[#0891b2] group-hover:text-white transition-colors`}>
                                <span className="material-icons">{template.icon}</span>
                            </div>
                            <h3 className="font-bold mb-2 group-hover:text-[#0891b2] transition-colors">{template.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{template.description}</p>
                            <button className="w-full py-2 text-sm font-medium border border-[#0891b2]/20 rounded-lg hover:bg-[#0891b2]/10 transition-colors flex items-center justify-center gap-1">
                                Start New <span className="material-icons text-sm">chevron_right</span>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recently Generated Reports */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="material-icons text-[#0891b2]">history</span>
                        Recently Generated Reports
                    </h2>
                    <button className="text-[#0891b2] text-sm font-semibold hover:underline">View All Archive</button>
                </div>
                <div className="bg-white dark:bg-[#0891b2]/5 border border-slate-200 dark:border-[#0891b2]/10 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#0891b2]/10 border-b border-slate-200 dark:border-[#0891b2]/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Report Details</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Case ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Generated Date</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-[#0891b2]/10">
                            {recentReports.map((report) => (
                                <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-[#0891b2]/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="material-icons text-[#0891b2]">{report.icon}</span>
                                            <div>
                                                <div className="font-semibold text-sm">{report.title}</div>
                                                <div className="text-[10px] text-slate-500 uppercase font-medium">{report.template}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{report.caseId}</td>
                                    <td className="px-6 py-4 text-sm">{report.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.statusColor}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${report.status === 'ready' ? 'bg-green-500' : 'bg-amber-500'
                                                    }`}></span>
                                                {report.statusLabel}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`flex items-center justify-end gap-2 ${report.status === 'processing' ? 'opacity-50 pointer-events-none' : ''
                                            }`}>
                                            <button
                                                className="p-2 hover:bg-[#0891b2]/10 rounded-lg text-[#0891b2] transition-colors"
                                                title="Download PDF"
                                            >
                                                <span className="material-icons">download</span>
                                            </button>
                                            <button
                                                className="p-2 hover:bg-[#0891b2]/10 rounded-lg text-slate-400 transition-colors"
                                                title="Share Report"
                                            >
                                                <span className="material-icons">share</span>
                                            </button>
                                            <button
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                                                title="Archive"
                                            >
                                                <span className="material-icons">archive</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bg-slate-50 dark:bg-[#0891b2]/10 px-6 py-3 border-t border-slate-200 dark:border-[#0891b2]/10 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Showing 3 of 124 reports</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs border border-[#0891b2]/20 rounded hover:bg-[#0891b2]/10 transition-colors">
                                Previous
                            </button>
                            <button className="px-3 py-1 text-xs border border-[#0891b2]/20 rounded hover:bg-[#0891b2]/10 transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* HIPAA Compliance Footer */}
            <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-[#0891b2]/10 text-center">
                <div className="inline-flex flex-col items-center gap-2 mb-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-4">
                        <span className="material-icons text-3xl">verified</span>
                        <span className="material-icons text-3xl">security</span>
                        <span className="material-icons text-3xl">lock</span>
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest">
                        End-to-end Encrypted • AES-256 Bit Encryption • SOC 2 Type II Certified
                    </p>
                </div>
                <p className="text-xs text-slate-500">
                    © 2023 MedLegal Solutions. All medical records processed are handled in accordance with HIPAA data protection
                    standards.
                </p>
            </footer>

            {/* Floating Help Button */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-white dark:bg-[#0891b2] text-[#0891b2] dark:text-white rounded-full shadow-xl border border-[#0891b2]/20 flex items-center justify-center hover:scale-110 transition-transform z-40">
                <span className="material-icons">help_outline</span>
            </button>
        </div>
    );
};

export default ReportsPage;
