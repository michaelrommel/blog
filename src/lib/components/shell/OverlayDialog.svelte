<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";

	let {
		title,
		description,
		wide = false,
		isopen = $bindable(false),
		children,
	} = $props();
</script>

<Dialog.Root
	bind:open={isopen}
	class="fixed inset-0 z-50 grid justify-items-center"
>
	<Dialog.Content class="bg-gruvdbg0h border-zinc-800 w-fit max-w-3xl">
		<Dialog.Header>
			<div class="text-center">
				<Dialog.Title class="text-xl font-medium mb-2">
					{title}
				</Dialog.Title>
				<Dialog.Description class="text-gruvdfg4">
					{description}
				</Dialog.Description>
			</div>
		</Dialog.Header>
		{@render children?.()}
	</Dialog.Content>
</Dialog.Root>
