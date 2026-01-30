
import dns from 'dns';

const domain = 'ac-dpw2c7c-shard-00-00.ryuyx1m.mongodb.net';

console.log(`Resolving A for: ${domain}`);

dns.resolve4(domain, (err, addresses) => {
    if (err) {
        console.error('❌ A Resolution failed:', err);
    } else {
        console.log('✅ A Records found:', addresses);
    }
});
