const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!');

        // List all databases
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('\nAvailable databases:');
        dbs.databases.forEach(db => console.log(`  - ${db.name}`));

        await mongoose.connection.close();
        console.log('\n✅ Connection test passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Message:', error.message);
        process.exit(1);
    }
};

testConnection();
