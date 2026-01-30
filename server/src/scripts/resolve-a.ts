
import dns from 'dns';

const domain = 'cluster0.ryuyx1m.mongodb.net';

console.log(`Resolving A for: ${domain}`);

dns.resolve4(domain, (err, addresses) => {
    if (err) {
        console.error('❌ A Resolution failed:', err);
    } else {
        console.log('✅ A Records found:', addresses);
    }
});
