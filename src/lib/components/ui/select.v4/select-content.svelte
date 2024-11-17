<script>
	import { Select as SelectPrimitive } from "bits-ui";
	import { scale } from "svelte/transition";
	import { cn, flyAndScale } from "$lib/utils.js";
	let {
		sideOffset = 4,
		inTransition = flyAndScale,
		inTransitionConfig = undefined,
		outTransition = scale,
		outTransitionConfig = {
			start: 0.95,
			opacity: 0,
			duration: 50,
		},
		class: className,
		...rest
	} = $props();
</script>

<SelectPrimitive.Content
	{inTransition}
	{inTransitionConfig}
	{outTransition}
	{outTransitionConfig}
	{sideOffset}
	class={cn(
		"bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md outline-none",
		className,
	)}
	{...rest}
	on:keydown
>
	<div class="w-full p-1">
		<slot />
	</div>
</SelectPrimitive.Content>
