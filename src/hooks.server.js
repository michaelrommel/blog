import {
	validateSessionToken,
	// setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$lib/server/session';
import { userIsFriend } from '$lib/server/user';

export const handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.session = null;
		event.locals.user = null;
	} else {
		const { session, user } = await validateSessionToken(token);
		if (session !== null) {
			// setSessionTokenCookie(event, token, session.expiresAt);
			const isfriend = await userIsFriend(user.id);
			user.isfriend = isfriend;
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
