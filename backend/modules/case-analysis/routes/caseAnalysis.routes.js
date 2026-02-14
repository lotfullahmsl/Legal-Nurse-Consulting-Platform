const express = require('express');
const router = express.Router();
const caseAnalysisController = require('../controllers/caseAnalysis.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');

// Case Analysis routes
router.get('/:caseId', protect, caseAnalysisController.getAnalysis);
router.post('/',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    caseAnalysisController.upsertAnalysis
);

// Damages routes
router.get('/damages/:caseId', protect, caseAnalysisController.getDamages);
router.post('/damages',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    caseAnalysisController.addDamage
);
router.put('/damages/:id',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    caseAnalysisController.updateDamage
);
router.delete('/damages/:id',
    protect,
    authorize('admin'),
    caseAnalysisController.deleteDamage
);

module.exports = router;
