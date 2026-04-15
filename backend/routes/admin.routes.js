const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    activateUser,
    deactivateUser,
    changeUserRole,
    deleteUser,
    getAuditLogs,
    getStats,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// All routes are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/activate', activateUser);
router.put('/users/:id/deactivate', deactivateUser);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);
router.get('/audit-logs', getAuditLogs);
router.get('/stats', getStats);

module.exports = router;
