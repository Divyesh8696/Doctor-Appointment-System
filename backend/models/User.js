const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password must be at least 8 characters'],
            validate: {
                validator: function (v) {
                    // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
                },
                message: props => 'Password must contain at least one uppercase, one lowercase, one number, and one special character',
            },
            select: false,
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
            trim: true,
            validate: {
                validator: function (v) {
                    // Simple phone validation (10-15 digits)
                    return /^\+?[1-9]\d{9,14}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`,
            },
        },
        role: {
            type: String,
            enum: ['user', 'provider', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // DPDP Act - Minimum Personal Data & Consent
        consent: {
            type: Boolean,
            required: [true, 'Consent is required for data collection'],
            default: false,
        },
        consentDate: {
            type: Date,
        },
        // Security Requirements - Login Throttling
        loginAttempts: {
            type: Number,
            required: true,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },
        hospitalName: {
            type: String,
            trim: true,
            maxlength: [100, 'Hospital name cannot be more than 100 characters'],
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Pre-save hook to hash password explicitly before persisting to database.
 * Uses bcrypt with 10 salt rounds for security.
 */
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error('Bcrypt Error:', error);
        throw error;
    }
});

/**
 * Instance method to validate password during login.
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
