import { useState } from 'react';

const TasksPage = () => {
    const [filter, setFilter] = useState('all');

    const tasks = [
        {
            id: 1,
            title: 'Medical Chronology Review',
            description: 'Reviewing 400pg records from Mercy Hospital.',
            caseRef: 'Doe vs. Central Medical',
            priority: 'high',
            dueDate: 'Overdue (2d)',
            timeTracked: '04:22:15',
            isOverdue: true,
            isActive: false
        },
        {
            id: 2,
            title: 'Expert Witness Screening',
            description: 'Interviewing Dr. Smith regarding neurological trauma.',
            caseRef: 'Case #2024-88-RT',
            priority: 'medium',
            dueDate: 'Tomorrow',
            timeTracked: '01:10:00',
            isOverdue: false,
            isActive: false
        },
        {
            id: 3,
            title: 'Drafting Merit Opinion',
            description: 'Summary of deviations from standard of care.',
            caseRef: 'Estate of Miller v. Nursing Home',
            priority: 'high',
            dueDate: 'Today',
            timeTracked: '02:45:12',
            isOverdue: false,
            isActive: true
        },
        {
            id: 4,
            title: 'Billing Record Audit',
            description: 'Reconciling billed procedures vs recorded vitals.',
            caseRef: 'HealthFirst Claim #9921',
            priority: 'low',
            dueDate: 'Oct 24, 2023',
            timeTracked: '00:00:00',
            isOverdue: false,
            isActive: false
        }
    ];

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Dashboard Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Active Tasks</p>
                    <p className="text-2xl font-bold">14</p>
                </div>
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl border-l-4 border-l-red-500">
                    <p className="text-xs text-red-500 uppercase font-bold tracking-wider mb-1">Overdue</p>
                    <p className="text-2xl font-bold">03</p>
                </div>
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Billable Hours (Week)</p>
                    <p className="text-2xl font-bold text-[#0891b2]">32.4</p>
                </div>
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Pending Review</p>
                    <p className="text-2xl font-bold">05</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                    <button className="bg-[#0891b2] hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all">
                        <span className="material-icons text-sm">add</span> New Task
                    </button>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('today')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium ${filter === 'today' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setFilter('overdue')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium ${filter === 'overdue' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            Overdue
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-grow lg:w-72">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-[#0891b2]/50 focus:border-[#0891b2] outline-none transition-all"
                            placeholder="Search tasks or case IDs..."
                            type="text"
                        />
                    </div>
                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-icons">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Task Table */}
            <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                                <th className="py-4 px-6 w-12">
                                    <input
                                        className="rounded border-slate-300 dark:border-slate-700 text-[#0891b2] focus:ring-[#0891b2] bg-transparent"
                                        type="checkbox"
                                    />
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task Details</th>
                                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Case Reference</th>
                                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Tracked</th>
                                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {tasks.map((task) => (
                                <tr
                                    key={task.id}
                                    className={`group hover:bg-slate-50 dark:hover:bg-[#0891b2]/5 transition-colors cursor-pointer ${task.isActive ? 'bg-[#0891b2]/5 hover:bg-[#0891b2]/10 border-l-4 border-l-[#0891b2]' : ''
                                        }`}
                                >
                                    <td className="py-5 px-6">
                                        <input
                                            className="rounded border-slate-300 dark:border-slate-700 text-[#0891b2] focus:ring-[#0891b2] bg-transparent"
                                            type="checkbox"
                                        />
                                    </td>
                                    <td className="py-5 px-4">
                                        <p className={`text-sm font-semibold group-hover:text-[#0891b2] transition-colors ${task.isActive ? 'text-[#0891b2]' : ''
                                            }`}>
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">{task.description}</p>
                                    </td>
                                    <td className="py-5 px-4">
                                        <a className="inline-flex items-center gap-1.5 text-[#0891b2] text-xs font-medium hover:underline" href="#">
                                            <span className="material-icons text-xs">folder_open</span>
                                            {task.caseRef}
                                        </a>
                                    </td>
                                    <td className="py-5 px-4">
                                        <span
                                            className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tight ${task.priority === 'high'
                                                    ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                                    : task.priority === 'medium'
                                                        ? 'bg-blue-100 dark:bg-[#0891b2]/10 text-[#0891b2]'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                }`}
                                        >
                                            {task.priority === 'high' ? 'High Priority' : task.priority === 'medium' ? 'Medium' : 'Low'}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`material-icons text-sm ${task.isOverdue ? 'text-red-500' : task.isActive ? 'text-[#0891b2]' : 'text-slate-400'}`}>
                                                {task.isOverdue ? 'event_busy' : 'event'}
                                            </span>
                                            <span className={`text-xs ${task.isOverdue ? 'text-red-500 font-medium' : task.isActive ? 'font-medium' : ''}`}>
                                                {task.dueDate}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-mono ${task.isActive ? 'text-[#0891b2] font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {task.timeTracked}
                                            </span>
                                            <button
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${task.isActive
                                                        ? 'bg-slate-900 ring-2 ring-[#0891b2] ring-offset-2 dark:ring-offset-[#14181e]'
                                                        : task.timeTracked === '00:00:00'
                                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#0891b2]'
                                                            : 'bg-[#0891b2] shadow-lg shadow-[#0891b2]/20'
                                                    }`}
                                            >
                                                <span className="material-icons text-sm">{task.isActive ? 'pause' : 'play_arrow'}</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <span className="material-icons text-lg">more_horiz</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing 1-4 of 14 tasks</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30" disabled>
                            <span className="material-icons text-sm">chevron_left</span>
                        </button>
                        <button className="p-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-white dark:hover:bg-slate-800">
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* HIPAA Compliance Footer Badge */}
            <div className="fixed bottom-4 left-6 bg-slate-900 text-[10px] text-emerald-400 px-3 py-1.5 rounded-full flex items-center gap-2 border border-emerald-500/30 backdrop-blur-md shadow-xl z-50">
                <span className="material-icons text-[12px]">security</span>
                HIPAA COMPLIANT ENVIRONMENT
            </div>
        </div>
    );
};

export default TasksPage;
