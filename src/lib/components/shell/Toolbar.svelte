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
		hasWriteAccess,
		newMessages,
		createTerminal,
		collectWindows,
		toggleChat,
		toggleSettings,
		serverLatency,
		shellLatency,
		connected,
		connectionStatus,
		connectionError,
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

	function displayLatency(latency) {
		if (latency < 1) {
			return ["1", "ms"];
		} else if (latency <= 950) {
			return [`${Math.round(latency)}`, "ms"];
		} else {
			return [`${(latency / 1000).toFixed(1)}`, "s"];
		}
	}

	function colorLatency(latency) {
		if (latency === null) {
			return "";
		} else if (latency < 80) {
			return "text-gruvlemphgreen dark:text-gruvdemphgreen";
		} else if (latency < 300) {
			return "text-gruvlemphyellow dark:text-gruvdemphyellow";
		} else {
			return "text-gruvlemphred dark:text-gruvdemphred";
		}
	}
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
		class="p-1 my-1 relative"
		title="Show chat window"
		onclick={toggleChat}
	>
		<MessageSquare />
		{#if newMessages}
			<div
				class="absolute top-1.5 right-1 p-[4.5px] bg-gruvdemphred rounded-full"
			></div>
		{/if}
	</Button>
	<Button
		variant="outline"
		size="icon"
		class="p-1 my-1"
		title="Show settings window"
		onclick={toggleSettings}
	>
		<Settings />
	</Button>
	<div class="h-8"></div>
	<!-- <Popover.Root open={true}> -->
	<Popover.Root bind:open={popoverOpen}>
		<Popover.Trigger
			class="my-1 rounded-full mb bg-gruvlbg1 dark:bg-gruvdbg1 p-2 ring-offset-gruvlbg/90 dark:ring-offset-gruvdbg/90 focus-visible:ring-ring transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-accent disabled:pointer-events-none"
			title="Show connection info"
			onclick={autoClose}
			role="none"
		>
			<div class:hidden={connected && connectionStatus === "Established"}>
				<Unplug class="text-gruvlemphred dark:text-gruvdemphred" />
			</div>
			<div
				class:hidden={!connected || connectionStatus !== "Established"}
			>
				<Cable
					class="rotate-45 text-gruvlemphgreen dark:text-gruvdemphgreen"
				/>
			</div>
		</Popover.Trigger>
		<Popover.Content
			class="p-2 px-4 w-fit flex flex-col items-center bg-gruvlbg0 border-gruvlbg4 dark:bg-gruvdbg0 border dark:border-gruvdbg4"
			o
			side="right"
			sideOffset="1"
			align="center"
		>
			<div
				class="text-gruvlfg2 dark:text-gruvdfg2 text-sm font-bold border-gruvlfg4 dark:border-gruvdfg4 pb-0.5"
				class:border-b={!connectionError}
			>
				{connectionStatus}
			</div>
			<div
				class="text-gruvlfg2 dark:text-gruvdfg4 text-sm border-t border-gruvlfg4 dark:border-gruvdfg4 pt-0.5"
			>
				{connectionError}
			</div>
		</Popover.Content>
	</Popover.Root>
	<div class="flex-col">
		<div
			class="mb p-2 bg-gruvlbg1 dark:bg-gruvdbg1 rounded"
			title="Browser"
		>
			<PanelTop
				strokeWidth="1.5"
				class="text-gruvlfg2 dark:text-gruvdfg2"
			/>
		</div>
		<div
			class="flex flex-col justify-center items-center ml-1 h-14 border-l border-gruvdfg4 border-dashed"
		>
			<div class="mx-1 text-xs {colorLatency(serverLatency)}">
				{displayLatency(serverLatency)[0]}
			</div>
			<div class="mx-1 text-xs {colorLatency(serverLatency)}">
				{displayLatency(serverLatency)[1]}
			</div>
		</div>
		<div class="mb p-2 bg-gruvlbg1 dark:bg-gruvdbg1 rounded" title="Server">
			<Server
				strokeWidth="1.5"
				class="text-gruvlfg2 dark:text-gruvdfg2"
			/>
		</div>
		<div
			class="flex flex-col justify-center items-center ml-1 h-14 border-l border-gruvdfg4 border-dashed"
		>
			<div class="mx-1 text-xs {colorLatency(shellLatency)}">
				{displayLatency(shellLatency)[0]}
			</div>
			<div class="mx-1 text-xs {colorLatency(shellLatency)}">
				{displayLatency(shellLatency)[1]}
			</div>
		</div>
		<div class="mb p-2 bg-gruvlbg1 dark:bg-gruvdbg1 rounded" title="Shell">
			<SquareTerminal
				strokeWidth="1.5"
				class="text-gruvlfg2 dark:text-gruvdfg2"
			/>
		</div>
	</div>
</div>
