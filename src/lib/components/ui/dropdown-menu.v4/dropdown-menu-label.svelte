<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	let {
		inset = undefined,

		class: className,
		...rest
	} = $props();
</script>

<DropdownMenuPrimitive.Label
	class={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
	{...rest}
>
	<slot />
</DropdownMenuPrimitive.Label>
