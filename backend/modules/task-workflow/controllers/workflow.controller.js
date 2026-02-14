const Workflow = require('../../../models/Workflow.model');
const Task = require('../../../models/Task.model');
const Case = require('../../../models/Case.model');
const User = require('../../../models/User.model');

// Get all workflows
exports.getAllWorkflows = async (req, res, next) => {
    try {
        const { type, isTemplate, isActive } = req.query;

        const filter = {};
        if (type) filter.type = type;
        if (isTemplate !== undefined) filter.isTemplate = isTemplate === 'true';
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const workflows = await Workflow.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(workflows);
    } catch (error) {
        next(error);
    }
};

// Get workflow by ID
exports.getWorkflowById = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        res.json(workflow);
    } catch (error) {
        next(error);
    }
};

// Create workflow
exports.createWorkflow = async (req, res, next) => {
    try {
        const { name, description, type, isTemplate, triggerEvent, steps } = req.body;

        const workflow = new Workflow({
            name,
            description,
            type,
            isTemplate,
            triggerEvent,
            steps,
            createdBy: req.user.id
        });

        await workflow.save();
        await workflow.populate('createdBy', 'name email');

        res.status(201).json(workflow);
    } catch (error) {
        next(error);
    }
};

// Update workflow
exports.updateWorkflow = async (req, res, next) => {
    try {
        const { name, description, type, isTemplate, isActive, triggerEvent, steps } = req.body;

        const workflow = await Workflow.findById(req.params.id);
        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        if (name) workflow.name = name;
        if (description !== undefined) workflow.description = description;
        if (type) workflow.type = type;
        if (isTemplate !== undefined) workflow.isTemplate = isTemplate;
        if (isActive !== undefined) workflow.isActive = isActive;
        if (triggerEvent) workflow.triggerEvent = triggerEvent;
        if (steps) workflow.steps = steps;

        await workflow.save();
        await workflow.populate('createdBy', 'name email');

        res.json(workflow);
    } catch (error) {
        next(error);
    }
};

// Delete workflow
exports.deleteWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findByIdAndDelete(req.params.id);
        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        res.json({ message: 'Workflow deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Execute workflow (create tasks from workflow)
exports.executeWorkflow = async (req, res, next) => {
    try {
        const { caseId } = req.body;
        const workflowId = req.params.id;

        // Get workflow
        const workflow = await Workflow.findById(workflowId);
        if (!workflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        if (!workflow.isActive) {
            return res.status(400).json({ message: 'Workflow is not active' });
        }

        // Verify case exists
        const caseExists = await Case.findById(caseId);
        if (!caseExists) {
            return res.status(404).json({ message: 'Case not found' });
        }

        const createdTasks = [];

        // Create tasks from workflow steps
        for (const step of workflow.steps) {
            let assignedTo = req.user.id;

            // Auto-assign based on role if specified
            if (step.autoAssign && step.assignToRole) {
                const user = await User.findOne({ role: step.assignToRole, isActive: true });
                if (user) {
                    assignedTo = user._id;
                }
            }

            // Calculate due date
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + step.daysToComplete);

            const task = new Task({
                title: step.title,
                description: step.description,
                case: caseId,
                assignedTo,
                assignedBy: req.user.id,
                priority: step.priority,
                type: step.taskType,
                dueDate,
                workflowId: workflow._id
            });

            await task.save();
            await task.populate('assignedTo', 'name email');
            createdTasks.push(task);
        }

        // Increment usage count
        workflow.usageCount += 1;
        await workflow.save();

        res.json({
            message: 'Workflow executed successfully',
            tasksCreated: createdTasks.length,
            tasks: createdTasks
        });
    } catch (error) {
        next(error);
    }
};

// Get workflow templates
exports.getWorkflowTemplates = async (req, res, next) => {
    try {
        const templates = await Workflow.find({ isTemplate: true, isActive: true })
            .populate('createdBy', 'name email')
            .sort({ usageCount: -1, name: 1 });

        res.json(templates);
    } catch (error) {
        next(error);
    }
};

// Clone workflow template
exports.cloneWorkflow = async (req, res, next) => {
    try {
        const originalWorkflow = await Workflow.findById(req.params.id);
        if (!originalWorkflow) {
            return res.status(404).json({ message: 'Workflow not found' });
        }

        const clonedWorkflow = new Workflow({
            name: `${originalWorkflow.name} (Copy)`,
            description: originalWorkflow.description,
            type: originalWorkflow.type,
            isTemplate: false,
            triggerEvent: originalWorkflow.triggerEvent,
            steps: originalWorkflow.steps,
            createdBy: req.user.id
        });

        await clonedWorkflow.save();
        await clonedWorkflow.populate('createdBy', 'name email');

        res.status(201).json(clonedWorkflow);
    } catch (error) {
        next(error);
    }
};
