import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import notificationService from '../../services/notification.service';

const ClientNavbar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        fetchUserData();
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Close dropdowns when clicking outside
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUserData = async () => {
        try {
            const storedUser = authService.getUser();
            if (storedUser) {
                setUser(storedUser);
            } else {
                const response = await authService.getCurrentUser();
                if (response.success) {
                    setUser(response.data.user);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const [countResponse, notificationsResponse] = await Promise.all([
                notificationService.getUnreadCount(),
                notificationService.getNotifications({ limit: 5, unread: true })
            ]);

            if (countResponse.success) {
                setNotificationCount(countResponse.data.count || 0);
            }

            if (notificationsResponse.success) {
                setNotifications(notificationsResponse.data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            await notificationService.markAsRead(notification._id);
            setNotificationCount(prev => Math.max(0, prev - 1));
            setShowNotifications(false);

            // Navigate based on notification type
            if (notification.link) {
                navigate(notification.link);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotificationCount(0);
            setNotifications([]);
            setShowNotifications(false);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const getUserDisplayName = () => {
        if (!user) return 'Client';
        return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
    };

    const getProfileImage = () => {
        return user?.profileImage || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(getUserDisplayName());
    };

    return (
        <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 z-40">
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <span className="material-icons text-slate-600 dark:text-slate-400">menu</span>
                </button>

                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                    Client Portal
                </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden sm:flex items-center gap-1.5 bg-green-100 dark:bg-green-900/20 px-2 md:px-3 py-1 rounded-full">
                    <span className="material-icons text-green-600 dark:text-green-400 text-xs">shield</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                        <span className="hidden md:inline">Secure Connection</span>
                        <span className="md:hidden">Secure</span>
                    </span>
                </div>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationRef}>
                    <button
                        className="relative cursor-pointer"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <span className="material-icons text-slate-600 dark:text-slate-400 hover:text-[#0891b2]">notifications</span>
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                                {notificationCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-[#0891b2] hover:underline"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-slate-500 text-sm">
                                        No new notifications
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                                        >
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        navigate('/client/updates');
                                    }}
                                    className="text-xs text-[#0891b2] hover:underline w-full text-center"
                                >
                                    View all updates
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 relative" ref={profileRef}>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{getUserDisplayName()}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Client</p>
                    </div>
                    <img
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#0891b2]/30 cursor-pointer"
                        src={getProfileImage()}
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    />

                    {showProfileMenu && (
                        <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <button
                                onClick={() => {
                                    setShowProfileMenu(false);
                                    navigate('/client/profile');
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                                <span className="material-icons text-sm">person</span>
                                My Profile
                            </button>
                            <button
                                onClick={() => {
                                    setShowProfileMenu(false);
                                    navigate('/client/settings');
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                                <span className="material-icons text-sm">settings</span>
                                Settings
                            </button>
                            <div className="border-t border-slate-200 dark:border-slate-700"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                                <span className="material-icons text-sm">logout</span>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ClientNavbar;
