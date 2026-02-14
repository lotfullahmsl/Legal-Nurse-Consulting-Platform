import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import timelineService from '../../../services/timeline.service';

const TimelineWork = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Days Remaining');
    const [workItems, setWorkItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkQueue();
    }, []);

    const fetchWorkQueue = async () => {
        try {
            setLoading(true);
            const data = await timelineService.getWorkQueue();
            setWorkItems(data || []);
        } catch (error) {
            console.error('Failed to load work queue:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenTimeline = (caseId) => {
        navigate(`/timeline-builder/${caseId}`);
    };

    const stats = [
        { label: 'Active Chronologies', value: workItems.length.toString(), badge: '+2 this week', badgeColor: 'emerald' },
        { label: 'Average Progress', value: '64%', progress: 64 },
        { label: 'Next Deadline', value: '2 Days', valueColor: 'amber', badge: 'Case #8921' },
        { label: 'Pending Review', value: '4', icon: 'rate_review' }
    ];

    const getStatusColor = (color) => {
        const colors = {
            blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
            rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        };
        return colors[color] || colors.slate;
    };

    const getDueColor = (color) => {
        const colors = {
            amber: 'text-amber-500',
            rose: 'text-rose-500',
            slate: 'text-slate-900 dark:text-white'
        };
        return colors[color] || colors.slate;
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
            {/* Sidebar */}
            <aside className="w-20 bg-background-light dark:bg-neutral-dark border-r border-slate-200 dark:border-border-dark flex flex-col items-center py-6 gap-8">
                <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
                    <span className="material-icons text-white text-3xl">history_edu</span>
                </div>
                <nav className="flex flex-col gap-6">
                    <a className="group relative flex items-center justify-center p-3 bg-primary/10 text-primary rounded-xl transition-all duration-200" href="#">
                        <span className="material-icons">view_list</span>
                        <span className="absolute left-16 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            My Queue
                        </span>
                    </a>
                    <a className="group relative flex items-center justify-center p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark rounded-xl transition-all duration-200" href="#">
                        <span className="material-icons">task_alt</span>
                        <span className="absolute left-16 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Completed
                        </span>
                    </a>
                    <a className="group relative flex items-center justify-center p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark rounded-xl transition-all duration-200" href="#">
                        <span className="material-icons">analytics</span>
                        <span className="absolute left-16 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Analytics
                        </span>
                    </a>
                    <div className="h-px w-8 bg-slate-200 dark:bg-border-dark"></div>
                    <a className="group relative flex items-center justify-center p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-border-dark rounded-xl transition-all duration-200" href="#">
                        <span className="material-icons">contact_support</span>
                        <span className="absolute left-16 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Support
                        </span>
                    </a>
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Navigation / Security Header */}
                <header className="h-16 flex items-center justify-between px-8 bg-white/5 dark:bg-background-dark/50 border-b border-slate-200 dark:border-border-dark backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold tracking-tight">Timeline Work Queue</h1>
                        <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
                            <span className="material-icons text-[14px]">lock</span>
                            HIPAA Compliant Session
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-neutral-dark border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
                                placeholder="Search Case ID or Initials..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="material-icons text-lg">notifications</span>
                            <div className="w-2 h-2 bg-primary rounded-full -ml-3 -mt-2"></div>
                        </div>
                    </div>
                </header>

                {/* Stats & Controls */}
                <section className="p-8 pb-4">
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-neutral-dark p-4 rounded-xl border border-slate-200 dark:border-border-dark">
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                                <div className="flex items-end justify-between mt-1">
                                    <span className={`text-2xl font-bold ${stat.valueColor === 'amber' ? 'text-amber-500' : ''}`}>{stat.value}</span>
                                    {stat.badge && (
                                        <span className={`${stat.badgeColor === 'emerald' ? 'text-emerald-500' : 'text-slate-400'} text-xs font-medium`}>
                                            {stat.badge}
                                        </span>
                                    )}
                                    {stat.progress !== undefined && (
                                        <div className="w-16 bg-slate-200 dark:bg-border-dark h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full" style={{ width: `${stat.progress}%` }}></div>
                                        </div>
                                    )}
                                    {stat.icon && (
                                        <span className="material-icons text-slate-500">{stat.icon}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                                <span className="material-icons text-sm">add</span>
                                New Chronology
                            </button>
                            <button className="px-4 py-2 bg-slate-100 dark:bg-neutral-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-border-dark transition-colors flex items-center gap-2">
                                <span className="material-icons text-sm">filter_list</span>
                                Filters
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 uppercase font-medium">Sort by:</span>
                            <select
                                className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 pr-6 text-primary cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option>Days Remaining</option>
                                <option>Completion %</option>
                                <option>Date Assigned</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Work List */}
                <section className="flex-1 overflow-y-auto px-8 pb-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-4 text-slate-500">Loading work queue...</p>
                            </div>
                        </div>
                    ) : workItems.length > 0 ? (
                        <div className="flex-1 gap-3">
                            {workItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`group bg-white dark:bg-neutral-dark border border-slate-200 dark:border-border-dark p-4 rounded-xl hover:border-primary/50 transition-all duration-200 ${item.status === 'On Hold' ? 'opacity-80' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                <span className="material-icons">{item.icon}</span>
                                            </div>
                                            <div className="min-w-[200px]">
                                                <h3 className="font-bold text-slate-900 dark:text-white">Case ID: {item.id}</h3>
                                                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                                    <span className="font-semibold text-slate-500">Patient: {item.patient}</span>
                                                    <span>•</span>
                                                    <span>{item.type}</span>
                                                </p>
                                            </div>
                                            <div className="hidden xl:block min-w-[150px]">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Attorney Firm</p>
                                                <p className="text-sm font-medium">{item.firm}</p>
                                            </div>
                                            <div className="flex-1 max-w-xs mx-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Chronology Progress</span>
                                                    <span className="text-xs font-bold text-primary">{item.progress}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 dark:bg-border-dark rounded-full overflow-hidden">
                                                    <div
                                                        className={`bg-primary h-full rounded-full ${item.status === 'On Hold' ? 'opacity-50' : ''}`}
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="px-6 text-center">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Due In</p>
                                                <p className={`text-sm font-bold ${getDueColor(item.dueColor)}`}>{item.dueIn}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(item.statusColor)}`}>
                                                {item.status}
                                            </span>
                                            <button onClick={() => handleOpenTimeline(item.case)} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-transform active:scale-95">
                                                <span className="material-icons text-sm">construction</span>
                                                Open Timeline Builder
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            No timeline work items in queue
                        </div>
                    )}
                </section>

                {/* Footer / Workspace Info */}
                <footer className="h-10 bg-white/5 border-t border-slate-200 dark:border-border-dark flex items-center justify-between px-8">
                    <div className="flex items-center gap-4 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                        <span>© 2024 LegalNurse OS</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span>Active Workspace: General Medical Queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-slate-400 font-medium">Secure Server Connection: Active</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default TimelineWork;
