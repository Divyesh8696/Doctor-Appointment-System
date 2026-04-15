const express = require('express');
const router = express.Router();
const {
    getAppointments,
    getAppointment,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    getProviderBookings,
    updateAppointmentStatus,
} = require('../controllers/appointment.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validateAppointment } = require('../middleware/validation');

// User routes
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointment);
router.post('/', protect, validateAppointment, bookAppointment);
router.put('/:id/reschedule', protect, rescheduleAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

// Provider routes
router.get('/provider/bookings', protect, authorize('provider', 'admin'), getProviderBookings);
router.put('/:id/status', protect, authorize('provider', 'admin'), updateAppointmentStatus);

module.exports = router;
