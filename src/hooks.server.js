import {
	validateSessionToken,
	// setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$lib/server/session';

export const handle = async ({ event, resolve }) => {
	// console.log(event);
	// console.log(event.getClientAddress());
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.session = null;
		event.locals.user = null;
	} else {
		const { session, user } = await validateSessionToken(token);
		if (session !== null) {
			event.locals.session = session;
			event.locals.user = user;
		} else {
			deleteSessionTokenCookie(event);
			event.locals.session = null;
			event.locals.user = null;
		}
	}

	const response = await resolve(event);
	return response;
};
