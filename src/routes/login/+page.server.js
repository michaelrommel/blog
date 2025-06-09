import { fail, redirect } from '@sveltejs/kit';
import {
	deleteSessionTokenCookie,
	invalidateSession
} from '$lib/server/session';

export const ssr = false;

export async function load(event) {
	// if we have already an user, forward to the login page
	// and let it redirect there
	if (event.locals.session !== null && event.locals.user !== null) {
		return {
			user: event.locals.user
		};
	} else {
		// we are not authenticated yet, store the referring url
		const referrer = event.url.searchParams.get('referrer');
		return {
			referrer
		};
	}
}

export const actions = {
	logout: logout
};

async function logout(event) {
	if (event.locals.session === null || event.locals.session === undefined) {
		return fail(401);
	}
	invalidateSession(event.locals.session?.id);
	deleteSessionTokenCookie(event);
	return redirect(302, '/login');
}
