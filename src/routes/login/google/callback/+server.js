import { page } from '$app/state';
import { google, deleteOauthCookies } from '$lib/server/oauth';
import { ObjectParser } from '@pilcrowjs/object-parser';
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
import { decodeIdToken } from 'arctic';

export async function GET(event) {
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	if (
		storedState === null ||
		codeVerifier === null ||
		code === null ||
		state === null ||
		storedState !== state
	) {
		deleteOauthCookies(event, 'google');
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	let tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		deleteOauthCookies(event, 'google');
		console.log(e);
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken());
	const claimsParser = new ObjectParser(claims);

	const providerId = claimsParser.getString('sub');
	const name = claimsParser.getString('name');
	const image = claimsParser.getString('picture');
	const email = claimsParser.getString('email');

	let user = null;
	user = await getUserFromProviderId('google', providerId);
	if (user !== null) {
		user = await updateUser(user.id, 'google', providerId, email, name, image);
	} else {
		user = await createUser('google', providerId, email, name, image);
	}

	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	deleteOauthCookies(event, 'google');

	return new Response(null, {
		status: 302,
		headers: {
			Location: page.url.pathname
		}
	});
}
