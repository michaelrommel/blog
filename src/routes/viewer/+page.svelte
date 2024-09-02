<script>
	/** @type {import('./$types').PageData} */
	import "../../app.css";
	import StlViewer from "$lib/components/StlViewer.svelte";
	export let data;
</script>

<div class="col-span-12">
	<StlViewer stl={data.stl} />
</div>
