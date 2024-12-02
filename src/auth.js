import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import Google from '@auth/sveltekit/providers/google';
import Spotify from '@auth/sveltekit/providers/spotify';

export const { handle, signIn, signOut } = SvelteKitAuth({
	trustHost: true,
	providers: [GitHub, Google, Spotify]
});
