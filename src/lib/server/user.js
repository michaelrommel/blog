import { db } from '$lib/server/keydb';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdefghjkmnpqrstuvwxyz', 10);
const userCache = {};

export async function createUser(provider, providerid, email, name, image) {
	const id = nanoid();
	const user = {
		id,
		provider,
		providerid,
		name,
		email,
		image
	};
	try {
		await updateUser(id, provider, providerid, email, name, image);
		await db.set(`blog:user:${id}`, `${provider}:${providerid}`);
		userCache[`blog:user:${id}`] = `${provider}:${providerid}`;
	} catch {
		throw new Error('KV store write error');
	}
	return user;
}

export async function updateUser(id, provider, providerid, email, name, image) {
	const user = {
		id,
		provider,
		providerid,
		name,
		email,
		image
	};
	try {
		await db.hset(`blog:user:${provider}:${providerid}`, user);
		userCache[`blog:user:${provider}:${providerid}`] = user;
	} catch {
		throw new Error('KV store write error');
	}
	return user;
}

export async function getUserFromProviderId(provider, providerid) {
	let user = userCache[`blog:user:${provider}:${providerid}`] ?? null;
	if (!user) {
		user = await db.hgetall(`blog:user:${provider}:${providerid}`);
		if (Object.keys(user).length === 0) {
			return null;
		}
		userCache[`blog:user:${provider}:${providerid}`] = user;
		// } else {
		// 	console.log('Found user in cache');
	}
	return user;
}

export async function getUserFromId(id) {
	let fullProviderId = userCache[`blog:user:${id}`] ?? null;
	if (!fullProviderId) {
		fullProviderId = await db.get(`blog:user:${id}`);
		if (fullProviderId === null) {
			return null;
		}
		userCache[`blog:user:${id}`] = `${fullProviderId}`;
	}
	const [provider, providerid] = fullProviderId.split(':');
	const user = await getUserFromProviderId(provider, providerid);
	return user;
}

export async function userIsFriend(id) {
	return (await db.sismember('blog:friends', id)) === 1;
}
