<script>
	import { ChevronDown } from "@lucide/svelte";
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<SelectPrimitive.ScrollDownButton
	bind:ref
	class={cn(
		"flex cursor-default items-center justify-center py-1",
		className,
	)}
	{...restProps}
>
	<ChevronDown class="size-4" />
</SelectPrimitive.ScrollDownButton>
