import { useEffect, useState } from 'react';
import analyticsService from '../services/analytics.service';
import deadlineService from '../services/deadline.service';
import taskService from '../services/task.service';

const StaffDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    const [workloadAnalytics, setWorkloadAnalytics] = useState(null);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [tasksData, statsData, deadlinesData, workloadData] = await Promise.all([
                taskService.getMyTasks({ limit: 5 }),
                taskService.getTaskStats(),
                deadlineService.getUpcomingDeadlines(7),
                analyticsService.getWorkloadAnalytics({})
            ]);
            setTasks(tasksData || []);
            setStats(statsData || {});
            setDeadlines(deadlinesData || []);
            setWorkloadAnalytics(workloadData.data || null);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateTaskStatus(taskId, newStatus);
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Welcome Header & Stats */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Good Morning, Sarah</h1>
                    <p className="text-slate-500 mt-1">You have {stats.pendingTasks || 0} tasks pending for this week.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <span className="material-icons text-emerald-600">timer</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Time Tracked Today</p>
                            <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">05:42:15</p>
                        </div>
                    </div>
                    <button className="bg-[#1152d4]/10 hover:bg-[#1152d4]/20 text-[#1152d4] p-2 rounded-lg transition-colors">
                        <span className="material-icons">pause_circle</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column: Assigned Cases */}
                <section className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <span className="material-icons text-[#1152d4]">assignment</span>
                            My Assigned Cases
                        </h2>
                        <button className="text-[#1152d4] text-sm font-semibold hover:underline">View All Cases</button>
                    </div>

                    {/* Case Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Case Card 1 */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase mb-2">
                                        Case #2024-8812
                                    </span>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#1152d4] transition-colors">
                                        Harrison vs. City Hospital
                                    </h3>
                                </div>
                                <span className="material-icons text-slate-300 group-hover:text-[#1152d4] transition-colors cursor-pointer">
                                    more_horiz
                                </span>
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-icons text-xs">gavel</span>
                                    <span>Lead: Miller & Associates</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-icons text-xs">event</span>
                                    <span>Hearing: Oct 15, 2024</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span className="text-xs font-medium text-slate-500">Medical Review In-Progress</span>
                                </div>
                            </div>
                        </div>

                        {/* Case Card 2 */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase mb-2">
                                        Case #2024-7431
                                    </span>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#1152d4] transition-colors">
                                        Martinez Post-Op Review
                                    </h3>
                                </div>
                                <span className="material-icons text-slate-300 group-hover:text-[#1152d4] transition-colors cursor-pointer">
                                    more_horiz
                                </span>
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-icons text-xs">gavel</span>
                                    <span>Lead: Smith Legal Group</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-icons text-xs">event</span>
                                    <span>Deadline: Sept 30, 2024</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    <span className="text-xs font-medium text-slate-500">Chronology Building</span>
                                </div>
                            </div>
                        </div>

                        {/* Case Card 3 */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-bold uppercase mb-2">
                                        Case #2024-9002
                                    </span>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#1152d4] transition-colors">
                                        Davis Dialysis Center Inc.
                                    </h3>
                                </div>
                                <span className="material-icons text-slate-300 group-hover:text-[#1152d4] transition-colors cursor-pointer">
                                    more_horiz
                                </span>
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-icons text-xs">gavel</span>
                                    <span>Lead: Roberts & Co.</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-icons text-xs">event</span>
                                    <span>Trial: Jan 12, 2025</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                    <span className="text-xs font-medium text-slate-500">Awaiting Records</span>
                                </div>
                            </div>
                        </div>

                        {/* Add New Case Placeholder */}
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-[#1152d4] hover:text-[#1152d4] transition-all cursor-pointer">
                            <span className="material-icons text-3xl mb-2">add_circle_outline</span>
                            <span className="text-sm font-semibold">New Assignment Request</span>
                        </div>
                    </div>
                </section>

                {/* Right Column: Task List & Activity */}
                <aside className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Personal Task List Widget */}
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold flex items-center gap-2">
                                <span className="material-icons text-[#1152d4]">task_alt</span>
                                Task List
                            </h2>
                            <span className="bg-[#1152d4]/10 text-[#1152d4] text-[10px] font-bold px-2 py-1 rounded">
                                {(stats.pendingTasks || 0) + (stats.inProgressTasks || 0)} Remaining
                            </span>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-4 text-slate-500">Loading tasks...</div>
                            ) : tasks.length > 0 ? (
                                tasks.slice(0, 5).map((task) => (
                                    <div key={task._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={() => handleTaskStatusChange(task._id, task.status === 'completed' ? 'pending' : 'completed')}
                                            className="mt-1 rounded border-slate-300 text-[#1152d4] focus:ring-[#1152d4]"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {task.case?.caseNumber || 'No case'} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${task.priority === 'high' || task.priority === 'critical' ? 'bg-red-100 text-red-600' :
                                            task.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-500">No tasks assigned</div>
                            )}
                        </div>
                        <button className="w-full mt-6 py-2 border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            + Add New Task
                        </button>
                    </section>

                    {/* Upcoming Deadlines Widget */}
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold flex items-center gap-2">
                                <span className="material-icons text-red-500">event_busy</span>
                                Upcoming Deadlines
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-4 text-slate-500">Loading deadlines...</div>
                            ) : deadlines.length > 0 ? (
                                deadlines.slice(0, 5).map((deadline) => (
                                    <div key={deadline._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-2 border-red-500">
                                        <span className="material-icons text-red-500 text-sm mt-0.5">event</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{deadline.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {deadline.case?.caseNumber || 'No case'} • {new Date(deadline.deadlineDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${deadline.priority === 'critical' ? 'bg-red-100 text-red-600' :
                                            deadline.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {deadline.type}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-500">No upcoming deadlines</div>
                            )}
                        </div>
                    </section>

                    {/* HIPAA Notice */}
                    <div className="bg-[#1152d4]/5 rounded-xl p-4 border border-[#1152d4]/10">
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-[#1152d4]">security</span>
                            <div className="text-[10px]">
                                <p className="font-bold text-slate-800 dark:text-slate-200">HIPAA Protected Environment</p>
                                <p className="text-slate-500">All data is encrypted at rest and in transit.</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default StaffDashboard;
