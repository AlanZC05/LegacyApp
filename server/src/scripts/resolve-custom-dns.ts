
import dns from 'dns';

try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log('Set custom DNS servers: 8.8.8.8, 1.1.1.1');
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}

const domain = 'cluster0.ryuyx1m.mongodb.net'; // SRV domain or A domain

console.log(`Resolving SRV for: _mongodb._tcp.${domain}`);

dns.resolveSrv(`_mongodb._tcp.${domain}`, (err, addresses) => {
    if (err) {
        console.error('❌ SRV Resolution failed:', err);
    } else {
        console.log('✅ SRV Records found:', addresses);
    }
});
