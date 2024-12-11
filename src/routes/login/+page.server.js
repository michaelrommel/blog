import { fail, redirect } from '@sveltejs/kit';
import {
	deleteSessionTokenCookie,
	invalidateSession
} from '$lib/server/session';

export async function load(event) {
	if (event.locals.session !== null && event.locals.user !== null) {
		return redirect(302, '/');
	}
	return {
		title: 'Log in',
		description: 'Authenticate to this blog via different providers'
	};
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
