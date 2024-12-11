import { github } from '$lib/server/oauth';
import { createUser, getUserFromProviderId } from '$lib/server/user';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/session';

export async function GET(event) {
	const storedState = event.cookies.get('github_oauth_state') ?? null;
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
		tokens = await github.validateAuthorizationCode(code);
	} catch {
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
	// console.log(`Github user is ${JSON.stringify(ghuser, null, 4)}`);

	response = await fetch('https://api.github.com/user/emails', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	const ghemails = await response.json();
	// console.log(`Github user emails is ${JSON.stringify(ghemails, null, 4)}`);

	const githubId = ghuser.id;
	const email = ghemails.filter((e) => e.primary === true)[0]['email'];
	const name = ghuser.name;
	const image = ghuser.avatar_url;

	const existingUser = await getUserFromProviderId('github', githubId);
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

	const user = await createUser('github', githubId, email, name, image);
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
