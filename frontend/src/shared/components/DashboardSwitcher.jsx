import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const dashboards = [
        { name: 'Admin Dashboard', path: '/dashboard', icon: 'admin_panel_settings', color: 'blue' },
        { name: 'Staff Dashboard', path: '/staff-dashboard', icon: 'badge', color: 'green' },
        { name: 'Client Portal', path: '/client/dashboard', icon: 'person', color: 'purple' }
    ];

    const handleSwitch = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-[#2b6cee] to-[#0891b2] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-200 flex items-center gap-2"
                title="Switch Dashboard"
            >
                <span className="material-icons">swap_horiz</span>
                <span className="text-sm font-semibold hidden sm:inline">Switch View</span>
            </button>

            {/* Popup Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Menu */}
                    <div className="absolute bottom-20 right-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 w-72 animate-slideUp">
                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Switch Dashboard</h3>
                            <p className="text-xs text-slate-500">Choose which view to display</p>
                        </div>
                        <div className="space-y-2">
                            {dashboards.map((dashboard) => (
                                <button
                                    key={dashboard.path}
                                    onClick={() => handleSwitch(dashboard.path)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-${dashboard.color}-100 dark:bg-${dashboard.color}-900/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <span className={`material-icons text-${dashboard.color}-600 dark:text-${dashboard.color}-400`}>
                                            {dashboard.icon}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{dashboard.name}</p>
                                        <p className="text-xs text-slate-500">{dashboard.path}</p>
                                    </div>
                                    <span className="material-icons text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                        arrow_forward
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                            >
                                <span className="material-icons text-sm">logout</span>
                                Back to Login
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardSwitcher;
