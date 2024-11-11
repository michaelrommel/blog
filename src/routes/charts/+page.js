/** @type {import('./$types').PageLoad} */
export async function load({ _url, _params, fetch }) {
	let hacksData = null;
	hacksData = await fetch('/api/hackers').then((res) => res.json());
	if (!hacksData) {
		return {
			status: 404,
			error: new Error('data could not be retrieved')
		};
	}

	return {
		data: hacksData
	};
}
