<script>
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	let { value = undefined, ...rest } = $props();
</script>

<DropdownMenuPrimitive.RadioGroup {...rest} bind:value>
	<slot />
</DropdownMenuPrimitive.RadioGroup>
