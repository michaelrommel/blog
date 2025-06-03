<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";

	let { title, description, isopen = $bindable(false), children } = $props();
</script>

<Dialog.Root bind:open={isopen}>
	<Dialog.Content>
		<Dialog.Header>
			<div class="mb-8 text-center">
				<Dialog.Title class="text-xl font-medium mb-2">
					{title}
				</Dialog.Title>
				<Dialog.Description class="text-zinc-400">
					{description}
				</Dialog.Description>
			</div>
		</Dialog.Header>
		{@render children?.()}
	</Dialog.Content>
</Dialog.Root>
