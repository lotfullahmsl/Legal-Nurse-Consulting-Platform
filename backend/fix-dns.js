// Force Node.js to use system DNS resolver
const dns = require('dns');

// Set DNS to use system resolver instead of c-ares
dns.setDefaultResultOrder('verbatim');

console.log('Current DNS servers:', dns.getServers());
console.log('\n💡 If DNS servers list is empty or wrong, that\'s your problem!\n');

// Try to manually set DNS servers (Google DNS)
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    console.log('✅ Set DNS servers to: 8.8.8.8, 8.8.4.4, 1.1.1.1');
    console.log('New DNS servers:', dns.getServers());
} catch (error) {
    console.error('❌ Failed to set DNS servers:', error.message);
}

// Test DNS resolution
const testHosts = ['google.com', 'mongodb.net', 'lnc.q6mht5b.mongodb.net'];

console.log('\n🔍 Testing DNS resolution with new settings...\n');

testHosts.forEach(host => {
    dns.resolve4(host, (err, addresses) => {
        if (err) {
            console.log(`❌ ${host}: ${err.message}`);
        } else {
            console.log(`✅ ${host}: ${addresses.join(', ')}`);
        }
    });
});

setTimeout(() => {
    console.log('\n💡 SOLUTIONS:');
    console.log('1. Check Windows Firewall - allow Node.js');
    console.log('2. Check antivirus - whitelist Node.js');
    console.log('3. Change Windows DNS to 8.8.8.8 and 8.8.4.4');
    console.log('4. Reinstall Node.js from official website');
    console.log('5. Use mobile hotspot as temporary workaround');
    process.exit(0);
}, 2000);
