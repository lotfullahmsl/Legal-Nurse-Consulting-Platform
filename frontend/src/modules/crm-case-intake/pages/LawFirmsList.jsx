import { useEffect, useState } from 'react';
import lawFirmService from '../../../services/lawFirm.service';

const LawFirmsList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [firms, setFirms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => {
        fetchFirms();
    }, [searchTerm, pagination.page]);

    const fetchFirms = async () => {
        try {
            setLoading(true);
            const params = {
                search: searchTerm || undefined,
                page: pagination.page,
                limit: 12
            };
            const response = await lawFirmService.getAllLawFirms(params);
            setFirms(response.data.lawFirms || []);
            setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
        } catch (error) {
            console.error('Error fetching firms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this law firm?')) {
            try {
                await lawFirmService.deleteLawFirm(id);
                alert('Law firm deleted');
                fetchFirms();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Partner Law Firms</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage {pagination.total} registered law firms
                        </p>
                    </div>
                    <button className="flex items-center px-5 py-2.5 bg-[#1f3b61] text-white font-semibold rounded-lg hover:bg-[#1f3b61]/90 transition-colors shadow-sm">
                        <span className="material-icons text-[20px] mr-2">add</span>
                        Add Law Firm
                    </button>
                </div>
            </header>

            {/* Search */}
            <section className="mb-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons text-slate-400">search</span>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-transparent focus:ring-2 focus:ring-[#1f3b61] rounded-lg text-sm"
                            placeholder="Search by firm name, partner, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Grid */}
            <main className="pb-20">
                {loading ? (
                    <div className="text-center py-12">
                        <span className="material-icons animate-spin text-4xl">refresh</span>
                        <p className="mt-2 text-slate-500">Loading...</p>
                    </div>
                ) : firms.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No law firms found</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {firms.map((firm) => (
                            <div key={firm._id} className="group bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="h-2 bg-[#1f3b61]"></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <span className="material-icons text-[#1f3b61]">business</span>
                                        </div>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${firm.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {firm.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-[#1f3b61] transition-colors">
                                        {firm.firmName}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4 flex items-center">
                                        <span className="material-icons text-xs mr-1">location_on</span>
                                        {firm.address?.city || 'N/A'}, {firm.address?.state || ''}
                                    </p>
                                    <div className="space-y-3 pt-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 uppercase font-semibold">Contact</span>
                                            <span className="text-sm font-medium">{firm.contactPerson}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 uppercase font-semibold">Email</span>
                                            <span className="text-xs text-slate-600">{firm.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 py-2 bg-slate-50 text-slate-700 font-semibold rounded-lg hover:bg-[#1f3b61] hover:text-white transition-all text-sm">
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(firm._id)}
                                            className="px-3 py-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all">
                                            <span className="material-icons text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-12 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Showing {firms.length} of {pagination.total} firms
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-[#1f3b61] text-white rounded-lg text-sm font-medium">{pagination.page}</button>
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                            disabled={pagination.page >= pagination.pages}
                            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LawFirmsList;
