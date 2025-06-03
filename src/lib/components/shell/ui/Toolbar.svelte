<script>
	import {
		MessageSquare,
		CirclePlus,
		Settings,
		Wifi,
		Unplug,
		Cable,
	} from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";

	let {
		connected,
		hasWriteAccess,
		newMessages,
		createTerminal,
		toggleChat,
		toggleSettings,
		toggleNetworkInfo,
	} = $props();
</script>

<div class="flex flex-col items-center mr-3">
	<div class="mb-2 p-2 rounded-full bg-gruvdbg1">
		<div class:hidden={connected}>
			<Unplug class="text-gruvdemphred" />
		</div>
		<div class:hidden={!connected}>
			<Cable class="rotate-45 text-gruvdemphgreen" />
		</div>
	</div>
	<Button
		variant="outline"
		size="icon"
		class="p-1 my-1"
		onclick={createTerminal}
		title={!connected
			? "Not connected"
			: hasWriteAccess === false // Only show the "No write access" title after confirming read-only mode.
				? "No write access"
				: "Create new terminal"}
	>
		<CirclePlus />
	</Button>
	<Button variant="outline" size="icon" class="p-1 my-1" onclick={toggleChat}>
		<MessageSquare />
	</Button>
	<Button
		variant="outline"
		size="icon"
		class="p-1 my-1"
		onclick={toggleSettings}
	>
		{#if newMessages}
			<div class="activity"></div>
		{/if}
		<Settings />
	</Button>
	<Button
		variant="outline"
		size="icon"
		class="p-1 my-1"
		onclick={toggleNetworkInfo}
	>
		<Wifi />
	</Button>
</div>
