import { Link, useLocation, useNavigate } from 'react-router-dom';

const StaffSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any stored authentication data
        // localStorage.removeItem('token');
        // sessionStorage.clear();

        // Redirect to login page
        navigate('/login');
    };

    const menuItems = [
        { icon: 'dashboard', label: 'My Dashboard', path: '/staff-dashboard' },
        { icon: 'assignment', label: 'My Cases', path: '/staff/cases' },
        { icon: 'task_alt', label: 'My Tasks', path: '/staff/tasks' },
        { icon: 'description', label: 'Medical Records', path: '/staff/medical-records' },
        { icon: 'analytics', label: 'Case Analysis', path: '/staff/case-analysis' },
        { icon: 'attach_money', label: 'Damages Tracking', path: '/staff/damages' },
        { icon: 'notes', label: 'Notes', path: '/staff/notes' },
        { icon: 'timeline', label: 'Timeline Work', path: '/timeline-work' },
        { icon: 'schedule', label: 'Time Tracking', path: '/staff/billing' },
    ];

    const toolItems = [
        { icon: 'search', label: 'Medical Search', path: '/staff/search' },
        { icon: 'settings', label: 'My Settings', path: '/staff/settings' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex-1 py-6 px-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${location.pathname === item.path
                            ? 'text-[#1f3b61] bg-[#1f3b61]/5 font-semibold'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <span className="material-icons">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                        Tools
                    </p>
                    {toolItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-icons">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                    >
                        <span className="material-icons">logout</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </nav>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 m-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-[#0891b2] text-sm">support_agent</span>
                    <span className="text-xs font-bold">Need Help?</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                    Contact your supervisor or technical support for assistance.
                </p>
            </div>
        </aside>
    );
};

export default StaffSidebar;
