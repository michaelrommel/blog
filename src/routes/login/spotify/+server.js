import { spotify } from '$lib/server/oauth';
import { generateState } from 'arctic';

export function GET(event) {
	const state = generateState();
	const scopes = ['user-read-email', 'user-read-private'];
	const url = spotify.createAuthorizationURL(state, scopes);

	event.cookies.set('spotify_oauth_state', state, {
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
