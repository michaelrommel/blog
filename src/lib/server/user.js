import { db } from '$lib/server/keydb';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghjkmnpqrstuvwxyz', 10);

export async function createUser(provider, providerid, email, name, image) {
	const id = nanoid();
	const user = {
		id,
		providerid,
		name,
		email,
		image
	};
	try {
		await db.hset(`blog:user:${provider}:${providerid}`, user);
		await db.set(`blog:user:${id}`, `${provider}:${providerid}`);
	} catch {
		throw new Error('KV store write error');
	}
	return user;
}

export async function updateUser(id, provider, providerid, email, name, image) {
	const user = {
		id,
		providerid,
		name,
		email,
		image
	};
	try {
		await db.hset(`blog:user:${provider}:${providerid}`, user);
	} catch {
		throw new Error('KV store write error');
	}
	return user;
}

export async function getUserFromProviderId(provider, providerid) {
	const user = await db.hgetall(`blog:user:${provider}:${providerid}`);
	if (Object.keys(user).length === 0) {
		return null;
	}
	return user;
}

export async function getUserFromId(id) {
	const fullProviderId = await db.get(`blog:user:${id}`);
	if (fullProviderId === null) {
		return null;
	}
	const user = await db.hgetall(`blog:user:${fullProviderId}`);
	if (user === null) {
		return null;
	}
	return user;
}
