import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const CaseDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'records', label: 'Medical Records', icon: 'folder' },
        { id: 'timeline', label: 'Timeline', icon: 'timeline' },
        { id: 'analysis', label: 'Analysis', icon: 'analytics' },
        { id: 'damages', label: 'Damages', icon: 'assessment' },
        { id: 'tasks', label: 'Tasks', icon: 'assignment' },
        { id: 'billing', label: 'Billing', icon: 'payments' },
        { id: 'notes', label: 'Notes', icon: 'note' },
    ];

    return (
        <div>
            <header className="bg-white dark:bg-slate-900 border-b border-[#1f3b61]/10 -mx-8 -mt-8 mb-8 px-8 py-4">
                <nav className="flex text-xs text-[#1f3b61]/60 mb-2">
                    <Link to="/dashboard">Dashboard</Link>
                    <span className="material-icons text-xs mx-1">chevron_right</span>
                    <Link to="/cases">Cases</Link>
                    <span className="material-icons text-xs mx-1">chevron_right</span>
                    <span className="font-medium text-[#1f3b61]">{id}</span>
                </nav>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1f3b61] dark:text-white">Miller vs. City Hospital</h1>
                        <p className="text-sm text-slate-500 mt-1">Medical Malpractice • Created Oct 12, 2023</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border-2 border-[#1f3b61] text-[#1f3b61] rounded-lg font-medium hover:bg-[#1f3b61]/5">
                            Export Report
                        </button>
                        <button className="px-4 py-2 bg-[#0891b2] text-white rounded-lg font-medium hover:bg-teal-700">
                            Generate Timeline
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-[#1f3b61] text-[#1f3b61]'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            <span className="material-icons text-sm">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="py-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-bold mb-4">Case Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Case Number</p>
                                        <p className="text-sm font-semibold mt-1">#LNC-2023-104</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">Active</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Client</p>
                                        <p className="text-sm font-semibold mt-1">Johnathan Sterling</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Law Firm</p>
                                        <p className="text-sm font-semibold mt-1">Sterling & Associates</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-bold mb-4">Assigned Team</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#1f3b61]/10 flex items-center justify-center">
                                            <span className="material-icons text-[#1f3b61]">person</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">David Richardson</p>
                                            <p className="text-xs text-slate-500">Lead Attorney</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'records' && (
                    <div className="text-center py-12 text-slate-500">
                        Medical Records content will be displayed here
                    </div>
                )}
                {activeTab === 'timeline' && (
                    <div className="text-center py-12 text-slate-500">
                        Timeline content will be displayed here
                    </div>
                )}
                {activeTab === 'analysis' && (
                    <div className="text-center py-12 text-slate-500">
                        Case Analysis content will be displayed here
                    </div>
                )}
                {activeTab === 'damages' && (
                    <div className="text-center py-12 text-slate-500">
                        Damages tracking content will be displayed here
                    </div>
                )}
                {activeTab === 'tasks' && (
                    <div className="text-center py-12 text-slate-500">
                        Tasks content will be displayed here
                    </div>
                )}
                {activeTab === 'billing' && (
                    <div className="text-center py-12 text-slate-500">
                        Billing content will be displayed here
                    </div>
                )}
                {activeTab === 'notes' && (
                    <div className="text-center py-12 text-slate-500">
                        Notes content will be displayed here
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseDetail;
