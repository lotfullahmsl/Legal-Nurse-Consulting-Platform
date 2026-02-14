import { useEffect, useState } from 'react';
import billingService from '../../../services/billing.service';

const BillingPage = () => {
    const [activeTab, setActiveTab] = useState('time');
    const [timeEntries, setTimeEntries] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [timerRunning, setTimerRunning] = useState(false);
    const [activeCase, setActiveCase] = useState('Case #2023-884 - Miller vs. General Hospital');
    const [taskCategory, setTaskCategory] = useState('Medical Record Review');
    const [runningTime, setRunningTime] = useState('02:34:18');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'time') {
                const data = await billingService.getAllTimeEntries({ limit: 50 });
                setTimeEntries(data.entries || []);
            } else {
                const [invoiceData, statsData] = await Promise.all([
                    billingService.getAllInvoices({ limit: 20 }),
                    billingService.getBillingStats()
                ]);
                setInvoices(invoiceData.invoices || []);
                setStats(statsData || {});
            }
        } catch (error) {
            console.error('Failed to load billing data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTimer = async () => {
        try {
            await billingService.startTimer({
                case: 'CASE_ID',
                description: 'Working on case',
                billableRate: 150
            });
            setTimerRunning(true);
        } catch (error) {
            console.error('Failed to start timer:', error);
        }
    };

    const handleStopTimer = async () => {
        try {
            await billingService.stopTimer();
            setTimerRunning(false);
            fetchData();
        } catch (error) {
            console.error('Failed to stop timer:', error);
        }
    };

    // Mock data for UI display
    const mockTimeEntries = [
        {
            id: 1,
            date: 'May 18, 2024',
            consultant: 'Sarah Johnson, RN',
            matter: 'Case #2023-884',
            description: 'Medical record review and chronology',
            duration: '3.5h',
            billable: true
        },
        {
            id: 2,
            date: 'May 17, 2024',
            consultant: 'Michael Chen, LNC',
            matter: 'Case #2024-112',
            description: 'Expert consultation and report prep',
            duration: '2.0h',
            billable: true
        },
        {
            id: 3,
            date: 'May 17, 2024',
            consultant: 'Sarah Johnson, RN',
            matter: 'Case #2024-045',
            description: 'Client correspondence',
            duration: '0.5h',
            billable: false
        }
    ];

    const mockInvoices = [
        {
            id: 'INV-2024-0019',
            client: 'Thompson & Associates',
            amount: '$3,420.00',
            status: 'paid',
            statusLabel: 'Paid',
            statusColor: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            date: 'Paid on May 15'
        },
        {
            id: 'INV-2024-0015',
            client: 'Rivera Legal Group',
            amount: '$8,115.00',
            status: 'overdue',
            statusLabel: 'Overdue',
            statusColor: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
            date: 'Due: May 01',
            dateColor: 'text-red-500'
        },
        {
            id: 'INV-2024-0018',
            client: 'Johnson & Miller LLP',
            amount: '$1,250.00',
            status: 'draft',
            statusLabel: 'Draft',
            statusColor: 'bg-slate-100 dark:bg-slate-600/50 text-slate-600 dark:text-slate-300',
            date: 'Last updated 2h ago'
        }
    ];

    const displayTimeEntries = timeEntries.length > 0 ? timeEntries : mockTimeEntries;
    const displayInvoices = invoices.length > 0 ? invoices : mockInvoices;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1f3b61] dark:text-white">Billing & Time Tracking</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Track billable hours and manage client invoices securely.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition">
                            <span className="material-icons text-sm">download</span> Export CSV
                        </button>
                        <button className="bg-[#1f3b61] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-opacity-90 transition">
                            <span className="material-icons text-sm">add</span> Manual Entry
                        </button>
                    </div>
                </div>

                {/* Active Timer Widget */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-4">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Active Project / Case
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-[#1f3b61] focus:border-[#1f3b61]"
                                    value={activeCase}
                                    onChange={(e) => setActiveCase(e.target.value)}
                                >
                                    <option>Case #2023-884 - Miller vs. General Hospital</option>
                                    <option>Case #2024-112 - Estate of Thompson</option>
                                    <option>Case #2024-045 - Rivera Workers Comp</option>
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Task Category
                            </label>
                            <select
                                className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-[#1f3b61] focus:border-[#1f3b61]"
                                value={taskCategory}
                                onChange={(e) => setTaskCategory(e.target.value)}
                            >
                                <option>Medical Record Review</option>
                                <option>Deposition Preparation</option>
                                <option>Expert Testimony</option>
                                <option>Correspondence</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex flex-col items-center justify-center">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Running Time</span>
                            <div className="text-3xl font-mono font-bold text-[#1f3b61] dark:text-white tabular-nums">
                                {runningTime}
                            </div>
                        </div>
                        <div className="md:col-span-3 flex items-center gap-3">
                            {timerRunning ? (
                                <button
                                    onClick={handleStopTimer}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                                >
                                    <span className="material-icons">stop</span> Stop Timer
                                </button>
                            ) : (
                                <button
                                    onClick={handleStartTimer}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                                >
                                    <span className="material-icons">play_arrow</span> Start Timer
                                </button>
                            )}
                            <button className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition">
                                <span className="material-icons">more_vert</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Entries Table */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 dark:text-white">Recent Time Entries</h3>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                        search
                                    </span>
                                    <input
                                        className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-[#1f3b61] focus:border-[#1f3b61]"
                                        placeholder="Search entries..."
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                                        <th className="px-6 py-4">Date & Consultant</th>
                                        <th className="px-6 py-4">Matter / Description</th>
                                        <th className="px-6 py-4 text-center">Duration</th>
                                        <th className="px-6 py-4 text-center">Billable</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {displayTimeEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium">{entry.date}</div>
                                                <div className="text-xs text-slate-400">{entry.consultant}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold truncate max-w-[200px]">{entry.matter}</div>
                                                <div className="text-xs text-slate-500">{entry.description}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-mono font-medium">{entry.duration}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <div
                                                        className={`w-10 h-5 rounded-full relative cursor-pointer ${entry.billable ? 'bg-[#1f3b61]/20' : 'bg-slate-200 dark:bg-slate-600'
                                                            }`}
                                                    >
                                                        <div
                                                            className={`absolute top-0.5 w-4 h-4 rounded-full shadow-sm ${entry.billable
                                                                ? 'right-0.5 bg-[#1f3b61]'
                                                                : 'left-0.5 bg-white'
                                                                }`}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-[#1f3b61] transition">
                                                    <span className="material-icons text-xl">edit</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                            <button className="text-sm font-semibold text-[#1f3b61] dark:text-slate-300 hover:underline">
                                Load More Entries
                            </button>
                        </div>
                    </div>
                </div>

                {/* Financial Summary & Invoices */}
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="bg-[#1f3b61] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wider">Unbilled Amount</h4>
                            <div className="text-3xl font-bold mb-4">$14,240.50</div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="text-xs text-white/60 mb-1">Billable Hours</div>
                                    <div className="text-lg font-semibold">48.2h</div>
                                </div>
                                <div className="w-px h-8 bg-white/20"></div>
                                <div>
                                    <div className="text-xs text-white/60 mb-1">Current Rate (Avg)</div>
                                    <div className="text-lg font-semibold">$295/hr</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <span className="material-icons text-8xl">account_balance_wallet</span>
                        </div>
                    </div>

                    {/* Invoice Management */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 dark:text-white">Recent Invoices</h3>
                            <button className="text-[#1f3b61] dark:text-slate-300">
                                <span className="material-icons">add_circle_outline</span>
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {displayInvoices.map((invoice) => (
                                <div key={invoice.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-sm font-bold">{invoice.id}</div>
                                            <div className="text-xs text-slate-500">{invoice.client}</div>
                                        </div>
                                        <div className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${invoice.statusColor}`}>
                                            {invoice.statusLabel}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className={`text-xs italic ${invoice.dateColor || 'text-slate-400'}`}>{invoice.date}</div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-white">{invoice.amount}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 text-center">
                            <a
                                className="text-xs font-bold text-[#1f3b61] dark:text-slate-400 uppercase tracking-wide hover:underline"
                                href="#"
                            >
                                View All Invoices
                            </a>
                        </div>
                    </div>

                    {/* HIPAA Notice */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl p-4 flex gap-3">
                        <span className="material-icons text-amber-600 dark:text-amber-400">gpp_good</span>
                        <div>
                            <h5 className="text-sm font-bold text-amber-800 dark:text-amber-200">HIPAA Protected Environment</h5>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                                Ensure all PHI is entered only in designated secure fields. Activity descriptions are encrypted at rest.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action for Mobile */}
            <div className="lg:hidden fixed bottom-6 right-6">
                <button className="w-14 h-14 bg-[#1f3b61] text-white rounded-full shadow-xl flex items-center justify-center">
                    <span className="material-icons">timer</span>
                </button>
            </div>
        </div>
    );
};

export default BillingPage;
