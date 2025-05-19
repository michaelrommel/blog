/** @file Provides a simple, native toast library. */

import { writable } from 'svelte/store';

export const toastStore = writable([]);

export function makeToast(toast, duration = 3000) {
	const obj = Object.assign({ expires: Date.now() + duration }, toast);
	toastStore.update(($toasts) => [...$toasts, obj]);
}
