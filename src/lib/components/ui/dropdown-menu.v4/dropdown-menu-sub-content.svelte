<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils.js";
	let {
		transition = flyAndScale,
		transitionConfig = {
			x: -10,
			y: 0,
		},
		class: className,
		...rest
	} = $props();
</script>

<DropdownMenuPrimitive.SubContent
	{transition}
	{transitionConfig}
	class={cn(
		"bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border border-gray-200 p-1 shadow-lg focus:outline-hidden",
		className,
	)}
	{...rest}
	on:keydown
	on:focusout
	on:pointermove
>
	<slot />
</DropdownMenuPrimitive.SubContent>
