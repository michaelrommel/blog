import { Redis } from 'ioredis';

function reconnect() {
	console.log('reconnecting KV store');
	db.connect();
}

const db = new Redis('127.0.0.1');
//const db = new Redis('192.168.30.1');

db.on('error', function (e) {
	console.log(`KV store error: ${e.message}`);
});

db.on('end', function () {
	console.log(`KV store end`);
	// reconnect();
});

process.on('sveltekit:shutdown', async (reason) => {
	console.log(`sveltekit shutdown: ${reason}`);
	// if (reason === 'SIGTERM' || reason === 'SIGINT') {
	await db.quit();
	// }
});

export { db, reconnect };
