import { spotify, deleteOauthCookies } from '$lib/server/oauth';
import {
	createUser,
	updateUser,
	getUserFromProviderId
} from '$lib/server/user';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/session';

export async function GET(event) {
	const storedState = event.cookies.get('spotify_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('spotify_code_verifier') ?? null;
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	if (
		storedState === null ||
		codeVerifier === null ||
		code === null ||
		state === null ||
		storedState !== state
	) {
		deleteOauthCookies(event, 'spotify');
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	let tokens;
	try {
		tokens = await spotify.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		deleteOauthCookies(event, 'spotify');
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

	const providerId = spuser.id;
	const name = spuser.display_name;
	const image = spuser.images[0].url;
	const email = spuser.email;

	let user = null;
	user = await getUserFromProviderId('spotify', providerId);
	if (user !== null) {
		user = await updateUser(user.id, 'spotify', providerId, email, name, image);
	} else {
		user = await createUser('spotify', providerId, email, name, image);
	}

	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	deleteOauthCookies(event, 'spotify');

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/login'
		}
	});
}
