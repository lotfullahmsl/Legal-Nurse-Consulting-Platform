import { useEffect, useState } from 'react';
import analyticsService from '../services/analytics.service';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { icon: 'cases', label: 'Active Cases', value: '...', change: '', color: 'primary', positive: true },
        { icon: 'pending_actions', label: 'Pending Tasks', value: '...', badge: '', color: 'orange' },
        { icon: 'monetization_on', label: 'Monthly Revenue', value: '...', change: '', color: 'green', positive: true },
        { icon: 'person_add', label: 'New Clients', value: '...', badge: '', color: 'blue' },
    ]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [caseAnalytics, revenueAnalytics] = await Promise.all([
                analyticsService.getCaseAnalytics({ status: 'active' }),
                analyticsService.getRevenueAnalytics({ groupBy: 'month' })
            ]);

            const updatedStats = [
                {
                    icon: 'cases',
                    label: 'Active Cases',
                    value: caseAnalytics.data?.totalCases?.toString() || '0',
                    change: '+4.2%',
                    color: 'primary',
                    positive: true
                },
                {
                    icon: 'pending_actions',
                    label: 'Pending Tasks',
                    value: '24',
                    badge: 'High Priority',
                    color: 'orange'
                },
                {
                    icon: 'monetization_on',
                    label: 'Monthly Revenue',
                    value: `$${(revenueAnalytics.data?.totalRevenue?.paid || 0).toLocaleString()}`,
                    change: '+12.5%',
                    color: 'green',
                    positive: true
                },
                {
                    icon: 'person_add',
                    label: 'New Clients',
                    value: '8',
                    badge: 'New This Month',
                    color: 'blue'
                },
            ];

            setStats(updatedStats);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const recentCases = [
        { name: 'Miller vs. City Hospital', id: '#2023-MED-042', attorney: 'James P. Sterling', activity: '2h ago', status: 'IN REVIEW', statusColor: 'blue' },
        { name: 'Ramirez Malpractice', id: '#2023-MED-039', attorney: 'Elena Garcia', activity: 'Oct 21, 2023', status: 'DRAFTING', statusColor: 'yellow' },
        { name: 'Thompson - Ortho Review', id: '#2023-MED-015', attorney: 'Robert Vance', activity: 'Oct 20, 2023', status: 'COMPLETED', statusColor: 'green' },
        { name: 'Estate of G. Henderson', id: '#2023-MED-051', attorney: 'Sarah Jenkins', activity: 'Oct 19, 2023', status: 'ON HOLD', statusColor: 'slate' },
    ];

    const deadlines = [
        { date: { month: 'Oct', day: '24' }, title: 'Miller Case Medical Summary', subtitle: 'Urgent: Due in 24h', urgent: true },
        { date: { month: 'Oct', day: '26' }, title: 'Expert Testimony Brief', subtitle: 'Ramirez Malpractice Case' },
        { date: { month: 'Oct', day: '31' }, title: 'Monthly Billing Cycle', subtitle: 'Admin Task' },
        { date: { month: 'Nov', day: '02' }, title: 'Preliminary Case Screening', subtitle: 'For Smith & Partners' },
    ];

    const getStatColorClasses = (color) => {
        const colors = {
            primary: 'bg-[#1f3b61]/10 text-[#1f3b61]',
            orange: 'bg-orange-100 text-orange-600',
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
        };
        return colors[color] || colors.primary;
    };

    const getStatusClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
            green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
            slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
        };
        return colors[color] || colors.slate;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good morning, Sarah</h1>
                    <p className="text-slate-500 mt-1">Today is Monday, October 23, 2023. You have 4 high-priority tasks.</p>
                </div>
                <button className="bg-[#0891b2] hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all transform active:scale-95">
                    <span className="material-icons text-sm">add</span>
                    Create New Case
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatColorClasses(stat.color)}`}>
                                <span className="material-icons">{stat.icon}</span>
                            </div>
                            {stat.change && (
                                <span className={`text-xs font-bold flex items-center ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.change}
                                </span>
                            )}
                            {stat.badge && (
                                <span className={`text-xs font-bold flex items-center ${stat.color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`}>
                                    {stat.badge}
                                </span>
                            )}
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Cases Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-800 dark:text-white">Recent Cases</h2>
                        <button className="text-[#1f3b61] text-xs font-bold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase text-slate-400">
                                <tr>
                                    <th className="px-6 py-3 tracking-wider">Case Name / ID</th>
                                    <th className="px-6 py-3 tracking-wider">Attorney</th>
                                    <th className="px-6 py-3 tracking-wider">Last Activity</th>
                                    <th className="px-6 py-3 tracking-wider">Status</th>
                                    <th className="px-6 py-3 tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentCases.map((caseItem, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{caseItem.name}</p>
                                            <p className="text-xs text-slate-400">{caseItem.id}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{caseItem.attorney}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{caseItem.activity}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusClasses(caseItem.statusColor)}`}>
                                                {caseItem.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="material-icons text-slate-300 hover:text-slate-600 text-lg">more_vert</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Deadlines Widget */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="font-bold text-lg text-slate-800 dark:text-white">Upcoming Deadlines</h2>
                    </div>
                    <div className="flex-1 p-6 space-y-5">
                        {deadlines.map((deadline, index) => (
                            <div key={index} className={`flex gap-4 items-start border-l-2 ${deadline.urgent ? 'border-red-500' : 'border-[#1f3b61]'} pl-4 py-1`}>
                                <div className={`${deadline.urgent ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'} p-2 rounded text-center min-w-[50px]`}>
                                    <p className="text-[10px] font-bold uppercase">{deadline.date.month}</p>
                                    <p className="text-lg font-bold leading-none">{deadline.date.day}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{deadline.title}</p>
                                    <p className={`text-xs mt-0.5 ${deadline.urgent ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                                        {deadline.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors">
                            View Full Calendar
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer / Status Bar */}
            <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-medium">
                <p>© 2023 Legal Nurse Portal. All rights reserved. Version 2.4.0-Stable</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a className="hover:text-[#1f3b61]" href="#">HIPAA Policy</a>
                    <a className="hover:text-[#1f3b61]" href="#">Terms of Service</a>
                    <a className="hover:text-[#1f3b61]" href="#">Security Audit Logs</a>
                    <div className="flex items-center gap-1.5 text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span>All Systems Operational</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
