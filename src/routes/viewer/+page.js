export const prerender = false;
export const ssr = false;
/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const filepath = url.searchParams.get('file');
	const dprparam = url.searchParams.get('dpr');
	const inertiaparam = Number(url.searchParams.get('inertia'));
	// sanitize
	const inertia =
		typeof inertiaparam === 'number' &&
		isFinite(inertiaparam) &&
		inertiaparam < 2000 &&
		inertiaparam >= 1
			? inertiaparam
			: 300;
	// make it boolean from truish
	const dpr = dprparam && (dprparam == '1' || dprparam == 'true');

	return {
		file: filepath,
		dpr,
		inertia
	};
}
