import { useState } from 'react';
import searchService from '../../../services/search.service';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        caseId: '',
        documentType: '',
        dateFrom: '',
        dateTo: ''
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const response = await searchService.searchRecords({
                query: searchQuery,
                ...filters
            });
            setResults(response.data.records || []);
        } catch (error) {
            console.error('Search error:', error);
            alert('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const highlightText = (text, query) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ?
                <mark key={i} className="bg-yellow-200">{part}</mark> : part
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Record Search</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Search through OCR-processed medical documents
                </p>
            </header>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 mb-6">
                <div className="relative mb-4">
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl">search</span>
                    <input
                        type="text"
                        className="w-full pl-14 pr-4 py-4 bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0891b2]/50 outline-none text-lg"
                        placeholder="Search medical records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <select
                        className="bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm"
                        value={filters.documentType}
                        onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="medical-record">Medical Records</option>
                        <option value="lab-report">Lab Reports</option>
                        <option value="imaging">Imaging</option>
                    </select>
                    <input
                        type="date"
                        className="bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        placeholder="From Date"
                    />
                    <input
                        type="date"
                        className="bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        placeholder="To Date"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#0891b2] hover:bg-teal-700 text-white font-semibold rounded-lg px-6 py-2 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {/* Results */}
            <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Search Results ({results.length})
                </h2>

                {loading ? (
                    <div className="text-center py-12">
                        <span className="material-icons animate-spin text-4xl text-slate-400">refresh</span>
                        <p className="mt-2 text-slate-500">Searching...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <span className="material-icons text-6xl text-slate-300 mb-4">search_off</span>
                        <p>No results found. Try a different search query.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((result) => (
                            <div key={result._id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center">
                                        <span className="material-icons text-red-500 mr-3">picture_as_pdf</span>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {highlightText(result.fileName, searchQuery)}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {result.case?.caseNumber} • {result.documentType}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-[#0891b2] hover:underline text-sm font-medium">
                                        View Document
                                    </button>
                                </div>
                                {result.ocrText && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                                        {highlightText(result.ocrText.substring(0, 200), searchQuery)}...
                                    </p>
                                )}
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                    <span>Provider: {result.provider?.name || 'N/A'}</span>
                                    <span>•</span>
                                    <span>Pages: {result.pageCount}</span>
                                    <span>•</span>
                                    <span>Date: {new Date(result.recordDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
