const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a service name'],
            trim: true,
            maxlength: [100, 'Service name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a service description'],
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
            enum: ['General Practice', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Dentistry', 'Ophthalmology', 'Other'],
        },
        duration: {
            type: Number,
            required: [true, 'Please provide service duration in minutes'],
            min: [15, 'Duration must be at least 15 minutes'],
            max: [480, 'Duration cannot exceed 8 hours'],
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
serviceSchema.index({ providerId: 1, isActive: 1 });
serviceSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
