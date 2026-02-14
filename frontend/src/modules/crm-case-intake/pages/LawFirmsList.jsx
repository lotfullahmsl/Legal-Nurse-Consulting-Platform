import { useState } from 'react';
import { Link } from 'react-router-dom';

const LawFirmsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const firms = [
        {
            id: 1,
            name: 'Sterling & Associates',
            location: 'Chicago, IL',
            contact: 'David Sterling',
            activeCases: 12,
            status: 'active',
            logo: 'https://via.placeholder.com/56',
            topColor: 'bg-[#1f3b61]'
        },
        {
            id: 2,
            name: 'Oakwood Legal Group',
            location: 'Boston, MA',
            contact: 'Sarah Miller',
            activeCases: 8,
            status: 'active',
            logo: 'https://via.placeholder.com/56',
            topColor: 'bg-[#1f3b61]/40'
        },
        {
            id: 3,
            name: 'Vanguard Law LLP',
            location: 'Austin, TX',
            contact: 'Michael Chen',
            activeCases: 2,
            status: 'on-hold',
            logo: 'https://via.placeholder.com/56',
            topColor: 'bg-slate-300 dark:bg-slate-700'
        },
        {
            id: 4,
            name: 'Pinnacle Injury Law',
            location: 'Denver, CO',
            contact: 'Elena Rodriguez',
            activeCases: 19,
            status: 'active',
            logo: 'https://via.placeholder.com/56',
            topColor: 'bg-[#1f3b61]'
        },
        {
            id: 5,
            name: 'Summit Medical Legal',
            location: 'Seattle, WA',
            contact: 'Robert Fox',
            activeCases: 14,
            status: 'active',
            logo: 'https://via.placeholder.com/56',
            topColor: 'bg-[#1f3b61]/70'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <nav className="flex text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                    <Link to="/dashboard" className="hover:text-[#1f3b61]">Directory</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 dark:text-slate-300">Partner Law Firms</span>
                </nav>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Partner Law Firms</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage 24 registered law firms and their active medical legal reviews.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center justify-center w-10 h-10 rounded-md ${viewMode === 'grid' ? 'bg-[#1f3b61]/10 text-[#1f3b61]' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <span className="material-icons">grid_view</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center justify-center w-10 h-10 rounded-md ${viewMode === 'list' ? 'bg-[#1f3b61]/10 text-[#1f3b61]' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <span className="material-icons">format_list_bulleted</span>
                            </button>
                        </div>
                        <button className="flex items-center px-5 py-2.5 bg-[#1f3b61] text-white font-semibold rounded-lg hover:bg-[#1f3b61]/90 transition-colors shadow-sm">
                            <span className="material-icons text-[20px] mr-2">add</span>
                            Add Law Firm
                        </button>
                    </div>
                </div>
            </header>

            {/* Filters & Search Bar */}
            <section className="mb-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center shadow-sm">
                    <div className="relative flex-grow w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-slate-400">search</span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-2 focus:ring-[#1f3b61] rounded-lg text-sm"
                            placeholder="Search by firm name, partner, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select className="bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg text-sm focus:ring-2 focus:ring-[#1f3b61] min-w-[140px]">
                            <option>Case Volume</option>
                            <option>High to Low</option>
                            <option>Low to High</option>
                        </select>
                        <select className="bg-slate-50 dark:bg-slate-800 border-transparent rounded-lg text-sm focus:ring-2 focus:ring-[#1f3b61] min-w-[140px]">
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>On Hold</option>
                        </select>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <span className="material-icons">filter_list</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Grid Layout */}
            <main className="pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {firms.map((firm) => (
                        <div
                            key={firm.id}
                            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#1f3b61]/30 transition-all"
                        >
                            <div className={`h-2 ${firm.topColor}`}></div>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <img
                                        src={firm.logo}
                                        alt="Firm Logo"
                                        className="w-14 h-14 rounded-lg object-cover border border-slate-100 dark:border-slate-800"
                                    />
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${firm.status === 'active'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                        }`}>
                                        {firm.status === 'on-hold' ? 'On Hold' : firm.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-[#1f3b61] transition-colors">
                                    {firm.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center">
                                    <span className="material-icons text-xs mr-1">location_on</span>
                                    {firm.location}
                                </p>
                                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Primary Contact</span>
                                        <span className="text-sm font-medium">{firm.contact}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Active Cases</span>
                                        <span className={`px-3 py-0.5 rounded-full text-sm font-bold ${firm.status === 'active'
                                                ? 'bg-[#1f3b61]/10 text-[#1f3b61]'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                            {firm.activeCases}
                                        </span>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg group-hover:bg-[#1f3b61] group-hover:text-white transition-all text-sm">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Firm Card */}
                    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm text-center flex flex-col items-center justify-center p-6 border-dashed border-2">
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-icons text-slate-400 text-3xl">add</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Firm</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
                            Expand your network and start collaborating on new cases.
                        </p>
                        <button className="px-6 py-2 bg-[#1f3b61]/10 text-[#1f3b61] hover:bg-[#1f3b61] hover:text-white font-bold rounded-lg transition-all text-sm">
                            New Registration
                        </button>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-12 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-bold text-slate-900 dark:text-white">1</span> to{' '}
                        <span className="font-bold text-slate-900 dark:text-white">5</span> of{' '}
                        <span className="font-bold text-slate-900 dark:text-white">24</span> firms
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-[#1f3b61] text-white rounded-lg text-sm font-medium">1</button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                            2
                        </button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                            3
                        </button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                            Next
                        </button>
                    </div>
                </div>
            </main>

            {/* HIPAA Compliance Footer */}
            <footer className="bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 py-6 -mx-8 -mb-8 px-8">
                <div className="flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                        <div className="flex items-center">
                            <span className="material-icons text-green-500 text-sm mr-1">verified_user</span>
                            <span>AES-256 Encryption Active</span>
                        </div>
                        <div className="flex items-center">
                            <span className="material-icons text-green-500 text-sm mr-1">security</span>
                            <span>HIPAA Compliant Environment</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 font-medium">
                        <a href="#" className="hover:text-[#1f3b61]">Privacy Policy</a>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <a href="#" className="hover:text-[#1f3b61]">Terms of Service</a>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <a href="#" className="hover:text-[#1f3b61]">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LawFirmsList;
