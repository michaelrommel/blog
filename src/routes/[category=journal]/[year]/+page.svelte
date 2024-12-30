<script>
	import JournalList from "$lib/components/JournalList.svelte";
	let { data } = $props();
</script>

<JournalList {data} />
