<script>
	import "../app.css";
	import Navigation from "$lib/components/Navigation.svelte";
</script>

<Navigation />
<div class="overflow-auto m-3">
	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-12 md:mx-auto">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss" global>
	.mdsvx .img-right {
		@apply max-w-2xl;
	}
</style>
