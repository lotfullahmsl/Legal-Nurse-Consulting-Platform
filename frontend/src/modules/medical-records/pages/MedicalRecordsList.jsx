import { useState } from 'react';

const MedicalRecordsList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showUploadModal, setShowUploadModal] = useState(false);

    const records = [
        {
            id: 1,
            fileName: 'Hospital_Admission_Records.pdf',
            caseId: '2024-MED-042',
            caseName: 'Miller vs. City Hospital',
            provider: 'City General Hospital',
            recordDate: '2024-06-15',
            uploadDate: '2024-10-12',
            uploadedBy: 'Sarah Jenkins',
            fileSize: '4.2 MB',
            pageCount: 45,
            documentType: 'Hospital Records',
            status: 'Processed',
            ocrStatus: 'Complete'
        },
        {
            id: 2,
            fileName: 'Surgical_Notes_Dr_Smith.pdf',
            caseId: '2024-MED-042',
            caseName: 'Miller vs. City Hospital',
            provider: 'Dr. Robert Smith',
            recordDate: '2024-06-16',
            uploadDate: '2024-10-11',
            uploadedBy: 'Sarah Jenkins',
            fileSize: '1.8 MB',
            pageCount: 12,
            documentType: 'Surgical Notes',
            status: 'Processed',
            ocrStatus: 'Complete'
        },
        {
            id: 3,
            fileName: 'Lab_Results_June_2024.pdf',
            caseId: '2024-MED-039',
            caseName: 'Ramirez Malpractice',
            provider: 'Quest Diagnostics',
            recordDate: '2024-06-20',
            uploadDate: '2024-10-10',
            uploadedBy: 'John Doe',
            fileSize: '856 KB',
            pageCount: 8,
            documentType: 'Lab Results',
            status: 'Processed',
            ocrStatus: 'Complete'
        },
        {
            id: 4,
            fileName: 'Radiology_Report_CT_Scan.pdf',
            caseId: '2024-MED-039',
            caseName: 'Ramirez Malpractice',
            provider: 'Imaging Center',
            recordDate: '2024-06-18',
            uploadDate: '2024-10-09',
            uploadedBy: 'Sarah Jenkins',
            fileSize: '2.1 MB',
            pageCount: 6,
            documentType: 'Radiology',
            status: 'Processing',
            ocrStatus: 'In Progress'
        }
    ];

    const getStatusColor = (status) => {
        return status === 'Processed'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Records</h1>
                    <p className="text-slate-500 mt-1">Manage and organize all medical documents</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-[#0891b2] hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
                >
                    <span className="material-icons text-sm">cloud_upload</span>
                    Upload Records
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-icons text-blue-600">description</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">248</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Total Records</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="material-icons text-green-600">check_circle</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">235</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Processed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <span className="material-icons text-yellow-600">pending</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">13</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Processing</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-icons text-purple-600">storage</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">2.4 GB</p>
                            <p className="text-xs text-slate-500 uppercase font-bold">Total Size</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Search by file name, case, or provider..."
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-transparent outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] outline-none"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="hospital">Hospital Records</option>
                            <option value="surgical">Surgical Notes</option>
                            <option value="lab">Lab Results</option>
                            <option value="radiology">Radiology</option>
                            <option value="pharmacy">Pharmacy</option>
                        </select>
                        <button className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                            <span className="material-icons text-sm">filter_list</span>
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Records Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase text-slate-400">
                            <tr>
                                <th className="px-6 py-3 text-left">Document</th>
                                <th className="px-6 py-3 text-left">Case</th>
                                <th className="px-6 py-3 text-left">Provider</th>
                                <th className="px-6 py-3 text-left">Record Date</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {records.map((record) => (
                                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                                <span className="material-icons text-red-500">picture_as_pdf</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{record.fileName}</p>
                                                <p className="text-xs text-slate-400">{record.fileSize} • {record.pageCount} pages</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{record.caseName}</p>
                                        <p className="text-xs text-slate-400">{record.caseId}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{record.provider}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{record.recordDate}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            {record.documentType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="View">
                                                <span className="material-icons text-slate-400 hover:text-[#0891b2]">visibility</span>
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Download">
                                                <span className="material-icons text-slate-400 hover:text-[#0891b2]">download</span>
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="More">
                                                <span className="material-icons text-slate-400 hover:text-[#0891b2]">more_vert</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing 1-4 of 248 records</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 bg-[#0891b2] text-white rounded-lg text-sm">1</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">3</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Upload Medical Records</h3>
                            <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center">
                            <span className="material-icons text-5xl text-slate-400 mb-4">cloud_upload</span>
                            <p className="text-sm font-medium mb-2">Drag and drop files here</p>
                            <p className="text-xs text-slate-500 mb-4">or click to browse</p>
                            <button className="bg-[#0891b2] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                                Select Files
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordsList;
