import { useEffect, useState } from 'react';

const ClientTimeline = () => {
    const [timeline, setTimeline] = useState([]);
    const [selectedCase, setSelectedCase] = useState('ML-88291');

    useEffect(() => {
        fetchTimeline();
    }, [selectedCase]);

    const fetchTimeline = async () => {
        // Mock timeline data
        setTimeline([
            {
                date: '2024-06-14',
                time: '09:30 AM',
                category: 'Surgery',
                title: 'Orthopedic Surgery - Knee Replacement',
                description: 'Patient underwent total knee replacement surgery at Sterling Medical Center. Procedure performed by Dr. James Mitchell.',
                provider: 'Dr. James Mitchell, MD',
                location: 'Sterling Medical Center',
                citations: ['Hospital Record p.45-52', 'Operative Report']
            },
            {
                date: '2024-06-12',
                time: '02:15 PM',
                category: 'Admission',
                title: 'Hospital Admission - Pre-Op',
                description: 'Patient admitted for pre-operative assessment and preparation. Vital signs stable, labs within normal limits.',
                provider: 'Dr. Sarah Chen, MD',
                location: 'Sterling Medical Center',
                citations: ['Admission Notes p.12-15']
            },
            {
                date: '2024-05-20',
                time: '10:00 AM',
                category: 'Consultation',
                title: 'Orthopedic Consultation',
                description: 'Initial consultation for chronic knee pain. X-rays show severe osteoarthritis. Surgery recommended.',
                provider: 'Dr. James Mitchell, MD',
                location: 'Sterling Orthopedic Clinic',
                citations: ['Consultation Notes p.8-11', 'X-Ray Report']
            },
            {
                date: '2024-05-15',
                time: '03:30 PM',
                category: 'Lab',
                title: 'Pre-Surgical Laboratory Work',
                description: 'Complete blood count, metabolic panel, coagulation studies. All results within normal range.',
                provider: 'Sterling Medical Lab',
                location: 'Sterling Medical Center',
                citations: ['Lab Results p.5-7']
            }
        ]);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Surgery': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200',
            'Admission': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200',
            'Consultation': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200',
            'Lab': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200',
            'Medication': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200'
        };
        return colors[category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Surgery': 'medical_services',
            'Admission': 'local_hospital',
            'Consultation': 'person',
            'Lab': 'science',
            'Medication': 'medication'
        };
        return icons[category] || 'event';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Medical Timeline</h1>
                <p className="text-slate-600 dark:text-slate-400">Chronological view of medical events and treatments</p>
            </div>

            {/* Case Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Select Case
                        </label>
                        <select
                            value={selectedCase}
                            onChange={(e) => setSelectedCase(e.target.value)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0891b2] focus:border-transparent min-w-[300px]"
                        >
                            <option value="ML-88291">ML-88291 - Miller vs. Sterling Medical</option>
                            <option value="ML-88292">ML-88292 - Estate of J. Doe</option>
                        </select>
                    </div>
                    <button className="bg-[#0891b2] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#0891b2]/90 transition-colors">
                        <span className="material-icons">download</span>
                        Export Timeline
                    </button>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#0891b2]/20"></div>

                {/* Timeline Events */}
                <div className="space-y-8">
                    {timeline.map((event, index) => (
                        <div key={index} className="relative pl-20">
                            {/* Timeline Dot */}
                            <div className="absolute left-0 w-16 flex flex-col items-center">
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 border-4 border-[#0891b2] rounded-full flex items-center justify-center shadow-lg z-10">
                                    <span className="material-icons text-[#0891b2]">{getCategoryIcon(event.category)}</span>
                                </div>
                            </div>

                            {/* Event Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getCategoryColor(event.category)}`}>
                                                {event.category}
                                            </span>
                                            <span className="text-sm font-medium text-slate-500">
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-sm text-slate-400">{event.time}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                                    </div>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                    {event.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-icons text-[#0891b2] text-lg">person</span>
                                        <span className="text-slate-700 dark:text-slate-300">{event.provider}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-icons text-[#0891b2] text-lg">location_on</span>
                                        <span className="text-slate-700 dark:text-slate-300">{event.location}</span>
                                    </div>
                                </div>

                                {/* Citations */}
                                <div className="bg-[#0891b2]/5 border border-[#0891b2]/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-icons text-[#0891b2] text-sm">link</span>
                                        <span className="text-xs font-bold text-[#0891b2] uppercase">Source Citations</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {event.citations.map((citation, idx) => (
                                            <span key={idx} className="text-xs bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                                {citation}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-4">
                    <span className="material-icons text-[#0891b2] text-3xl">info</span>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">About This Timeline</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            This medical chronology has been carefully compiled by our legal nurse consultants from your medical records.
                            Each event is citation-linked to source documents for verification and court presentation.
                        </p>
                        <p className="text-xs text-slate-500">
                            Last updated: {new Date().toLocaleDateString()} • {timeline.length} events documented
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientTimeline;
