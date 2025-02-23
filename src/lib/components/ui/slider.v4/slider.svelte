<script>
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	let { value = $bindable([0]), class: className, ...rest } = $props();
</script>

<SliderPrimitive.Root
	bind:value
	class={cn(
		"relative flex w-full touch-none select-none items-center",
		className,
	)}
	{...rest}
	let:thumbs
>
	<span
		class="bg-secondary relative h-2 w-full grow overflow-hidden rounded-full"
	>
		<SliderPrimitive.Range class="bg-primary absolute h-full" />
	</span>
	{#each thumbs as thumb}
		<SliderPrimitive.Thumb
			{thumb}
			class="border-primary bg-background ring-offset-background focus-visible:ring-ring block h-5 w-5 rounded-full border-2 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		/>
	{/each}
</SliderPrimitive.Root>
