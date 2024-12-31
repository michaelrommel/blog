import { json } from '@sveltejs/kit';
import { db } from '$lib/server/keydb';
import { GH_WEBHOOK_SECRET } from '$env/static/private';

let encoder = new TextEncoder();

async function verifySignature(secret, header, payload) {
	let parts = header.split('=');
	let sigHex = parts[1];

	let algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };

	let keyBytes = encoder.encode(secret);
	let extractable = false;
	let key = await crypto.subtle.importKey(
		'raw',
		keyBytes,
		algorithm,
		extractable,
		['sign', 'verify']
	);

	// console.log(key);

	let sigBytes = hexToBytes(sigHex);

	// console.log(sigBytes);

	let dataBytes = encoder.encode(payload);
	let equal = await crypto.subtle.verify(
		algorithm.name,
		key,
		sigBytes,
		dataBytes
	);

	// console.log(equal);

	return equal;
}

function hexToBytes(hex) {
	let len = hex.length / 2;
	let bytes = new Uint8Array(len);

	let index = 0;
	for (let i = 0; i < hex.length; i += 2) {
		let c = hex.slice(i, i + 2);
		let b = parseInt(c, 16);
		bytes[index] = b;
		index += 1;
	}

	return bytes;
}

export async function POST({ request }) {
	const sig = request.headers.get('x-hub-signature-256');
	const payload = await request.text();
	// console.log(sig);
	// console.log(`RequestEvent as text is: >${payload}<`);

	if (await verifySignature(GH_WEBHOOK_SECRET, sig, payload)) {
		const event = JSON.parse(payload);
		await db.publish('github', `push:${event.repository.full_name}`);
		return json({ success: true });
	} else {
		return new Response(null, {
			status: 401
		});
	}
}
