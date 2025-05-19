const ISECT_W = 752;
const ISECT_H = 515;
const ISECT_PAD = 16;

/** Choose a position for a new terminal that does not intersect existing ones. */
export function arrangeNewTerminal(existing) {
	if (existing.length === 0) {
		return { x: 0, y: 0 };
	}

	const startX = 100 * (Math.random() - 0.5);
	const startY = 60 * (Math.random() - 0.5);

	for (let i = 0; ; i++) {
		const t = 1.94161103872 * i;
		const x = Math.round(startX + 8 * i * Math.cos(t));
		const y = Math.round(startY + 8 * i * Math.sin(t));
		let ok = true;
		for (const box of existing) {
			if (
				isect(x, x + ISECT_W, box.x, box.x + box.width) &&
				isect(y, y + ISECT_H, box.y, box.y + box.height)
			) {
				ok = false;
				break;
			}
		}
		if (ok) {
			return { x, y };
		}
	}
}

function isect(s1, e1, s2, e2) {
	return s1 - ISECT_PAD < e2 && e1 + ISECT_PAD > s2;
}
