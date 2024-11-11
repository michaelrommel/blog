import { error } from '@sveltejs/kit';

export async function load({ _url, _params, fetch }) {
	let hacksData = null;
	hacksData = await fetch('/api/hackers').then((res) => res.json());
	if (!hacksData) {
		error(404, {
			message: 'Data could not be retrieved'
		});
	}

	return {
		data: hacksData
	};
}
