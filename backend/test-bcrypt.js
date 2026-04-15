const bcrypt = require('bcryptjs');

const test = async () => {
    try {
        console.log('Testing bcrypt...');
        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated:', salt);

        const hash = await bcrypt.hash('Test@123', salt);
        console.log('Hash generated:', hash);

        const isMatch = await bcrypt.compare('Test@123', hash);
        console.log('Password match:', isMatch);

        console.log('✅ bcrypt is working!');
    } catch (error) {
        console.error('❌ bcrypt error:', error.message);
    }
};

test();
