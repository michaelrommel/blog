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
	CB_BASE = 'http://localhost:8080';
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
