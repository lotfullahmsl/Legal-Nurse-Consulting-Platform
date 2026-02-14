import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ClientBilling = () => {
    const { caseId } = useParams();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            // API call would go here
            // const data = await invoiceService.getClientInvoices(caseId);
            // setInvoices(data);

            // Mock data for now
            setInvoices([
                {
                    id: 'INV-2024-001',
                    caseNumber: 'ML-88291',
                    caseName: 'Miller vs. Sterling Medical',
                    issueDate: '2024-01-15',
                    dueDate: '2024-02-15',
                    amount: 4250.00,
                    amountPaid: 4250.00,
                    status: 'paid',
                    items: [
                        { description: 'Medical Record Review - 15 hours', amount: 2250.00 },
                        { description: 'Timeline Creation', amount: 1500.00 },
                        { description: 'Expert Consultation', amount: 500.00 }
                    ]
                },
                {
                    id: 'INV-2024-002',
                    caseNumber: 'ML-88291',
                    caseName: 'Miller vs. Sterling Medical',
                    issueDate: '2024-02-15',
                    dueDate: '2024-03-15',
                    amount: 3800.00,
                    amountPaid: 0,
                    status: 'pending',
                    items: [
                        { description: 'Case Analysis - 12 hours', amount: 1800.00 },
                        { description: 'Report Generation', amount: 2000.00 }
                    ]
                }
            ]);
        } catch (error) {
            console.error('Failed to load invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
            overdue: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        };
        return badges[status] || badges.pending;
    };

    const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalOutstanding = totalBilled - totalPaid;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Billing & Invoices</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">View and manage your case invoices</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                            <span className="material-icons text-sm">lock</span>
                            SECURE
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Billed</span>
                            <span className="material-icons text-[#0891b2]">receipt_long</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalBilled.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Paid</span>
                            <span className="material-icons text-green-500">check_circle</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Outstanding</span>
                            <span className="material-icons text-amber-500">pending</span>
                        </div>
                        <p className="text-3xl font-bold text-amber-600">${totalOutstanding.toLocaleString()}</p>
                    </div>
                </div>

                {/* Invoices List */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-icons text-[#0891b2]">description</span>
                            Invoice History
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading invoices...</div>
                    ) : invoices.length > 0 ? (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{invoice.id}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusBadge(invoice.status)}`}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.caseName}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Issued: {new Date(invoice.issueDate).toLocaleDateString()} •
                                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">${invoice.amount.toLocaleString()}</p>
                                            {invoice.amountPaid > 0 && (
                                                <p className="text-sm text-green-600">Paid: ${invoice.amountPaid.toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Invoice Items */}
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Invoice Items</h4>
                                        <div className="space-y-2">
                                            {invoice.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-slate-700 dark:text-slate-300">{item.description}</span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">${item.amount.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-[#0891b2] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#0891b2]/90 transition-colors flex items-center justify-center gap-2">
                                            <span className="material-icons text-lg">download</span>
                                            Download PDF
                                        </button>
                                        {invoice.status === 'pending' && (
                                            <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                                <span className="material-icons text-lg">payment</span>
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500">No invoices found</div>
                    )}
                </div>

                {/* Payment Methods */}
                <div className="mt-8 bg-[#0891b2]/5 border border-[#0891b2]/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <span className="material-icons text-[#0891b2] text-3xl">info</span>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Payment Information</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                We accept various payment methods including credit cards, ACH transfers, and checks.
                                All payments are processed securely through our encrypted payment gateway.
                            </p>
                            <p className="text-xs text-slate-500">
                                For questions about billing, please contact our billing department at billing@medlegal.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientBilling;
