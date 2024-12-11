import { Redis } from 'ioredis';

function reconnect() {
	console.log('reconnecting KV store');
	db.connect();
}

const db = new Redis('192.168.30.1');

db.on('error', function (e) {
	console.log(`KV store error: ${e.message}`);
});

db.on('end', function (e) {
	console.log(`KV store end: ${e.message}`);
	reconnect();
});

export { db, reconnect };
