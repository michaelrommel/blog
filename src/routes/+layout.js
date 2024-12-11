export async function load({ params, fetch, data }) {
	const user = data?.user ?? null;
	return {
		user
	};
}
