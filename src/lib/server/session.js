import { db } from '$lib/server/keydb';
import { getUserFromId } from '$lib/server/user';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
const { randomFillSync, createHash } = await import('node:crypto');
const sessionCache = {};

export function generateSessionToken() {
	const tokenBytes = new Uint8Array(20);
	randomFillSync(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

function encodeToken(token) {
	const hash = createHash('sha256');
	hash.write(token);
	hash.end();
	const val = hash.read();
	const encodedToken = encodeHexLowerCase(val);
	return encodedToken;
}

export async function createSession(token, userId) {
	const sessionId = encodeToken(token);
	const session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await db.set(
		`blog:session:${session.id}`,
		JSON.stringify({
			id: session.id,
			userId: session.userId,
			expiresAt: Math.floor(session.expiresAt / 1000)
		}),
		'EXAT',
		Math.floor(session.expiresAt / 1000)
	);
	sessionCache[`blog:session:${session.id}`] = session;
	return session;
}

export async function validateSessionToken(token) {
	const sessionId = encodeToken(token);
	let result = sessionCache[`blog:session:${sessionId}`] ?? null;
	if (!result) {
		try {
			const item = await db.get(`blog:session:${sessionId}`);
			result = JSON.parse(item);
			sessionCache[`blog:session:${result.id}`] = result;
		} catch (e) {
			console.log(`KV store error getting session: ${e.message}`);
		}
		// } else {
		// 	console.log('Found session in cache');
	}
	if (result === null) {
		return { session: null, user: null };
	}
	const session = {
		id: result.id,
		userId: result.userId,
		expiresAt: new Date(result.expiresAt * 1000)
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await invalidateSession(sessionId);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		await createSession(token, session.userId);
	}
	const user = await getUserFromId(session.userId);
	return { session, user };
}

export async function invalidateSession(sessionId) {
	await db.del(`blog:session:${sessionId}`);
	delete sessionCache[`blog:session:${sessionId}`];
}

export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event) {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}
