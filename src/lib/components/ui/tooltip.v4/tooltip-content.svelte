<script>
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils.js";
	let {
		sideOffset = 4,
		transition = flyAndScale,
		transitionConfig = {
			y: 8,
			duration: 150,
		},
		class: className,
		...rest
	} = $props();
</script>

<TooltipPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn(
		"bg-popover text-popover-foreground z-50 overflow-hidden rounded-md border border-gray-200 px-3 py-1.5 text-sm shadow-md",
		className,
	)}
	{...rest}
>
	<slot />
</TooltipPrimitive.Content>
