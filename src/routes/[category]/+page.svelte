<script>
	// import "../../app.css";
	import CardList from "$lib/components/CardList.svelte";
	let { data } = $props();
</script>

<CardList {data} />
