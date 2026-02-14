import { useEffect, useState } from 'react';
import billingService from '../../../services/billing.service';

const ManualTimeEntryModal = ({ isOpen, onClose, onEntryCreated }) => {
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [formData, setFormData] = useState({
        case: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        minutes: '0',
        billableRate: '150',
        isBillable: true,
        activityType: 'review',
        notes: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const entryData = {
                case: formData.case,
                description: formData.description,
                date: formData.date,
                hours: parseFloat(formData.hours) || 0,
                minutes: parseInt(formData.minutes) || 0,
                billableRate: parseFloat(formData.billableRate),
                isBillable: formData.isBillable,
                activityType: formData.activityType,
                notes: formData.notes
            };

            await billingService.createTimeEntry(entryData);

            // Reset form
            setFormData({
                case: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                hours: '',
                minutes: '0',
                billableRate: '150',
                isBillable: true,
                activityType: 'review',
                notes: ''
            });

            alert('Time entry created successfully');
            onEntryCreated();
            onClose();
        } catch (error) {
            console.error('Failed to create time entry:', error);
            alert('Failed to create time entry: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        const hours = parseFloat(formData.hours) || 0;
        const minutes = parseInt(formData.minutes) || 0;
        const rate = parseFloat(formData.billableRate) || 0;
        const totalHours = hours + (minutes / 60);
        return (totalHours * rate).toFixed(2);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-icons text-[#1f3b61]">schedule</span>
                        Manual Time Entry
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Case Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Case <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="case"
                            value={formData.case}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none"
                        >
                            <option value="">Select a case</option>
                            {cases.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.caseNumber} - {c.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Activity Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Activity Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="activityType"
                            value={formData.activityType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none"
                        >
                            <option value="research">Research</option>
                            <option value="review">Medical Record Review</option>
                            <option value="analysis">Case Analysis</option>
                            <option value="communication">Client Communication</option>
                            <option value="documentation">Documentation</option>
                            <option value="meeting">Meeting</option>
                            <option value="court">Court Appearance</option>
                            <option value="travel">Travel</option>
                            <option value="administrative">Administrative</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none resize-none"
                            placeholder="Describe the work performed..."
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Hours <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="hours"
                                value={formData.hours}
                                onChange={handleChange}
                                required
                                min="0"
                                max="24"
                                step="0.25"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Minutes</label>
                            <select
                                name="minutes"
                                value={formData.minutes}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none"
                            >
                                <option value="0">0</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </select>
                        </div>
                    </div>

                    {/* Billing Rate */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Billable Rate ($/hr) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="billableRate"
                            value={formData.billableRate}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none"
                            placeholder="150.00"
                        />
                    </div>

                    {/* Total Amount Display */}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Amount:
                            </span>
                            <span className="text-2xl font-bold text-[#1f3b61] dark:text-white">
                                ${calculateTotal()}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {formData.hours || 0}h {formData.minutes || 0}m × ${formData.billableRate || 0}/hr
                        </div>
                    </div>

                    {/* Billable Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <input
                            type="checkbox"
                            name="isBillable"
                            checked={formData.isBillable}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-[#1f3b61] focus:ring-[#1f3b61]"
                        />
                        <div>
                            <label className="text-sm font-medium cursor-pointer">
                                Mark as Billable
                            </label>
                            <p className="text-xs text-slate-500">
                                This time entry will be included in client invoices
                            </p>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Additional Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#1f3b61] focus:border-[#1f3b61] outline-none resize-none"
                            placeholder="Optional internal notes..."
                        />
                    </div>

                    {/* HIPAA Notice */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 flex gap-2">
                        <span className="material-icons text-amber-600 dark:text-amber-400 text-sm">info</span>
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                            Ensure no PHI (Protected Health Information) is included in descriptions or notes. Use case numbers for reference.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#1f3b61] hover:bg-[#1f3b61]/90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons text-sm">save</span>
                                    Save Time Entry
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualTimeEntryModal;
