<script>
	import { MessageSquare, PlusCircle, Settings, Wifi } from "lucide-svelte";

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

<div class="panel inline-block px-3 py-2">
	<div class="flex items-center select-none">
		<div class="flex space-x-1">
			<button
				class="icon-button"
				onclick={createTerminal}
				disabled={!connected || !hasWriteAccess}
				title={!connected
					? "Not connected"
					: hasWriteAccess === false // Only show the "No write access" title after confirming read-only mode.
						? "No write access"
						: "Create new terminal"}
			>
				<PlusCircle strokeWidth={1.5} class="p-0.5" />
			</button>
			<button class="icon-button" onclick={toggleChat}>
				<MessageSquare strokeWidth={1.5} class="p-0.5" />
				{#if newMessages}
					<div class="activity"></div>
				{/if}
			</button>
			<button class="icon-button" onclick={toggleSettings}>
				<Settings strokeWidth={1.5} class="p-0.5" />
			</button>
		</div>

		<div class="v-divider"></div>

		<div class="flex space-x-1">
			<button class="icon-button" onclick={toggleNetworkInfo}>
				<Wifi strokeWidth={1.5} class="p-0.5" />
			</button>
		</div>
	</div>
</div>
