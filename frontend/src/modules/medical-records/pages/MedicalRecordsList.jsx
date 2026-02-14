import { useEffect, useState } from 'react';
import medicalRecordService from '../../../services/medicalRecord.service';

const MedicalRecordsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, ocrPending: 0 });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => {
        fetchRecords();
        fetchStats();
    }, [filterType, searchQuery, pagination.page]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const params = {
                documentType: filterType !== 'all' ? filterType : undefined,
                search: searchQuery || undefined,
                page: pagination.page,
                limit: 20
            };
            const response = await medicalRecordService.getAllRecords(params);
            setRecords(response.data.records || []);
            setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await medicalRecordService.getStats();
            setStats(response.data || { total: 0, ocrPending: 0 });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await medicalRecordService.deleteRecord(id);
                alert('Record deleted successfully');
                fetchRecords();
            } catch (error) {
                alert('Failed to delete record');
            }
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Records</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage and search medical documentation with OCR capabilities
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
                            <span className="material-icons text-sm mr-2">filter_list</span>
                            Filters
                        </button>
                        <button className="flex items-center px-5 py-2.5 bg-[#0891b2] hover:bg-teal-700 text-white rounded-lg shadow-lg transition-all text-sm font-semibold">
                            <span className="material-icons text-sm mr-2">upload_file</span>
                            Upload Records
                        </button>
                    </div>
                </div>
            </header>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 mb-6 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0891b2]/50 outline-none text-sm"
                        placeholder="Search by filename, case, or provider..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="bg-slate-50 dark:bg-[#14181e] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0891b2]/50 outline-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="all">All Types</option>
                    <option value="medical-record">Medical Records</option>
                    <option value="lab-report">Lab Reports</option>
                    <option value="imaging">Imaging</option>
                    <option value="prescription">Prescriptions</option>
                    <option value="consultation">Consultations</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10">
                    <div className="flex items-center">
                        <div className="p-3 bg-[#0891b2]/10 rounded-lg text-[#0891b2] mr-4">
                            <span className="material-icons">folder</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Records</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10">
                    <div className="flex items-center">
                        <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 mr-4">
                            <span className="material-icons">pending</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">OCR Pending</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.ocrPending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-[#0891b2]/10">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-500 mr-4">
                            <span className="material-icons">check_circle</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Processed</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total - stats.ocrPending}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Records Table */}
            <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-[#0891b2]/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#0891b2]/5 border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Document</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Case</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Provider</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <span className="material-icons animate-spin text-4xl">refresh</span>
                                        <p className="mt-2">Loading records...</p>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record._id} className="hover:bg-slate-50 dark:hover:bg-[#0891b2]/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="material-icons text-red-500 mr-3">picture_as_pdf</span>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{record.fileName}</div>
                                                    <div className="text-xs text-slate-500">{formatFileSize(record.fileSize)} • {record.pageCount} pages</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{record.case?.caseNumber || 'N/A'}</div>
                                            <div className="text-xs text-slate-500">{record.case?.caseName || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                            {record.provider?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                            {record.recordDate ? formatDate(record.recordDate) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${record.ocrStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                    record.ocrStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        record.ocrStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                            'bg-amber-100 text-amber-800'
                                                }`}>
                                                {record.ocrStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="p-2 text-slate-400 hover:text-[#0891b2] transition-colors">
                                                    <span className="material-icons text-lg">visibility</span>
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-[#0891b2] transition-colors">
                                                    <span className="material-icons text-lg">download</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                                    <span className="material-icons text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-[#0891b2]/5 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500">
                        Showing {records.length > 0 ? 1 : 0} to {records.length} of {pagination.total} records
                    </p>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                            disabled={pagination.page === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50">
                            <span className="material-icons text-sm">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0891b2] text-white text-xs font-bold">
                            {pagination.page}
                        </button>
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                            disabled={pagination.page >= pagination.pages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50">
                            <span className="material-icons text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordsList;
