const Workflow = require('../../../models/Workflow.model');
const Task = require('../../../models/Task.model');
const Case = require('../../../models/Case.model');
const User = require('../../../models/User.model');
const notificationService = require('./notification.service');
const logger = require('../../../shared/utils/logger.util');

/**
 * Workflow Automation Service
 */

/**
 * Trigger workflows based on case events
 */
exports.triggerWorkflowByEvent = async (eventType, caseId, userId) => {
    try {
        // Find active workflows that match the trigger event
        const workflows = await Workflow.find({
            isActive: true,
            triggerEvent: eventType
        });

        if (workflows.length === 0) {
            logger.info(`No workflows found for event: ${eventType}`);
            return [];
        }

        const executedWorkflows = [];

        for (const workflow of workflows) {
            try {
                const result = await executeWorkflow(workflow, caseId, userId);
                executedWorkflows.push(result);
            } catch (error) {
                logger.error(`Error executing workflow ${workflow._id}:`, error);
            }
        }

        logger.info(`Triggered ${executedWorkflows.length} workflows for event: ${eventType}`);
        return executedWorkflows;
    } catch (error) {
        logger.error('Error triggering workflows:', error);
        throw error;
    }
};

/**
 * Execute a workflow and create tasks
 */
async function executeWorkflow(workflow, caseId, userId) {
    try {
        const caseData = await Case.findById(caseId);
        if (!caseData) {
            throw new Error('Case not found');
        }

        const createdTasks = [];

        for (const step of workflow.steps) {
            let assignedTo = userId;

            // Auto-assign based on role
            if (step.autoAssign && step.assignToRole) {
                const user = await User.findOne({
                    role: step.assignToRole,
                    isActive: true
                }).sort({ createdAt: 1 }); // Round-robin: oldest user first

                if (user) {
                    assignedTo = user._id;
                }
            }

            // Calculate due date
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + (step.daysToComplete || 7));

            // Create task
            const task = new Task({
                title: step.title,
                description: step.description,
                case: caseId,
                assignedTo,
                assignedBy: userId,
                priority: step.priority || 'medium',
                type: step.taskType || 'general',
                dueDate,
                workflowId: workflow._id,
                tags: step.tags || []
            });

            await task.save();
            await task.populate('assignedTo', 'name email');
            await task.populate('case', 'title caseNumber');

            createdTasks.push(task);

            // Send notification
            await notificationService.sendTaskAssignment(task);
        }

        // Update workflow usage count
        workflow.usageCount += 1;
        workflow.lastExecuted = new Date();
        await workflow.save();

        logger.info(`Executed workflow ${workflow.name}, created ${createdTasks.length} tasks`);

        return {
            workflow: workflow._id,
            tasksCreated: createdTasks.length,
            tasks: createdTasks
        };
    } catch (error) {
        logger.error(`Error executing workflow ${workflow._id}:`, error);
        throw error;
    }
}

/**
 * Create default workflow templates
 */
exports.createDefaultTemplates = async () => {
    try {
        const templates = [
            {
                name: 'New Case Intake Workflow',
                description: 'Standard workflow for new case intake and setup',
                type: 'case-intake',
                isTemplate: true,
                isActive: true,
                triggerEvent: 'case_created',
                steps: [
                    {
                        title: 'Initial Client Contact',
                        description: 'Contact client to confirm case details and gather initial information',
                        taskType: 'communication',
                        priority: 'high',
                        daysToComplete: 1,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    },
                    {
                        title: 'Request Medical Records',
                        description: 'Send medical records request to all relevant providers',
                        taskType: 'document-request',
                        priority: 'high',
                        daysToComplete: 3,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    },
                    {
                        title: 'Conflict Check',
                        description: 'Perform conflict of interest check',
                        taskType: 'review',
                        priority: 'high',
                        daysToComplete: 2,
                        autoAssign: true,
                        assignToRole: 'attorney'
                    },
                    {
                        title: 'Setup Case File',
                        description: 'Create case folder structure and initial documentation',
                        taskType: 'administrative',
                        priority: 'medium',
                        daysToComplete: 2,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    }
                ]
            },
            {
                name: 'Medical Records Review Workflow',
                description: 'Workflow for reviewing and analyzing medical records',
                type: 'medical-review',
                isTemplate: true,
                isActive: true,
                triggerEvent: 'records_received',
                steps: [
                    {
                        title: 'Index Medical Records',
                        description: 'Create index of all received medical records',
                        taskType: 'indexing',
                        priority: 'high',
                        daysToComplete: 3,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    },
                    {
                        title: 'OCR Processing',
                        description: 'Process records through OCR for searchability',
                        taskType: 'processing',
                        priority: 'medium',
                        daysToComplete: 2,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    },
                    {
                        title: 'Create Medical Timeline',
                        description: 'Build chronological timeline of medical events',
                        taskType: 'timeline',
                        priority: 'high',
                        daysToComplete: 5,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    },
                    {
                        title: 'Initial Case Analysis',
                        description: 'Perform initial analysis and identify key issues',
                        taskType: 'analysis',
                        priority: 'high',
                        daysToComplete: 7,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    }
                ]
            },
            {
                name: 'Case Closure Workflow',
                description: 'Standard workflow for closing a case',
                type: 'case-closure',
                isTemplate: true,
                isActive: true,
                triggerEvent: 'case_closing',
                steps: [
                    {
                        title: 'Final Billing Review',
                        description: 'Review and finalize all billing entries',
                        taskType: 'billing',
                        priority: 'high',
                        daysToComplete: 3,
                        autoAssign: true,
                        assignToRole: 'admin'
                    },
                    {
                        title: 'Archive Case Files',
                        description: 'Archive all case documents and records',
                        taskType: 'administrative',
                        priority: 'medium',
                        daysToComplete: 5,
                        autoAssign: true,
                        assignToRole: 'consultant'
                    },
                    {
                        title: 'Client Exit Survey',
                        description: 'Send client satisfaction survey',
                        taskType: 'communication',
                        priority: 'low',
                        daysToComplete: 7,
                        autoAssign: true,
                        assignToRole: 'admin'
                    }
                ]
            }
        ];

        const createdTemplates = [];

        for (const template of templates) {
            const existing = await Workflow.findOne({ name: template.name, isTemplate: true });
            if (!existing) {
                const workflow = new Workflow(template);
                await workflow.save();
                createdTemplates.push(workflow);
            }
        }

        logger.info(`Created ${createdTemplates.length} default workflow templates`);
        return createdTemplates;
    } catch (error) {
        logger.error('Error creating default templates:', error);
        throw error;
    }
};

/**
 * Get workflow recommendations for a case
 */
exports.getWorkflowRecommendations = async (caseId) => {
    try {
        const caseData = await Case.findById(caseId);
        if (!caseData) {
            throw new Error('Case not found');
        }

        // Get workflows based on case type and status
        const recommendations = await Workflow.find({
            isTemplate: true,
            isActive: true,
            $or: [
                { type: caseData.type },
                { type: 'general' }
            ]
        }).sort({ usageCount: -1 }).limit(5);

        return recommendations;
    } catch (error) {
        logger.error('Error getting workflow recommendations:', error);
        throw error;
    }
};

module.exports = exports;
