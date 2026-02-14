require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        console.log('🔄 Testing MongoDB connection...');
        console.log('📍 Connection String:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ MongoDB Connected Successfully!');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);

        await mongoose.connection.close();
        console.log('👋 Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

testConnection();
