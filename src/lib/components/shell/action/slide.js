import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

/** An action for tweened transitions with global transformations. */
export const slide = (node, params) => {
	let center = params?.center ?? [0, 0];
	let zoom = params?.zoom ?? 1;

	const pos = { x: params?.x ?? 0, y: params?.y ?? 0 };
	const spos = tweened(pos, { duration: 150, easing: cubicOut });

	const disposeSub = spos.subscribe((pos) => {
		node.style.transform = `scale(${(zoom * 100).toFixed(3)}%)
      translate3d(${pos.x - center[0]}px, ${pos.y - center[1]}px, 0)`;
	});

	return {
		update(params) {
			center = params?.center ?? [0, 0];
			zoom = params?.zoom ?? 1;
			const pos = { x: params?.x ?? 0, y: params?.y ?? 0 };
			spos.set(pos, { duration: params.immediate ? 0 : 150 });
		},

		destroy() {
			disposeSub();
			node.style.transform = '';
		}
	};
};
