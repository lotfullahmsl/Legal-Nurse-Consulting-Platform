import { useState } from 'react';

const MedlineAccess = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('pubmed');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setResults([
                {
                    id: 1,
                    title: 'Medical Malpractice in Emergency Care Settings',
                    authors: 'Smith J, Johnson K, Williams R',
                    journal: 'Journal of Emergency Medicine',
                    year: '2024',
                    abstract: 'This study examines common patterns in medical malpractice cases within emergency care settings...'
                },
                {
                    id: 2,
                    title: 'Standards of Care in Nursing Practice',
                    authors: 'Davis M, Brown L',
                    journal: 'Nursing Standards Review',
                    year: '2023',
                    abstract: 'A comprehensive review of nursing standards of care and their application in legal contexts...'
                }
            ]);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Medline Access</h1>
                <p className="text-slate-500">Search medical literature and research databases</p>
            </div>

            {/* Search Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
                <form onSubmit={handleSearch}>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">Search Database</label>
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                            >
                                <option value="pubmed">PubMed</option>
                                <option value="medline">MEDLINE</option>
                                <option value="cochrane">Cochrane Library</option>
                                <option value="cinahl">CINAHL</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative">
                        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search medical literature, standards of care, clinical guidelines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-[#0891b2] hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="material-icons animate-spin">refresh</span>
                                Searching...
                            </>
                        ) : (
                            <>
                                <span className="material-icons">search</span>
                                Search
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Quick Access Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-icons text-blue-600">library_books</span>
                        </div>
                        <h3 className="font-semibold">PubMed Central</h3>
                    </div>
                    <p className="text-sm text-slate-500">Access free full-text articles</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="material-icons text-green-600">fact_check</span>
                        </div>
                        <h3 className="font-semibold">Clinical Guidelines</h3>
                    </div>
                    <p className="text-sm text-slate-500">Evidence-based practice guidelines</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-icons text-purple-600">bookmark</span>
                        </div>
                        <h3 className="font-semibold">Saved Searches</h3>
                    </div>
                    <p className="text-sm text-slate-500">Your bookmarked articles</p>
                </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-bold">Search Results ({results.length})</h2>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {results.map((result) => (
                            <div key={result.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    {result.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {result.authors} • {result.journal} • {result.year}
                                </p>
                                <p className="text-sm text-slate-500 mb-4">{result.abstract}</p>
                                <div className="flex gap-3">
                                    <button className="text-sm text-[#0891b2] hover:underline flex items-center gap-1">
                                        <span className="material-icons text-sm">article</span>
                                        View Full Text
                                    </button>
                                    <button className="text-sm text-[#0891b2] hover:underline flex items-center gap-1">
                                        <span className="material-icons text-sm">bookmark_add</span>
                                        Save
                                    </button>
                                    <button className="text-sm text-[#0891b2] hover:underline flex items-center gap-1">
                                        <span className="material-icons text-sm">share</span>
                                        Export Citation
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {results.length === 0 && !loading && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
                    <span className="material-icons text-6xl text-slate-300 dark:text-slate-700 mb-4">search</span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Search Medical Literature
                    </h3>
                    <p className="text-slate-500">
                        Enter keywords to search across medical databases and journals
                    </p>
                </div>
            )}
        </div>
    );
};

export default MedlineAccess;
