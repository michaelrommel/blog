<script>
	import JournalList from "$lib/components/JournalList.svelte";
	let { data } = $props();
	// console.log(data);
</script>

<JournalList {data} />
