import { spotify } from '$lib/server/oauth';
import { createUser, getUserFromProviderId } from '$lib/server/user';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/session';

export async function GET(event) {
	const storedState = event.cookies.get('spotify_oauth_state') ?? null;
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	if (storedState === null || code === null || state === null) {
		return new Response('Please restart the process.', {
			status: 400
		});
	}
	if (storedState !== state) {
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	let tokens;
	try {
		tokens = await spotify.validateAuthorizationCode(code);
	} catch (e) {
		console.log(e);
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	const accessToken = tokens.accessToken();

	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const spuser = await response.json();

	const spotifyId = spuser.id;
	const name = spuser.display_name;
	const image = spuser.images[0].url;
	const email = spuser.email;

	const existingUser = await getUserFromProviderId('spotify', spotifyId);
	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	const user = await createUser('spotify', spotifyId, email, name, image);
	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
