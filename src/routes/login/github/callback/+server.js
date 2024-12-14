import { github, deleteOauthCookies } from '$lib/server/oauth';
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
	const storedState = event.cookies.get('github_oauth_state') ?? null;
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	if (
		storedState === null ||
		code === null ||
		state === null ||
		storedState !== state
	) {
		deleteOauthCookies(event, 'github');
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	let tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch (e) {
		deleteOauthCookies(event, 'github');
		console.log(e);
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	const accessToken = tokens.accessToken();
	let response = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const ghuser = await response.json();

	response = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const ghemails = await response.json();

	const providerId = ghuser.id;
	const email = ghemails.filter((e) => e.primary === true)[0]['email'];
	const name = ghuser.name;
	const image = ghuser.avatar_url;

	let user = null;
	user = await getUserFromProviderId('github', providerId);
	if (user !== null) {
		user = await updateUser(user.id, 'github', providerId, email, name, image);
	} else {
		user = await createUser('github', providerId, email, name, image);
	}

	const sessionToken = generateSessionToken();
	const session = createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	deleteOauthCookies(event, 'github');

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
