<script>
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { X } from "lucide-svelte";

	let {
		title,
		description,
		maxWidth = 768,
		open,
		close,
		children,
	} = $props();
</script>

<Dialog.Root {open}>
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
