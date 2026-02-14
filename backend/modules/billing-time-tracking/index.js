// Billing & Time Tracking Module Entry Point

const timeEntryRoutes = require('./routes/timeEntry.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const billingRoutes = require('./routes/billing.routes');
const timeTrackingRoutes = require('./routes/timeTracking.routes');

const billingService = require('./services/billing.service');
const invoiceService = require('./services/invoice.service');
const timeTrackingService = require('./services/timeTracking.service');

module.exports = {
    routes: {
        timeEntry: timeEntryRoutes,
        invoice: invoiceRoutes,
        billing: billingRoutes,
        timeTracking: timeTrackingRoutes
    },
    services: {
        billing: billingService,
        invoice: invoiceService,
        timeTracking: timeTrackingService
    }
};
