const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: [true, 'Please provide appointment date'],
        },
        time: {
            type: String,
            required: [true, 'Please provide appointment time'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time in HH:MM format'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
            default: 'pending',
        },
        notes: {
            type: String,
            maxlength: [500, 'Notes cannot be more than 500 characters'],
        },
        cancelReason: {
            type: String,
            maxlength: [200, 'Cancel reason cannot be more than 200 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent booking in the past
// Prevent booking in the past
appointmentSchema.pre('save', function () {
    const appointmentDateTime = new Date(this.date);
    const now = new Date();
    // Reset time part of now to compare dates correctly if needed, or keeping as is for exact time
    now.setHours(0, 0, 0, 0);

    // Note: this.date in Schema is Date type, but often inputs are YYYY-MM-DD string. 
    // Mongoose casts it to Date object (midnight UTC usually).

    if (this.isNew && appointmentDateTime < now) {
        throw new Error('Cannot book appointments in the past');
    }
});

// Index for faster queries
appointmentSchema.index({ userId: 1, date: -1 });
appointmentSchema.index({ providerId: 1, date: -1 });
appointmentSchema.index({ date: 1, time: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
