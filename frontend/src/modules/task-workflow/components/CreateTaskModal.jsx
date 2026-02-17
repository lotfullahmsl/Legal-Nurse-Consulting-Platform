import { useEffect, useState } from 'react';
import apiClient from '../../../services/api.service';
import caseService from '../../../services/case.service';

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        case: '',
        assignedTo: '',
        priority: 'medium',
        status: 'pending',
        type: 'other',
        dueDate: '',
        tags: '',
        isRecurring: false
    });

    useEffect(() => {
        if (isOpen) {
            fetchCases();
            fetchUsers();
        }
    }, [isOpen]);

    const fetchCases = async () => {
        try {
            const response = await caseService.getAllCases();
            setCases(response.data?.cases || []);
        } catch (error) {
            console.error('Failed to fetch cases:', error);
            setCases([]); // Set empty array on error
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/users');
            // Backend returns { success: true, data: { users, pagination } }
            setUsers(response.data?.data?.users || response.data?.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]); // Set empty array on error
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
            const taskData = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            await onTaskCreated(taskData);

            // Reset form
            setFormData({
                title: '',
                description: '',
                case: '',
                assignedTo: '',
                priority: 'medium',
                status: 'pending',
                type: 'other',
                dueDate: '',
                tags: '',
                isRecurring: false
            });

            onClose();
        } catch (error) {
            console.error('Failed to create task:', error);
            console.error('Error response:', error.response?.data);

            // Show detailed validation errors if available
            let errorMessage = 'Failed to create task: ';
            if (error.response?.data?.errors) {
                errorMessage += error.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
            } else {
                errorMessage += error.response?.data?.message || error.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-icons text-[#0891b2]">add_task</span>
                        Create New Task
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
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                            placeholder="Enter task title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none resize-none"
                            placeholder="Enter task description"
                        />
                    </div>

                    {/* Case and Assigned To */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Case <span className="text-red-500">*</span>
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

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Assign To <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                            >
                                <option value="">Select a user</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>
                                        {u.fullName} ({u.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Priority, Status, Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="on-hold">On Hold</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                            >
                                <option value="other">Other</option>
                                <option value="review">Review</option>
                                <option value="analysis">Analysis</option>
                                <option value="timeline">Timeline</option>
                                <option value="report">Report</option>
                                <option value="court-date">Court Date</option>
                                <option value="deadline">Deadline</option>
                                <option value="follow-up">Follow Up</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-[#0891b2] focus:border-[#0891b2] outline-none"
                            placeholder="e.g., urgent, medical-review, client-meeting"
                        />
                    </div>

                    {/* Recurring */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isRecurring"
                            checked={formData.isRecurring}
                            onChange={handleChange}
                            className="rounded border-slate-300 dark:border-slate-700 text-[#0891b2] focus:ring-[#0891b2]"
                        />
                        <label className="text-sm font-medium">Recurring Task</label>
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
                            className="px-6 py-2 bg-[#0891b2] hover:bg-teal-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons text-sm">add</span>
                                    Create Task
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
