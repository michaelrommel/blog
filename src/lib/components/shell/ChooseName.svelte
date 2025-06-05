<script>
	import { browser } from "$app/environment";

	import OverlayDialog from "./OverlayDialog.svelte";
	import { settings, updateSettings } from "$lib/components/shell/settings";

	let value = "";

	function handleSubmit() {
		updateSettings({ name: value });
	}
</script>

<OverlayDialog
	title="Welcome!"
	description="Before you join — what should we call you?"
	isopen={browser && !$settings.name}
>
	<form class="flex gap-2" onsubmit={handleSubmit}>
		<div class="flex-grow"></div>
		<input
			class="px-3 py-2 rounded-md outline-none text-gruvdfg4 bg-gruvdbg0 hover:bg-white/5 border border-zinc-700 focus:ring-2 focus:ring-ring"
			placeholder="Your name"
			required
			minlength="2"
			maxlength="50"
			bind:value
		/>
		<button
			class="flex-shrink-0 px-3 py-2 bg-gruvlemphblue hover:bg-gruvblue active:ring-4 active:ring-ring rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring ring-offset-background font-medium"
			>Join</button
		>
		<div class="flex-grow"></div>
	</form>
</OverlayDialog>
