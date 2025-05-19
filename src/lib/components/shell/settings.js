import { persisted } from 'svelte-persisted-store';
import themes, { defaultTheme } from './ui/themes';
import { derived } from 'svelte/store';

const storedSettings = persisted('sshx-settings-store', {});

/** A persisted store for settings of the current user. */
export const settings = derived(storedSettings, ($storedSettings) => {
	console.log('settings: ');
	console.log($storedSettings);
	// Do some validation on all of the stored settings.
	const name = $storedSettings.name ?? '';

	let theme = $storedSettings.theme;
	if (!theme || !Object.hasOwn(themes, theme)) {
		theme = defaultTheme;
	}

	let scrollback = $storedSettings.scrollback;
	if (typeof scrollback !== 'number' || scrollback < 0) {
		scrollback = 5000;
	}

	return {
		name,
		theme,
		scrollback
	};
});

export function updateSettings(values) {
	storedSettings.update((settings) => ({ ...settings, ...values }));
}
