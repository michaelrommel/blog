export const prerender = false;
export const ssr = false;
/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }) {
	const filepath = url.searchParams.get('file');
	const dprparam = url.searchParams.get('dpr');
	// make it boolean from truish
	const dpr = dprparam && (dprparam == true || dprparam == 'true');

	return {
		file: filepath,
		dpr
	};
}
