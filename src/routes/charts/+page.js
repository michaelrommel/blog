/** @type {import('./$types').PageLoad} */
export async function load({ url, params, fetch }) {
	let hacksData = null;
	hacksData = [
		// {{{
		{
			year: 2019,
			apples: 3840,
			bananas: 1920,
			cherries: 960,
			grapes: 400
		},
		{
			year: 2018,
			apples: 1600,
			bananas: 1440,
			cherries: 960,
			grapes: 400
		},
		{
			year: 2017,
			apples: 820,
			bananas: 1000,
			cherries: 640,
			grapes: 400
		},
		{
			year: 2016,
			apples: 820,
			bananas: 560,
			cherries: 720,
			grapes: 400
		}
		// }}}
	];
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
