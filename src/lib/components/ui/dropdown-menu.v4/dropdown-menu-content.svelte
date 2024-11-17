<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils.js";
	let {
		sideOffset = 4,
		transition = flyAndScale,
		transitionConfig = undefined,
		class: className,
		...rest
	} = $props();
</script>

<DropdownMenuPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn(
		"bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-md focus:outline-none",
		className,
	)}
	{...rest}
	on:keydown
>
	<slot />
</DropdownMenuPrimitive.Content>
