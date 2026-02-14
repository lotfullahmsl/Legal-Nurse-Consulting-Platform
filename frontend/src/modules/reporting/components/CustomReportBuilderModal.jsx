import { useEffect, useState } from 'react';
import reportService from '../../../services/report.service';

const CustomReportBuilderModal = ({ isOpen, onClose, onReportGenerated }) => {
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        case: '',
        type: 'custom',
        template: 'custom',
        format: 'pdf',
        sections: {
            caseOverview: true,
            medicalChronology: false,
            timelineAnalysis: false,
            standardsOfCare: false,
            liabilityAssessment: false,
            damagesCalculation: false,
            expertOpinion: false,
            supportingDocuments: false
        },
        dateRange: {
            start: '',
            end: ''
        },
        includeImages: true,
        includeCharts: true,
        customNotes: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchCases();
        }
    }, [isOpen]);

    const fetchCases = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/cases', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCases(data.cases || []);
        } catch (error) {
            console.error('Failed to fetch cases:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSectionToggle = (section) => {
        setFormData(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: !prev.sections[section]
            }
        }));
    };

    const handleDateRangeChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const reportData = {
                title: formData.title,
                case: formData.case,
                type: formData.type,
                template: formData.template,
                format: formData.format,
                parameters: {
                    sections: formData.sections,
                    dateRange: formData.dateRange,
                    includeImages: formData.includeImages,
                    includeCharts: formData.includeCharts,
                    customNotes: formData.customNotes
                }
            };

            await reportService.generate(reportData);

            alert('Report generation started! You will be notified when it\'s ready.');
            onReportGenerated();
            onClose();

            // Reset form
            setFormData({
                title: '',
                case: '',
                type: 'custom',
                template: 'custom',
                format: 'pdf',
                sections: {
                    caseOverview: true,
                    medicalChronology: false,
                    timelineAnalysis: false,
                    standardsOfCare: false,
                    liabilityAssessment: false,
                    damagesCalculation: false,
                    expertOpinion: false,
                    supportingDocuments: false
                },
                dateRange: {
                    start: '',
                    end: ''
                },
                includeImages: true,
                includeCharts: true,
                customNotes: ''
            });
            setStep(1);
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('Failed to generate report: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const getSelectedSectionsCount = () => {
        return Object.values(formData.sections).filter(Boolean).length;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-icons text-[#0891b2]">dashboard_customize</span>
                            Custom Report Builder
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Step {step} of 3</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex-1">
                                <div className={`h-2 rounded-full transition-all ${s <= step ? 'bg-[#0891b2]' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

                            {/* Report Title */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Report Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                                    placeholder="e.g., Comprehensive Medical Analysis Report"
                                />
                            </div>

                            {/* Case Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Select Case <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="case"
                                    value={formData.case}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                                >
                                    <option value="">Select a case</option>
                                    {cases.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.caseNumber} - {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Output Format */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Output Format <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['pdf', 'docx', 'html'].map((format) => (
                                        <label
                                            key={format}
                                            className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.format === format
                                                ? 'border-[#0891b2] bg-[#0891b2]/10'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-[#0891b2]/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="format"
                                                value={format}
                                                checked={formData.format === format}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="material-icons text-[#0891b2]">
                                                {format === 'pdf' ? 'picture_as_pdf' : format === 'docx' ? 'description' : 'code'}
                                            </span>
                                            <span className="font-medium uppercase">{format}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Date Range (Optional)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.dateRange.start}
                                            onChange={(e) => handleDateRangeChange('start', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.dateRange.end}
                                            onChange={(e) => handleDateRangeChange('end', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Sections */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Select Report Sections</h3>
                                <span className="text-sm text-slate-500">
                                    {getSelectedSectionsCount()} sections selected
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries({
                                    caseOverview: { label: 'Case Overview', icon: 'summarize', desc: 'Basic case information and summary' },
                                    medicalChronology: { label: 'Medical Chronology', icon: 'timeline', desc: 'Detailed timeline of medical events' },
                                    timelineAnalysis: { label: 'Timeline Analysis', icon: 'analytics', desc: 'Analysis of event sequences' },
                                    standardsOfCare: { label: 'Standards of Care', icon: 'verified', desc: 'Medical standards evaluation' },
                                    liabilityAssessment: { label: 'Liability Assessment', icon: 'gavel', desc: 'Legal liability analysis' },
                                    damagesCalculation: { label: 'Damages Calculation', icon: 'calculate', desc: 'Economic and non-economic damages' },
                                    expertOpinion: { label: 'Expert Opinion', icon: 'psychology', desc: 'Professional medical opinion' },
                                    supportingDocuments: { label: 'Supporting Documents', icon: 'folder', desc: 'Appendix with source documents' }
                                }).map(([key, { label, icon, desc }]) => (
                                    <label
                                        key={key}
                                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.sections[key]
                                            ? 'border-[#0891b2] bg-[#0891b2]/10'
                                            : 'border-slate-300 dark:border-slate-700 hover:border-[#0891b2]/50'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.sections[key]}
                                            onChange={() => handleSectionToggle(key)}
                                            className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#0891b2] focus:ring-[#0891b2]"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="material-icons text-[#0891b2] text-sm">{icon}</span>
                                                <span className="font-medium">{label}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">{desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Additional Options */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Additional Options</h3>

                            {/* Visual Elements */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="includeImages"
                                        checked={formData.includeImages}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#0891b2] focus:ring-[#0891b2]"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-icons text-[#0891b2] text-sm">image</span>
                                            <span className="font-medium">Include Images & Diagrams</span>
                                        </div>
                                        <p className="text-xs text-slate-500">Add relevant medical images and anatomical diagrams</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="includeCharts"
                                        checked={formData.includeCharts}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#0891b2] focus:ring-[#0891b2]"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-icons text-[#0891b2] text-sm">bar_chart</span>
                                            <span className="font-medium">Include Charts & Graphs</span>
                                        </div>
                                        <p className="text-xs text-slate-500">Add visual data representations and statistics</p>
                                    </div>
                                </label>
                            </div>

                            {/* Custom Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Custom Notes / Instructions</label>
                                <textarea
                                    name="customNotes"
                                    value={formData.customNotes}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none resize-none"
                                    placeholder="Add any special instructions or notes for the report generation..."
                                />
                            </div>

                            {/* Summary */}
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <span className="material-icons text-[#0891b2]">summarize</span>
                                    Report Summary
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Title:</span>
                                        <span className="font-medium">{formData.title || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Format:</span>
                                        <span className="font-medium uppercase">{formData.format}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Sections:</span>
                                        <span className="font-medium">{getSelectedSectionsCount()} selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
                        <button
                            type="button"
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={step === 1 && (!formData.title || !formData.case)}
                                className="px-6 py-2 bg-[#0891b2] hover:bg-teal-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next Step
                                <span className="material-icons text-sm">arrow_forward</span>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading || getSelectedSectionsCount() === 0}
                                className="px-6 py-2 bg-[#0891b2] hover:bg-teal-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons text-sm">play_arrow</span>
                                        Generate Report
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomReportBuilderModal;
