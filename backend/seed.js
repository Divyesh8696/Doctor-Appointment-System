const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Service.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        console.log('Creating admin...');
        const admin = new User({
            name: 'Admin User',
            email: 'admin@hospital.com',
            password: 'Admin@123',
            phone: '1234567890',
            role: 'admin',
        });
        await admin.save();
        console.log('✅ Admin created');

        // Create doctor 1
        console.log('Creating doctor 1...');
        const doctor1 = new User({
            name: 'Dr. Sarah Johnson',
            email: 'sarah@hospital.com',
            password: 'Doctor@123',
            phone: '9876543210',
            role: 'provider',
        });
        await doctor1.save();
        console.log('✅ Doctor 1 created');

        // Create doctor 2
        console.log('Creating doctor 2...');
        const doctor2 = new User({
            name: 'Dr. Michael Chen',
            email: 'michael@hospital.com',
            password: 'Doctor@123',
            phone: '9876543211',
            role: 'provider',
        });
        await doctor2.save();
        console.log('✅ Doctor 2 created');

        // Create doctor 3
        console.log('Creating doctor 3...');
        const doctor3 = new User({
            name: 'Dr. Emily Williams',
            email: 'emily@hospital.com',
            password: 'Doctor@123',
            phone: '9876543212',
            role: 'provider',
        });
        await doctor3.save();
        console.log('✅ Doctor 3 created');

        // Create patient 1
        console.log('Creating patient 1...');
        const patient1 = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Patient@123',
            phone: '5551234567',
            role: 'user',
        });
        await patient1.save();
        console.log('✅ Patient 1 created');

        // Create patient 2
        console.log('Creating patient 2...');
        const patient2 = new User({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'Patient@123',
            phone: '5551234568',
            role: 'user',
        });
        await patient2.save();
        console.log('✅ Patient 2 created');

        // Create services
        console.log('Creating services...');
        const services = [
            {
                name: 'General Health Checkup',
                description: 'Comprehensive health examination including vital signs, physical examination, and basic lab tests.',
                category: 'General Practice',
                duration: 45,
                providerId: doctor1._id,
            },
            {
                name: 'Cardiac Consultation',
                description: 'Expert consultation for heart-related issues, ECG, and cardiovascular assessment.',
                category: 'Cardiology',
                duration: 60,
                providerId: doctor2._id,
            },
            {
                name: 'Skin Consultation',
                description: 'Dermatological examination for skin conditions, acne, rashes, and cosmetic concerns.',
                category: 'Dermatology',
                duration: 30,
                providerId: doctor3._id,
            },
            {
                name: 'Pediatric Checkup',
                description: 'Child health examination, growth monitoring, and vaccination consultation.',
                category: 'Pediatrics',
                duration: 40,
                providerId: doctor1._id,
            },
            {
                name: 'Dental Cleaning',
                description: 'Professional teeth cleaning, oral examination, and dental hygiene consultation.',
                category: 'Dentistry',
                duration: 45,
                providerId: doctor2._id,
            },
            {
                name: 'Eye Examination',
                description: 'Complete eye checkup, vision testing, and prescription for glasses if needed.',
                category: 'Ophthalmology',
                duration: 30,
                providerId: doctor3._id,
            },
            {
                name: 'Joint & Bone Consultation',
                description: 'Orthopedic consultation for bone, joint, and muscle-related issues.',
                category: 'Orthopedics',
                duration: 50,
                providerId: doctor1._id,
            },
        ];

        await Service.insertMany(services);
        console.log('✅ Services created');

        console.log('\n========================================');
        console.log('🎉 Database seeded successfully!');
        console.log('========================================\n');
        console.log('📝 Test Credentials:\n');
        console.log('Admin:');
        console.log('  Email: admin@hospital.com');
        console.log('  Password: Admin@123\n');
        console.log('Doctors:');
        console.log('  Email: sarah@hospital.com | Password: Doctor@123');
        console.log('  Email: michael@hospital.com | Password: Doctor@123');
        console.log('  Email: emily@hospital.com | Password: Doctor@123\n');
        console.log('Patients:');
        console.log('  Email: john@example.com | Password: Patient@123');
        console.log('  Email: jane@example.com | Password: Patient@123\n');
        console.log('========================================\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:');
        console.error('Message:', error.message);
        if (error.errors) {
            console.error('Validation errors:');
            Object.keys(error.errors).forEach(key => {
                console.error(`  - ${key}: ${error.errors[key].message}`);
            });
        }
        console.error('\nStack:', error.stack);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedData();
