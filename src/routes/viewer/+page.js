/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }) {
	const stlpath = url.searchParams.get('stl');

	return {
		stl: stlpath
	};
}
