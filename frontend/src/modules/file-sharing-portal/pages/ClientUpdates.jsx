import { useEffect, useState } from 'react';

const ClientUpdates = () => {
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        // Mock data
        setUpdates([
            {
                id: 1,
                type: 'document',
                title: 'New Document Uploaded',
                description: 'Medical Chronology Report has been uploaded to your case',
                caseNumber: 'ML-88291',
                timestamp: '2024-02-20T10:30:00',
                user: 'Dr. Elena Rodriguez',
                icon: 'description',
                color: 'blue'
            },
            {
                id: 2,
                type: 'message',
                title: 'New Message Received',
                description: 'You have a new message regarding your case timeline',
                caseNumber: 'ML-88291',
                timestamp: '2024-02-19T14:15:00',
                user: 'Sarah Nielsen, RN',
                icon: 'chat',
                color: 'green'
            },
            {
                id: 3,
                type: 'status',
                title: 'Case Status Updated',
                description: 'Your case has moved to "Medical Review" phase',
                caseNumber: 'ML-88291',
                timestamp: '2024-02-18T09:00:00',
                user: 'System',
                icon: 'update',
                color: 'purple'
            },
            {
                id: 4,
                type: 'report',
                title: 'Report Generated',
                description: 'Attorney Summary Report is now available for download',
                caseNumber: 'ML-88291',
                timestamp: '2024-02-15T16:45:00',
                user: 'Dr. Elena Rodriguez',
                icon: 'summarize',
                color: 'amber'
            },
            {
                id: 5,
                type: 'appointment',
                title: 'Upcoming Call Scheduled',
                description: 'Medical Review Strategy call scheduled for Thursday at 2:00 PM',
                caseNumber: 'ML-88291',
                timestamp: '2024-02-14T11:20:00',
                user: 'Sarah Nielsen, RN',
                icon: 'event',
                color: 'red'
            }
        ]);
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
            amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
            red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        };
        return colors[color] || colors.blue;
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / 1000); // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
        return time.toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Case Updates</h1>
                <p className="text-slate-600 dark:text-slate-400">Stay informed about all activities on your cases</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 mb-6 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-[#0891b2] text-white rounded-lg font-medium text-sm transition-colors">
                    All Updates
                </button>
                <button className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-sm transition-colors">
                    Documents
                </button>
                <button className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-sm transition-colors">
                    Messages
                </button>
                <button className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium text-sm transition-colors">
                    Status
                </button>
            </div>

            {/* Updates Timeline */}
            <div className="space-y-4">
                {updates.map((update) => (
                    <div key={update.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getColorClasses(update.color)}`}>
                                <span className="material-icons">{update.icon}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{update.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{update.description}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                        {getTimeAgo(update.timestamp)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="material-icons text-sm">folder</span>
                                        <span>{update.caseNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="material-icons text-sm">person</span>
                                        <span>{update.user}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
                <button className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Load More Updates
                </button>
            </div>

            {/* Notification Settings */}
            <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Notification Preferences</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Manage how you receive updates about your cases
                        </p>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked className="rounded text-[#0891b2] focus:ring-[#0891b2]" />
                                <span className="text-slate-700 dark:text-slate-300">Email notifications</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" defaultChecked className="rounded text-[#0891b2] focus:ring-[#0891b2]" />
                                <span className="text-slate-700 dark:text-slate-300">SMS notifications</span>
                            </label>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-[#0891b2] text-white rounded-lg font-medium text-sm hover:bg-[#0891b2]/90 transition-colors">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientUpdates;
