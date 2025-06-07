<script>
	import { settings, updateSettings } from "$lib/components/shell/settings";
	import OverlayDialog from "./OverlayDialog.svelte";
	import themes from "$lib/components/shell/themes";

	let { isopen = $bindable(false) } = $props();

	let inputName = $state();
	let inputTheme = $state();
	let inputScrollback = $state();

	// let initialized = false;
	$effect(() => {
		// if (!initialized) {
		// 	initialized = true;
		inputName = $settings.name;
		inputTheme = $settings.theme;
		inputScrollback = $settings.scrollback;
		// }
	});
</script>

<OverlayDialog
	title="Terminal Settings"
	description="Customize your collaborative terminal."
	bind:isopen
	wide={true}
>
	<div class="flex flex-col gap-4">
		<div
			class="bg-gruvdbg0 rounded-lg p-4 flex gap-4 flex-col sm:flex-row items-start"
		>
			<div class="flex-1">
				<p class="font-medium mb-1">Name</p>
				<p class="text-sm text-gruvdfg4">
					Choose how you appear to other users.
				</p>
			</div>
			<div>
				<input
					class="w-52 px-3 py-2 text-sm rounded-md bg-gruvdbg0h hover:bg-white/5 border border-zinc-700 outline-none focus:ring-2 focus:ring-ring appearance-none transition-colors"
					placeholder="Your name"
					bind:value={inputName}
					maxlength="50"
					oninput={() => {
						if (inputName.length >= 2) {
							updateSettings({ name: inputName });
						}
					}}
				/>
			</div>
		</div>
		<div
			class="bg-gruvdbg0 rounded-lg p-4 flex gap-4 flex-col sm:flex-row items-start"
		>
			<div class="flex-1">
				<p class="font-medium mb-1">Color palette</p>
				<p class="text-sm text-gruvdfg4">
					Color theme for text in terminals.
				</p>
			</div>
			<div class="relative">
				<select
					class="w-52 px-3 py-2 text-sm rounded-md bg-gruvdbg0h hover:bg-white/5 border border-zinc-700 outline-none focus:ring-2 focus:ring-ring appearance-none transition-colors !pr-5"
					bind:value={inputTheme}
					onchange={() => updateSettings({ theme: inputTheme })}
				>
					{#each Object.keys(themes) as themeName (themeName)}
						<option value={themeName}>{themeName}</option>
					{/each}
				</select>
			</div>
		</div>
		<div
			class="bg-gruvdbg0 zinc-800/25 rounded-lg p-4 flex gap-4 flex-col sm:flex-row items-start"
		>
			<div class="flex-1">
				<p class="font-medium mb-1">Scrollback</p>
				<p class="text-sm text-gruvdfg4">
					Lines of previous text displayed in the terminal window.
				</p>
			</div>
			<div>
				<input
					type="number"
					class="w-52 px-3 py-2 text-sm rounded-md bg-gruvdbg0h hover:bg-white/5 border border-zinc-700 outline-none focus:ring-2 focus:ring-ring appearance-none transition-colors"
					bind:value={inputScrollback}
					oninput={() => {
						if (inputScrollback >= 0) {
							updateSettings({ scrollback: inputScrollback });
						}
					}}
					step="100"
				/>
			</div>
		</div>
	</div>

	<p class="mt-6 text-sm text-right text-gruvlemphblue">
		<a
			target="_blank"
			rel="noreferrer"
			href="https://github.com/michaelrommel/blog"
		>
			<!-- eslint-disable-next-line -->
			git {__COMMIT__}/{__MODIFIED__}
		</a>
	</p>
</OverlayDialog>
