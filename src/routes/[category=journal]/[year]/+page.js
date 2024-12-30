export async function load({ params, fetch }) {
	let journalDataList = null;
	if (params.year) {
		journalDataList = await fetch(`/api/journal?year=${params.year}`).then(
			(res) => res.json()
		);
	} else {
		journalDataList = await fetch('/api/journal').then((res) => res.json());
	}

	journalDataList = journalDataList ?? [];

	const jdlFiltered = journalDataList.filter(
		(c) => c.articleCategory !== 'noyear'
	);

	return {
		cards: jdlFiltered,
		title: `List of Journal Entries ${params.year ? params.year.toUpperCase() : ''}`,
		description: `Journal Entries ${params.year ? 'in year ' + params.year.toUpperCase() : ''}`
	};
}
