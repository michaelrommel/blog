import { google } from '$lib/server/oauth';
import { generateCodeVerifier, generateState } from 'arctic';

export function GET(event) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const scopes = ['openid', 'profile', 'email'];
	const url = google.createAuthorizationURL(state, codeVerifier, scopes);

	event.cookies.set('google_oauth_state', state, {
		httpOnly: true,
		maxAge: 60 * 10,
		secure: import.meta.env.PROD,
		path: '/',
		sameSite: 'lax'
	});
	event.cookies.set('google_code_verifier', codeVerifier, {
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
