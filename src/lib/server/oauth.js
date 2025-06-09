import { GitHub, Google, Spotify } from 'arctic';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET
} from '$env/static/private';

let CB_BASE = null;
if (
	import.meta.env.MODE === 'development' ||
	import.meta.env.MODE === 'staging'
) {
	CB_BASE = 'https://dev.michaelrommel.com';
} else {
	CB_BASE = 'https://michaelrommel.com';
}

export const github = new GitHub(
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	`${CB_BASE}/login/github/callback`
);

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`${CB_BASE}/login/google/callback`
);

export const spotify = new Spotify(
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	`${CB_BASE}/login/spotify/callback`
);

export function deleteOauthCookies(event, provider) {
	event.cookies.set(`${provider}_oauth_state`, '', {
		httpOnly: true,
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
	event.cookies.set(`${provider}_code_verifier`, '', {
		httpOnly: true,
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}
