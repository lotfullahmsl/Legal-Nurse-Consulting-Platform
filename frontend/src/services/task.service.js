import apiClient from './api.service';

const taskService = {
    // Get all tasks with filters
    getAllTasks: async (params = {}) => {
        const response = await apiClient.get('/tasks', { params });
        return response.data;
    },

    // Get my tasks
    getMyTasks: async (params = {}) => {
        const response = await apiClient.get('/tasks/my-tasks', { params });
        return response.data;
    },

    // Get tasks by case
    getTasksByCase: async (caseId) => {
        const response = await apiClient.get(`/tasks/case/${caseId}`);
        return response.data;
    },

    // Get task by ID
    getTaskById: async (id) => {
        const response = await apiClient.get(`/tasks/${id}`);
        return response.data;
    },

    // Create task
    createTask: async (taskData) => {
        const response = await apiClient.post('/tasks', taskData);
        return response.data;
    },

    // Update task
    updateTask: async (id, taskData) => {
        const response = await apiClient.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    // Update task status
    updateTaskStatus: async (id, status) => {
        const response = await apiClient.patch(`/tasks/${id}/status`, { status });
        return response.data;
    },

    // Delete task
    deleteTask: async (id) => {
        const response = await apiClient.delete(`/tasks/${id}`);
        return response.data;
    },

    // Assign task
    assignTask: async (id, assignedTo) => {
        const response = await apiClient.post(`/tasks/${id}/assign`, { assignedTo });
        return response.data;
    },

    // Add comment
    addComment: async (id, comment) => {
        const response = await apiClient.post(`/tasks/${id}/comments`, { comment });
        return response.data;
    },

    // Get task statistics
    getTaskStats: async (userId) => {
        const response = await apiClient.get('/tasks/stats', { params: { userId } });
        return response.data;
    }
};

export default taskService;
