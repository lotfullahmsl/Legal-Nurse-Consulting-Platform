import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCase = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        caseTitle: '',
        caseType: '',
        clientName: '',
        lawFirm: '',
        attorney: '',
        description: '',
    });

    const steps = [
        { number: 1, title: 'Basic Info', icon: 'info' },
        { number: 2, title: 'Client Details', icon: 'person' },
        { number: 3, title: 'Assignment', icon: 'assignment_ind' },
        { number: 4, title: 'Review', icon: 'check_circle' },
    ];

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        console.log('Creating case:', formData);
        navigate('/cases');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-[#1f3b61] dark:text-white mb-2">Create New Case</h1>
                <p className="text-slate-500">Follow the steps below to create a new legal case</p>
            </header>

            {/* Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((s, index) => (
                        <div key={s.number} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= s.number ? 'bg-[#1f3b61] text-white' : 'bg-slate-200 text-slate-400'
                                    }`}>
                                    <span className="material-icons">{s.icon}</span>
                                </div>
                                <p className={`text-xs mt-2 font-medium ${step >= s.number ? 'text-[#1f3b61]' : 'text-slate-400'}`}>
                                    {s.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-4 ${step > s.number ? 'bg-[#1f3b61]' : 'bg-slate-200'}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Basic Information</h2>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Case Title *
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61]"
                                placeholder="Enter case title"
                                value={formData.caseTitle}
                                onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Case Type *
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61]"
                                value={formData.caseType}
                                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                            >
                                <option value="">Select case type</option>
                                <option value="malpractice">Medical Malpractice</option>
                                <option value="injury">Personal Injury</option>
                                <option value="tort">Mass Tort</option>
                                <option value="liability">Product Liability</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61]"
                                rows="4"
                                placeholder="Enter case description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Client Details</h2>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Client Name *
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61]"
                                placeholder="Enter client name"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Law Firm *
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61]"
                                placeholder="Enter law firm name"
                                value={formData.lawFirm}
                                onChange={(e) => setFormData({ ...formData, lawFirm: e.target.value })}
                            />
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <span className="material-icons text-blue-600">info</span>
                                <div>
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Conflict Check</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                        No conflicts found for this client and law firm combination.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Assignment & Engagement</h2>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Assigned Attorney *
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1f3b61]/20 focus:border-[#1f3b61]"
                                value={formData.attorney}
                                onChange={(e) => setFormData({ ...formData, attorney: e.target.value })}
                            >
                                <option value="">Select attorney</option>
                                <option value="david">David Richardson</option>
                                <option value="elena">Elena Rodriguez</option>
                                <option value="michael">Michael Chen</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Billing Type
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="radio" name="billing" className="mr-2" defaultChecked />
                                    <span className="text-sm">Hourly Rate</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="billing" className="mr-2" />
                                    <span className="text-sm">Flat Fee</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="billing" className="mr-2" />
                                    <span className="text-sm">Contingency</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Review & Confirm</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Case Title</p>
                                    <p className="text-sm font-semibold mt-1">{formData.caseTitle || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Case Type</p>
                                    <p className="text-sm font-semibold mt-1">{formData.caseType || 'Not selected'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Client Name</p>
                                    <p className="text-sm font-semibold mt-1">{formData.clientName || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Law Firm</p>
                                    <p className="text-sm font-semibold mt-1">{formData.lawFirm || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Attorney</p>
                                    <p className="text-sm font-semibold mt-1">{formData.attorney || 'Not assigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/cases')}
                            className="px-6 py-2 text-slate-600 hover:text-slate-800"
                        >
                            Cancel
                        </button>
                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-[#1f3b61] text-white rounded-lg font-medium hover:bg-[#1f3b61]/90"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-[#0891b2] text-white rounded-lg font-medium hover:bg-teal-700"
                            >
                                Create Case
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCase;
