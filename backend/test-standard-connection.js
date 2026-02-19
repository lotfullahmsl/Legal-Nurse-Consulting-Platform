require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns').promises;

const testDNS = async () => {
    console.log('🔍 Testing DNS Resolution...\n');

    const hosts = [
        'lnc.q6mht5b.mongodb.net',
        'cluster0.ssjkxni.mongodb.net',
        'google.com',
        '_mongodb._tcp.lnc.q6mht5b.mongodb.net',
        '_mongodb._tcp.cluster0.ssjkxni.mongodb.net'
    ];

    for (const host of hosts) {
        try {
            console.log(`Testing: ${host}`);
            const addresses = await dns.resolve(host);
            console.log(`✅ Resolved: ${addresses.join(', ')}\n`);
        } catch (error) {
            console.log(`❌ Failed: ${error.message}\n`);
        }
    }

    // Try SRV lookup
    console.log('🔍 Testing SRV Records...\n');
    for (const host of ['_mongodb._tcp.lnc.q6mht5b.mongodb.net', '_mongodb._tcp.cluster0.ssjkxni.mongodb.net']) {
        try {
            console.log(`Testing SRV: ${host}`);
            const records = await dns.resolveSrv(host);
            console.log(`✅ SRV Records found: ${records.length}`);
            records.forEach(r => console.log(`   ${r.name}:${r.port}`));
            console.log('');
        } catch (error) {
            console.log(`❌ SRV Failed: ${error.message}\n`);
        }
    }
};

const testStandardConnection = async () => {
    // Try standard connection string (non-SRV) as workaround
    const standardUri = 'mongodb://lotfullahmsl:Muslimwal%402004@lnc-shard-00-00.q6mht5b.mongodb.net:27017,lnc-shard-00-01.q6mht5b.mongodb.net:27017,lnc-shard-00-02.q6mht5b.mongodb.net:27017/legal-nurse-consulting?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority';

    console.log('🔄 Testing Standard MongoDB Connection (non-SRV)...');
    console.log('📍 This bypasses SRV DNS lookup\n');

    try {
        await mongoose.connect(standardUri);
        console.log('✅ Standard Connection Successful!');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        await mongoose.connection.close();
        console.log('\n💡 SOLUTION: Use standard connection string instead of SRV');
    } catch (error) {
        console.error('❌ Standard Connection Failed:', error.message);
        console.log('\n💡 You need to get the standard connection string from MongoDB Atlas');
    }
};

const runTests = async () => {
    await testDNS();
    console.log('\n' + '='.repeat(60) + '\n');
    await testStandardConnection();
    process.exit(0);
};

runTests();
