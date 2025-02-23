<script>
	import { Popover as PopoverPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils.js";
	let {
		transition = flyAndScale,
		transitionConfig = undefined,
		class: className,
		children,
		...rest
	} = $props();
</script>

<PopoverPrimitive.Content
	{transition}
	{transitionConfig}
	class={cn(
		"bg-popover text-popover-foreground z-50 w-72 rounded-md border border-gray-200 p-4 shadow-md outline-hidden",
		className,
	)}
	{...rest}
>
	{@render children?.()}
</PopoverPrimitive.Content>
