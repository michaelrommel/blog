<script>
	/** @type {import('./$types').PageData} */
	import "../../app.css";
	import StlViewer from "$lib/components/StlViewer.svelte";
	export let data;
</script>

<div class="flex flex-col">
	<div class="self-center">
		<StlViewer stl={data.stl} />
	</div>
</div>
