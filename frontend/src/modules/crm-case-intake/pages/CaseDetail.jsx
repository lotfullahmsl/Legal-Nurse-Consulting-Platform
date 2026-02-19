import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import caseService from '../../../services/case.service';

const CaseDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCaseDetails();
    }, [id]);

    const fetchCaseDetails = async () => {
        try {
            setLoading(true);
            const response = await caseService.getCaseById(id);
            console.log('Case response:', response);
            // Backend returns { success: true, data: { case: caseData } }
            const data = response.data?.case || response.case || response.data || response;
            console.log('Extracted case data:', data);
            setCaseData(data);
        } catch (error) {
            console.error('Failed to load case:', error);
            alert('Failed to load case details: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExportReport = async () => {
        try {
            // Generate a comprehensive case report
            const reportData = {
                caseNumber: caseData.caseNumber,
                caseName: caseData.caseName,
                caseType: caseData.caseType,
                status: caseData.status,
                priority: caseData.priority,
                client: caseData.client?.fullName || 'N/A',
                lawFirm: caseData.lawFirm?.firmName || 'N/A',
                assignedConsultant: caseData.assignedConsultant?.fullName || 'N/A',
                incidentDate: caseData.incidentDate ? new Date(caseData.incidentDate).toLocaleDateString() : 'N/A',
                filingDate: caseData.filingDate ? new Date(caseData.filingDate).toLocaleDateString() : 'N/A',
                description: caseData.description || 'N/A',
                allegations: caseData.allegations || [],
                damages: caseData.damages || {},
                timeline: caseData.timeline || [],
                documents: caseData.documents || [],
                notes: caseData.notes || 'N/A',
                createdAt: new Date(caseData.createdAt).toLocaleDateString(),
                updatedAt: new Date(caseData.updatedAt).toLocaleDateString()
            };

            // Create a formatted text report
            let reportText = `CASE REPORT\n`;
            reportText += `${'='.repeat(80)}\n\n`;
            reportText += `Case Number: ${reportData.caseNumber}\n`;
            reportText += `Case Name: ${reportData.caseName}\n`;
            reportText += `Case Type: ${reportData.caseType}\n`;
            reportText += `Status: ${reportData.status}\n`;
            reportText += `Priority: ${reportData.priority}\n\n`;
            reportText += `CLIENT INFORMATION\n`;
            reportText += `${'-'.repeat(80)}\n`;
            reportText += `Client: ${reportData.client}\n`;
            reportText += `Law Firm: ${reportData.lawFirm}\n`;
            reportText += `Assigned Consultant: ${reportData.assignedConsultant}\n\n`;
            reportText += `CASE DETAILS\n`;
            reportText += `${'-'.repeat(80)}\n`;
            reportText += `Incident Date: ${reportData.incidentDate}\n`;
            reportText += `Filing Date: ${reportData.filingDate}\n`;
            reportText += `Description: ${reportData.description}\n\n`;

            if (reportData.allegations.length > 0) {
                reportText += `ALLEGATIONS\n`;
                reportText += `${'-'.repeat(80)}\n`;
                reportData.allegations.forEach((allegation, index) => {
                    reportText += `${index + 1}. ${allegation}\n`;
                });
                reportText += `\n`;
            }

            if (reportData.damages.economic || reportData.damages.nonEconomic || reportData.damages.punitive) {
                reportText += `DAMAGES\n`;
                reportText += `${'-'.repeat(80)}\n`;
                reportText += `Economic: $${reportData.damages.economic || 0}\n`;
                reportText += `Non-Economic: $${reportData.damages.nonEconomic || 0}\n`;
                reportText += `Punitive: $${reportData.damages.punitive || 0}\n\n`;
            }

            if (reportData.timeline.length > 0) {
                reportText += `TIMELINE\n`;
                reportText += `${'-'.repeat(80)}\n`;
                reportData.timeline.forEach((event, index) => {
                    reportText += `${index + 1}. ${new Date(event.date).toLocaleDateString()} - ${event.event}\n`;
                    if (event.description) reportText += `   ${event.description}\n`;
                });
                reportText += `\n`;
            }

            if (reportData.documents.length > 0) {
                reportText += `DOCUMENTS\n`;
                reportText += `${'-'.repeat(80)}\n`;
                reportData.documents.forEach((doc, index) => {
                    reportText += `${index + 1}. ${doc.name} (${doc.type})\n`;
                });
                reportText += `\n`;
            }

            reportText += `NOTES\n`;
            reportText += `${'-'.repeat(80)}\n`;
            reportText += `${reportData.notes}\n\n`;
            reportText += `Report Generated: ${new Date().toLocaleString()}\n`;

            // Create and download the file
            const blob = new Blob([reportText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportData.caseNumber}_Report_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            alert('Report exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export report: ' + error.message);
        }
    };

    const handleGenerateTimeline = async () => {
        try {
            if (!caseData.timeline || caseData.timeline.length === 0) {
                alert('No timeline events found for this case. Add timeline events first.');
                return;
            }

            // Sort timeline events by date
            const sortedTimeline = [...caseData.timeline].sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            );

            // Create timeline document
            let timelineText = `MEDICAL CHRONOLOGY TIMELINE\n`;
            timelineText += `${'='.repeat(80)}\n\n`;
            timelineText += `Case: ${caseData.caseNumber} - ${caseData.caseName}\n`;
            timelineText += `Client: ${caseData.client?.fullName || 'N/A'}\n`;
            timelineText += `Generated: ${new Date().toLocaleString()}\n\n`;
            timelineText += `TIMELINE OF EVENTS\n`;
            timelineText += `${'-'.repeat(80)}\n\n`;

            sortedTimeline.forEach((event, index) => {
                const eventDate = new Date(event.date);
                timelineText += `${index + 1}. ${eventDate.toLocaleDateString()} - ${eventDate.toLocaleTimeString()}\n`;
                timelineText += `   Event: ${event.event}\n`;
                if (event.description) {
                    timelineText += `   Description: ${event.description}\n`;
                }
                if (event.createdBy?.fullName) {
                    timelineText += `   Documented by: ${event.createdBy.fullName}\n`;
                }
                timelineText += `\n`;
            });

            timelineText += `${'-'.repeat(80)}\n`;
            timelineText += `Total Events: ${sortedTimeline.length}\n`;
            timelineText += `Date Range: ${new Date(sortedTimeline[0].date).toLocaleDateString()} to ${new Date(sortedTimeline[sortedTimeline.length - 1].date).toLocaleDateString()}\n`;

            // Create and download the file
            const blob = new Blob([timelineText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${caseData.caseNumber}_Timeline_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            alert('Timeline generated successfully!');
        } catch (error) {
            console.error('Timeline generation error:', error);
            alert('Failed to generate timeline: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0891b2] mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading case details...</p>
                </div>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Case not found</p>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'records', label: 'Medical Records', icon: 'folder' },
        { id: 'timeline', label: 'Timeline', icon: 'timeline' },
        { id: 'analysis', label: 'Analysis', icon: 'analytics' },
        { id: 'damages', label: 'Damages', icon: 'assessment' },
        { id: 'tasks', label: 'Tasks', icon: 'assignment' },
        { id: 'billing', label: 'Billing', icon: 'payments' },
        { id: 'notes', label: 'Notes', icon: 'note' },
    ];

    return (
        <div>
            <header className="bg-white dark:bg-slate-900 border-b border-[#1f3b61]/10 -mx-8 -mt-8 mb-8 px-8 py-4">
                <nav className="flex text-xs text-[#1f3b61]/60 mb-2">
                    <Link to="/dashboard">Dashboard</Link>
                    <span className="material-icons text-xs mx-1">chevron_right</span>
                    <Link to="/cases">Cases</Link>
                    <span className="material-icons text-xs mx-1">chevron_right</span>
                    <span className="font-medium text-[#1f3b61]">{id}</span>
                </nav>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1f3b61] dark:text-white">{caseData.title}</h1>
                        <p className="text-sm text-slate-500 mt-1">{caseData.caseType} • Created {new Date(caseData.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportReport}
                            className="px-4 py-2 border-2 border-[#1f3b61] text-[#1f3b61] rounded-lg font-medium hover:bg-[#1f3b61]/5 transition-colors"
                        >
                            Export Report
                        </button>
                        <button
                            onClick={handleGenerateTimeline}
                            className="px-4 py-2 bg-[#0891b2] text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                        >
                            Generate Timeline
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                ? 'border-[#1f3b61] text-[#1f3b61]'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            <span className="material-icons text-sm">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="py-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-bold mb-4">Case Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Case Number</p>
                                        <p className="text-sm font-semibold mt-1">{caseData.caseNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${caseData.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                            caseData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                caseData.status === 'closed' ? 'bg-slate-100 text-slate-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>{caseData.status}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Client</p>
                                        <p className="text-sm font-semibold mt-1">{caseData.client?.fullName || caseData.client?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold">Law Firm</p>
                                        <p className="text-sm font-semibold mt-1">{caseData.lawFirm?.firmName || caseData.lawFirm?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                                <h3 className="text-lg font-bold mb-4">Assigned Team</h3>
                                <div className="space-y-3">
                                    {caseData.assignedTo && caseData.assignedTo.length > 0 ? (
                                        caseData.assignedTo.map((member, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#1f3b61]/10 flex items-center justify-center">
                                                    <span className="material-icons text-[#1f3b61]">person</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{member.name || member.email || 'Team Member'}</p>
                                                    <p className="text-xs text-slate-500">{member.role || 'Staff'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500">No team members assigned</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'records' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Medical Records</h3>
                            <button
                                onClick={() => alert('Upload Medical Record functionality - Navigate to Medical Records page')}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <span className="material-icons text-sm">upload_file</span>
                                Upload Record
                            </button>
                        </div>
                        <div className="text-center py-12 text-slate-500">
                            Medical Records content will be displayed here
                        </div>
                    </div>
                )}
                {activeTab === 'timeline' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Timeline</h3>
                            <button
                                onClick={() => alert('Create Timeline functionality - Navigate to Timeline Builder')}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <span className="material-icons text-sm">add</span>
                                Create Timeline
                            </button>
                        </div>
                        <div className="text-center py-12 text-slate-500">
                            Timeline content will be displayed here
                        </div>
                    </div>
                )}
                {activeTab === 'analysis' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Case Analysis</h3>
                            <button
                                onClick={() => alert('Add Finding functionality - Navigate to Case Analysis page')}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <span className="material-icons text-sm">add</span>
                                Add Finding
                            </button>
                        </div>
                        <div className="text-center py-12 text-slate-500">
                            Case Analysis content will be displayed here
                        </div>
                    </div>
                )}
                {activeTab === 'damages' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Damages Tracking</h3>
                            <button
                                onClick={() => alert('Add Damage Entry functionality - Navigate to Damages Tracking page')}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <span className="material-icons text-sm">add</span>
                                Add Damage
                            </button>
                        </div>
                        <div className="text-center py-12 text-slate-500">
                            Damages tracking content will be displayed here
                        </div>
                    </div>
                )}
                {activeTab === 'tasks' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tasks</h3>
                            <button
                                onClick={() => alert('Create Task functionality - Navigate to Tasks page')}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <span className="material-icons text-sm">add</span>
                                Create Task
                            </button>
                        </div>
                        <div className="text-center py-12 text-slate-500">
                            Tasks content will be displayed here
                        </div>
                    </div>
                )}
                {activeTab === 'billing' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Billing</h3>
                            <button
                                onClick={() => alert('Create Invoice functionality - Navigate to Billing page')}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <span className="material-icons text-sm">add</span>
                                Create Invoice
                            </button>
                        </div>
                        <div className="text-center py-12 text-slate-500">
                            Billing content will be displayed here
                        </div>
                    </div>
                )}
                {activeTab === 'notes' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notes</h3>
                            <button
                                onClick={() => alert('Add Note functionality - Navigate to Notes page')}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0891b2] text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                <span className="material-icons text-sm">add</span>
                                Add Note
                            </button>
                        </div>
                        <div className="text-center py-12 text-slate-500">
                            Notes content will be displayed here
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseDetail;
