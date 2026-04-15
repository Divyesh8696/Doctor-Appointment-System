const express = require('express');
const router = express.Router();
const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    getMyServices,
} = require('../controllers/service.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validateService } = require('../middleware/validation');

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Protected routes - Provider only
router.post('/', protect, authorize('provider', 'admin'), validateService, createService);
router.put('/:id', protect, authorize('provider', 'admin'), validateService, updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteService);
router.get('/provider/my-services', protect, authorize('provider', 'admin'), getMyServices);

module.exports = router;
