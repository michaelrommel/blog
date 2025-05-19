<script>
	let { children } = $props();
</script>

<div class="flex space-x-2 text-transparent hover:text-black/75">
	{@render children?.()}
</div>
