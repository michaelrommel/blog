import { github } from '$lib/server/oauth';
import { generateState } from 'arctic';

export function GET(event) {
	const state = generateState();
	const scopes = ['user:email', 'read:user'];
	const url = github.createAuthorizationURL(state, scopes);

	event.cookies.set('github_oauth_state', state, {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: '/',
		sameSite: 'lax'
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
