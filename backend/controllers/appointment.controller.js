const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { ErrorResponse } = require('../utils/errorHandler');
const { createAuditLog } = require('../utils/auditLogger');

// @desc    Get user's appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = { userId: req.user._id };

        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .populate('serviceId', 'name description duration category')
            .populate('providerId', 'name email phone')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('serviceId', 'name description duration category')
            .populate('providerId', 'name email phone')
            .populate('userId', 'name email phone');

        if (!appointment) {
            return next(new ErrorResponse('Appointment not found', 404));
        }

        // Check ownership
        if (
            appointment.userId._id.toString() !== req.user._id.toString() &&
            appointment.providerId._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return next(new ErrorResponse('Not authorized to view this appointment', 403));
        }

        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res, next) => {
    try {
        const { serviceId, date, time, notes } = req.body;

        // Role verify - Only 'user' can book
        if (req.user.role !== 'user') {
            return next(new ErrorResponse('Only patients can book appointments', 403));
        }

        // Check working hours (9:00 - 17:00)
        const [hour, minute] = time.split(':').map(Number);
        if (hour < 9 || hour >= 17) {
            return next(new ErrorResponse('Appointments are only available between 9:00 AM and 5:00 PM', 400));
        }

        // Check if service exists
        const service = await Service.findById(serviceId);

        if (!service) {
            return next(new ErrorResponse('Service not found', 404));
        }

        if (!service.isActive) {
            return next(new ErrorResponse('Service is not available', 400));
        }

        // Check for existing appointment at the same time
        const existingAppointment = await Appointment.findOne({
            providerId: service.providerId,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] },
        });

        if (existingAppointment) {
            return next(new ErrorResponse('Time slot is already booked', 400));
        }

        // Create appointment
        // Create appointment
        const appointment = new Appointment({
            userId: req.user._id,
            serviceId,
            providerId: service.providerId,
            date,
            time,
            notes,
            status: 'pending',
        });
        await appointment.save();

        // Create audit log
        await createAuditLog(
            req.user._id,
            'APPOINTMENT_BOOK',
            'Appointment',
            appointment._id,
            `Appointment booked for ${date} at ${time}`,
            req.ip
        );

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('serviceId', 'name description duration')
            .populate('providerId', 'name email phone');

        res.status(201).json({
            success: true,
            data: populatedAppointment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
const rescheduleAppointment = async (req, res, next) => {
    try {
        const { date, time } = req.body;

        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return next(new ErrorResponse('Appointment not found', 404));
        }

        // Check ownership
        if (
            appointment.userId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return next(new ErrorResponse('Not authorized to reschedule this appointment', 403));
        }

        // Check if appointment can be rescheduled
        if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return next(new ErrorResponse('Cannot reschedule completed or cancelled appointments', 400));
        }

        // FR7 S3 - 2-hour rule (Cancellation/Changes allowed up to 2 hours before)
        const appointmentDate = new Date(appointment.date);
        const [appHour, appMinute] = appointment.time.split(':').map(Number);
        appointmentDate.setHours(appHour, appMinute, 0, 0);

        const now = new Date();
        const diffInMs = appointmentDate.getTime() - now.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 2 && diffInHours >= 0 && req.user.role !== 'admin') {
            return next(new ErrorResponse('Appointments can only be rescheduled up to 2 hours before the start time', 400));
        }

        // Check for conflicts
        const existingAppointment = await Appointment.findOne({
            _id: { $ne: appointment._id },
            providerId: appointment.providerId,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] },
        });

        if (existingAppointment) {
            return next(new ErrorResponse('Time slot is already booked', 400));
        }

        appointment.date = date;
        appointment.time = time;
        await appointment.save();

        // Create audit log
        await createAuditLog(
            req.user._id,
            'APPOINTMENT_RESCHEDULE',
            'Appointment',
            appointment._id,
            `Appointment rescheduled to ${date} at ${time}`,
            req.ip
        );

        appointment = await Appointment.findById(appointment._id)
            .populate('serviceId', 'name description duration')
            .populate('providerId', 'name email phone');

        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res, next) => {
    try {
        const { cancelReason } = req.body;

        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return next(new ErrorResponse('Appointment not found', 404));
        }

        // Check ownership
        if (
            appointment.userId.toString() !== req.user._id.toString() &&
            appointment.providerId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return next(new ErrorResponse('Not authorized to cancel this appointment', 403));
        }

        // Check if appointment can be cancelled
        if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return next(new ErrorResponse('Appointment is already completed or cancelled', 400));
        }

        // FR7 S3 - 2-hour rule
        const appointmentDate = new Date(appointment.date);
        const [appHour, appMinute] = appointment.time.split(':').map(Number);
        appointmentDate.setHours(appHour, appMinute, 0, 0);

        const now = new Date();
        const diffInMs = appointmentDate.getTime() - now.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 2 && diffInHours >= 0 && req.user.role !== 'admin') {
            return next(new ErrorResponse('Appointments can only be cancelled up to 2 hours before the start time', 400));
        }

        appointment.status = 'cancelled';
        appointment.cancelReason = cancelReason || 'No reason provided';
        await appointment.save();

        // Create audit log
        await createAuditLog(
            req.user._id,
            'APPOINTMENT_CANCEL',
            'Appointment',
            appointment._id,
            `Appointment cancelled: ${cancelReason || 'No reason'}`,
            req.ip
        );

        appointment = await Appointment.findById(appointment._id)
            .populate('serviceId', 'name description duration')
            .populate('providerId', 'name email phone');

        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get provider's bookings
// @route   GET /api/appointments/provider/bookings
// @access  Private (Provider only)
const getProviderBookings = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = { providerId: req.user._id };

        if (status) {
            query.status = status;
        }

        const bookings = await Appointment.find(query)
            .populate('serviceId', 'name description duration')
            .populate('userId', 'name email phone')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status (Approve/Reject)
// @route   PUT /api/appointments/:id/status
// @access  Private (Provider/Admin)
const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return next(new ErrorResponse('Appointment not found', 404));
        }

        // Check if user is the provider of this appointment
        if (
            appointment.providerId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return next(new ErrorResponse('Not authorized to update this appointment', 403));
        }

        // Validate status transition
        if (!['confirmed', 'rejected', 'completed', 'cancelled'].includes(status)) {
            return next(new ErrorResponse('Invalid status', 400));
        }

        appointment.status = status;
        await appointment.save();

        // Audit Log
        await createAuditLog(
            req.user._id,
            'APPOINTMENT_STATUS_UPDATE',
            'Appointment',
            appointment._id,
            `Appointment status changed to ${status}`,
            req.ip
        );

        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAppointments,
    getAppointment,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    getProviderBookings,
    updateAppointmentStatus,
};


