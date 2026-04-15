const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const testUser = new User({
            name: 'Test User',
            email: 'test@test.com',
            password: 'Test@123',
            phone: '1234567890',
            role: 'user',
        });

        console.log('User object created, attempting to save...');
        await testUser.save();
        console.log('✅ User saved successfully!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        await mongoose.connection.close();
        process.exit(1);
    }
};

test();
