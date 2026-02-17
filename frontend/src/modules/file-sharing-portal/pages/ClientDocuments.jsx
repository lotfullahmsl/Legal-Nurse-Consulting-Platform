import { useEffect, useState } from 'react';

const ClientDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedCase, setSelectedCase] = useState('all');

    useEffect(() => {
        fetchDocuments();
    }, [selectedCase]);

    const fetchDocuments = async () => {
        // Mock data
        setDocuments([
            {
                id: 1,
                name: 'Hospital_Records_June_2024.pdf',
                size: '12.4 MB',
                uploadedDate: '2024-01-15',
                caseNumber: 'ML-88291',
                caseName: 'Miller vs. Sterling Medical',
                type: 'Medical Record',
                status: 'processed'
            },
            {
                id: 2,
                name: 'Lab_Results_Comprehensive.pdf',
                size: '2.1 MB',
                uploadedDate: '2024-01-20',
                caseNumber: 'ML-88291',
                caseName: 'Miller vs. Sterling Medical',
                type: 'Lab Results',
                status: 'processed'
            },
            {
                id: 3,
                name: 'Imaging_Reports_CT_MRI.zip',
                size: '45.8 MB',
                uploadedDate: '2024-02-01',
                caseNumber: 'ML-88291',
                caseName: 'Miller vs. Sterling Medical',
                type: 'Imaging',
                status: 'processing'
            }
        ]);
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setUploading(true);
            // Simulate upload
            setTimeout(() => {
                setUploading(false);
                fetchDocuments();
            }, 2000);
        }
    };

    const getFileIcon = (type) => {
        const icons = {
            'Medical Record': 'description',
            'Lab Results': 'science',
            'Imaging': 'medical_services',
            'default': 'insert_drive_file'
        };
        return icons[type] || icons.default;
    };

    const getStatusBadge = (status) => {
        const badges = {
            processed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            processing: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
            failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        };
        return badges[status] || badges.processing;
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Documents</h1>
                <p className="text-slate-600 dark:text-slate-400">Upload and manage your medical records and case documents</p>
            </div>

            {/* Upload Section */}
            <div className="bg-gradient-to-br from-[#0891b2] to-[#0891b2]/80 rounded-xl p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Upload Medical Records</h2>
                        <p className="text-white/80 mb-4">Securely upload your medical documents for review</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="material-icons text-lg">check_circle</span>
                            <span>256-bit AES Encryption</span>
                            <span className="mx-2">•</span>
                            <span className="material-icons text-lg">check_circle</span>
                            <span>HIPAA Compliant</span>
                        </div>
                    </div>
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <div className="bg-white text-[#0891b2] px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-lg">
                            <span className="material-icons">cloud_upload</span>
                            {uploading ? 'Uploading...' : 'Select Files'}
                        </div>
                    </label>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <select
                        value={selectedCase}
                        onChange={(e) => setSelectedCase(e.target.value)}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0891b2] focus:border-transparent"
                    >
                        <option value="all">All Cases</option>
                        <option value="ML-88291">ML-88291 - Miller vs. Sterling</option>
                        <option value="ML-88292">ML-88292 - Estate of J. Doe</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        {documents.length} documents
                    </span>
                </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                    <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-[#0891b2]/10 rounded-lg flex items-center justify-center group-hover:bg-[#0891b2] group-hover:text-white transition-colors">
                                <span className="material-icons text-[#0891b2] group-hover:text-white">{getFileIcon(doc.type)}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusBadge(doc.status)}`}>
                                {doc.status}
                            </span>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 truncate" title={doc.name}>
                            {doc.name}
                        </h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="material-icons text-sm">folder</span>
                                <span>{doc.caseNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="material-icons text-sm">calendar_today</span>
                                <span>{new Date(doc.uploadedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="material-icons text-sm">storage</span>
                                <span>{doc.size}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 bg-[#0891b2]/10 text-[#0891b2] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#0891b2]/20 transition-colors flex items-center justify-center gap-1">
                                <span className="material-icons text-sm">download</span>
                                Download
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                <span className="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Guidelines */}
            <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-icons text-[#0891b2]">info</span>
                    Upload Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2">
                        <span className="material-icons text-green-500 text-sm mt-0.5">check_circle</span>
                        <span>Accepted formats: PDF, DOC, DOCX, JPG, PNG</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="material-icons text-green-500 text-sm mt-0.5">check_circle</span>
                        <span>Maximum file size: 100 MB per file</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="material-icons text-green-500 text-sm mt-0.5">check_circle</span>
                        <span>All uploads are encrypted and HIPAA compliant</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="material-icons text-green-500 text-sm mt-0.5">check_circle</span>
                        <span>Documents are automatically indexed and searchable</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDocuments;
