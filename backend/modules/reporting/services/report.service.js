const Report = require('../../../models/Report.model');
const Case = require('../../../models/Case.model');
const Timeline = require('../../../models/Timeline.model');
const CaseAnalysis = require('../../../models/CaseAnalysis.model');
const pdfGenerator = require('./pdfGenerator.service');
const wordGenerator = require('./wordGenerator.service');

exports.generateReportAsync = async (reportId, type, caseId, template, format, parameters) => {
    try {
        const caseData = await Case.findById(caseId)
            .populate('client')
            .populate('lawFirm')
            .populate('assignedConsultant');

        if (!caseData) {
            await Report.findByIdAndUpdate(reportId, {
                status: 'failed',
                error: 'Case not found'
            });
            return;
        }

        let content;
        let fileUrl;

        switch (template) {
            case 'attorney-summary':
                content = await generateAttorneySummary(caseData);
                break;
            case 'chronology':
                content = await generateChronology(caseData);
                break;
            case 'trial-brief':
                content = await generateTrialBrief(caseData);
                break;
            default:
                content = await generateGenericReport(caseData, type);
        }

        if (format === 'pdf') {
            fileUrl = await pdfGenerator.generatePDF(content, reportId);
        } else if (format === 'docx') {
            fileUrl = await wordGenerator.generateWord(content, reportId);
        }

        await Report.findByIdAndUpdate(reportId, {
            status: 'completed',
            content,
            fileUrl,
            fileSize: 0
        });
    } catch (error) {
        console.error('Report generation error:', error);
        await Report.findByIdAndUpdate(reportId, {
            status: 'failed',
            error: error.message
        });
    }
};

exports.generateCustomReportAsync = async (reportId, caseId, sections, format) => {
    try {
        const caseData = await Case.findById(caseId)
            .populate('client')
            .populate('lawFirm');

        const content = await buildCustomReport(caseData, sections);

        let fileUrl;
        if (format === 'pdf') {
            fileUrl = await pdfGenerator.generatePDF(content, reportId);
        } else if (format === 'docx') {
            fileUrl = await wordGenerator.generateWord(content, reportId);
        }

        await Report.findByIdAndUpdate(reportId, {
            status: 'completed',
            content,
            fileUrl
        });
    } catch (error) {
        await Report.findByIdAndUpdate(reportId, {
            status: 'failed',
            error: error.message
        });
    }
};

async function generateAttorneySummary(caseData) {
    const timeline = await Timeline.findOne({ case: caseData._id });
    const analysis = await CaseAnalysis.findOne({ case: caseData._id });

    return {
        title: 'Attorney Summary Report',
        caseInfo: {
            caseNumber: caseData.caseNumber,
            caseName: caseData.caseName,
            client: caseData.client?.name,
            lawFirm: caseData.lawFirm?.name
        },
        summary: caseData.description,
        timeline: timeline?.events || [],
        analysis: analysis?.findings || [],
        recommendations: analysis?.recommendations || []
    };
}

async function generateChronology(caseData) {
    const timeline = await Timeline.findOne({ case: caseData._id }).populate('events.citations');

    return {
        title: 'Medical Chronology',
        caseInfo: {
            caseNumber: caseData.caseNumber,
            caseName: caseData.caseName
        },
        events: timeline?.events || []
    };
}

async function generateTrialBrief(caseData) {
    const analysis = await CaseAnalysis.findOne({ case: caseData._id });

    return {
        title: 'Trial Brief',
        caseInfo: {
            caseNumber: caseData.caseNumber,
            caseName: caseData.caseName
        },
        facts: caseData.description,
        standardsOfCare: analysis?.standardsOfCare || [],
        deviations: analysis?.deviations || [],
        damages: caseData.damages || []
    };
}

async function generateGenericReport(caseData, type) {
    return {
        title: `${type} Report`,
        caseInfo: {
            caseNumber: caseData.caseNumber,
            caseName: caseData.caseName
        },
        content: caseData
    };
}

async function buildCustomReport(caseData, sections) {
    const content = {
        title: 'Custom Report',
        caseInfo: {
            caseNumber: caseData.caseNumber,
            caseName: caseData.caseName
        },
        sections: []
    };

    for (const section of sections) {
        content.sections.push({
            title: section.title,
            content: section.content
        });
    }

    return content;
}
