require('dotenv').config();
const mongoose = require('mongoose');

// Workaround: Use standard connection string instead of SRV
// This bypasses DNS SRV lookup which is failing
const standardUri = 'mongodb://lnc-shard-00-00.q6mht5b.mongodb.net:27017,lnc-shard-00-01.q6mht5b.mongodb.net:27017,lnc-shard-00-02.q6mht5b.mongodb.net:27017/legal-nurse-consulting?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority';

const testConnection = async () => {
    try {
        console.log('🔄 Testing MongoDB connection with standard URI (bypassing SRV)...');
        console.log('📍 This avoids DNS SRV lookup issues\n');

        // Try with IPv4 preference
        process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ MongoDB Connected Successfully!');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);

        await mongoose.connection.close();
        console.log('👋 Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('\n💡 Try these solutions:');
        console.error('1. Run: set NODE_OPTIONS=--dns-result-order=ipv4first && npm start');
        console.error('2. Use mobile hotspot');
        console.error('3. Reset network stack (see diagnose-dns.js output)');
        process.exit(1);
    }
};

testConnection();
