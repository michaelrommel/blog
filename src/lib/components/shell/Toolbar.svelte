<script>
	import {
		MessageSquare,
		CirclePlus,
		Settings,
		Unplug,
		Cable,
		PanelTop,
		Server,
		SquareTerminal,
		Group,
	} from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";

	let {
		connected,
		hasWriteAccess,
		newMessages,
		createTerminal,
		collectWindows,
		toggleChat,
		toggleSettings,
		serverLatency,
		shellLatency,
		status,
	} = $props();

	let popoverOpen = $state(false);
	let isAutoClosing = false;
	const autoClose = () => {
		if (!isAutoClosing) {
			isAutoClosing = true;
			window.setTimeout(() => {
				popoverOpen = false;
				isAutoClosing = false;
			}, 3000);
		}
	};

	let wasConnected = false;
	$effect(() => {
		// triggered on a change of connected
		if (wasConnected !== connected) {
			wasConnected = connected;
			popoverOpen = true;
			autoClose();
		}
	});
</script>

<div class="px-1 flex flex-col items-center mr-3">
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
	<Button
		variant="outline"
		size="icon"
		class="p-1 my-1"
		title="Collect all windows"
		onclick={collectWindows}
	>
		<Group />
	</Button>
	<Button
		variant="outline"
		size="icon"
		class="p-1 my-1"
		title="Show chat window"
		onclick={toggleChat}
	>
		<MessageSquare />
	</Button>
	<Button
		variant="outline"
		size="icon"
		class="p-1 my-1"
		title="Show settings window"
		onclick={toggleSettings}
	>
		{#if newMessages}
			<div class="activity"></div>
		{/if}
		<Settings />
	</Button>
	<div class="h-8"></div>
	<Popover.Root bind:open={popoverOpen}>
		<Popover.Trigger
			class="my-1 rounded-full mb bg-gruvdbg1 p-2 ring-offset-gruvlbg/90 dark:ring-offset-gruvdbg/90 focus-visible:ring-ring transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-accent disabled:pointer-events-none"
			title="Show connection info"
			onclick={autoClose}
			role="none"
		>
			<div class:hidden={connected}>
				<Unplug class="text-gruvdemphred" />
			</div>
			<div class:hidden={!connected}>
				<Cable class="rotate-45 text-gruvdemphgreen" />
			</div>
		</Popover.Trigger>
		<Popover.Content
			class="p-2 px-4"
			side="right"
			sideOffset="1"
			align="center"
		>
			Status: {status}
		</Popover.Content>
	</Popover.Root>
	<div class="flex-col">
		<div class="mb p-2 bg-gruvdbg1 rounded" title="Browser">
			<PanelTop strokeWidth="1.5" />
		</div>
		<div
			class="flex flex-col justify-center items-center ml-1 h-14 border-l border-gruvdfg4 border-dashed"
		>
			<div class="mx-1 text-xs">{serverLatency}</div>
			<div class="mx-1 text-xs">ms</div>
		</div>
		<div class="mb p-2 bg-gruvdbg1 rounded" title="Server">
			<Server strokeWidth="1.5" />
		</div>
		<div
			class="flex flex-col justify-center items-center ml-1 h-14 border-l border-gruvdfg4 border-dashed"
		>
			<div class="mx-1 text-xs">{shellLatency}</div>
			<div class="mx-1 text-xs">ms</div>
		</div>
		<div class="mb p-2 bg-gruvdbg1 rounded" title="Shell">
			<SquareTerminal strokeWidth="1.5" />
		</div>
	</div>
</div>
