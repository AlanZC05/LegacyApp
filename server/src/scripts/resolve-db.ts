
import dns from 'dns';

const domain = '_mongodb._tcp.cluster0.ryuyx1m.mongodb.net';

console.log(`Resolving SRV for: ${domain}`);

dns.resolveSrv(domain, (err, addresses) => {
    if (err) {
        console.error('❌ SRV Resolution failed:', err);
    } else {
        console.log('✅ SRV Records found:');
        console.log(JSON.stringify(addresses, null, 2));
    }
});
