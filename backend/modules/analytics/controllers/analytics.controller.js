const Case = require('../../../models/Case.model');
const TimeEntry = require('../../../models/TimeEntry.model');
const Invoice = require('../../../models/Invoice.model');
const Task = require('../../../models/Task.model');
const Client = require('../../../models/Client.model');
const analyticsService = require('../services/analytics.service');

exports.getCaseAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate, status, caseType } = req.query;

        const analytics = await analyticsService.getCaseAnalytics({
            startDate,
            endDate,
            status,
            caseType
        });

        res.json(analytics);
    } catch (error) {
        next(error);
    }
};

exports.getRevenueAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate, groupBy } = req.query;

        const analytics = await analyticsService.getRevenueAnalytics({
            startDate,
            endDate,
            groupBy: groupBy || 'month'
        });

        res.json(analytics);
    } catch (error) {
        next(error);
    }
};

exports.getWorkloadAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate, userId } = req.query;

        const analytics = await analyticsService.getWorkloadAnalytics({
            startDate,
            endDate,
            userId
        });

        res.json(analytics);
    } catch (error) {
        next(error);
    }
};

exports.getReferralAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const analytics = await analyticsService.getReferralAnalytics({
            startDate,
            endDate
        });

        res.json(analytics);
    } catch (error) {
        next(error);
    }
};

exports.getPerformanceMetrics = async (req, res, next) => {
    try {
        const { startDate, endDate, userId } = req.query;

        const metrics = await analyticsService.getPerformanceMetrics({
            startDate,
            endDate,
            userId
        });

        res.json(metrics);
    } catch (error) {
        next(error);
    }
};

exports.exportAnalytics = async (req, res, next) => {
    try {
        const { type, format, startDate, endDate } = req.query;

        const data = await analyticsService.exportAnalytics({
            type,
            format: format || 'csv',
            startDate,
            endDate
        });

        res.json({
            message: 'Analytics export ready',
            data
        });
    } catch (error) {
        next(error);
    }
};
