import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { icon: 'folder', label: 'Cases', path: '/cases' },
        { icon: 'people', label: 'Clients', path: '/clients' },
        { icon: 'assignment', label: 'Task Manager', path: '/tasks' },
        { icon: 'payments', label: 'Billing & Invoices', path: '/billing' },
        { icon: 'analytics', label: 'Reporting', path: '/reports' },
    ];

    const toolItems = [
        { icon: 'medical_services', label: 'Medline Access', path: '/medline' },
        { icon: 'settings', label: 'Portal Settings', path: '/settings' },
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
                        Internal Tools
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
            </nav>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 m-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-[#0891b2] text-sm">support_agent</span>
                    <span className="text-xs font-bold">Need Help?</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                    Contact portal technical support for HIPAA security inquiries.
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
