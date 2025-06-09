<script>
	import { tick } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { Send } from "@lucide/svelte";

	let { userId, showChat, messages, chatevent, close } = $props();

	let scrollEl;
	let groupedMessages = $state({});

	$effect(() => {
		// console.log("message update");
		group_messages(messages);
		tick().then(() => {
			scrollEl.scroll({ top: scrollEl.scrollHeight });
		});
	});

	function group_messages(messages) {
		const gm = {};
		let lastSender = -1;
		let id = 0;
		for (const msg of messages) {
			if (msg.uid === lastSender) {
				gm[id].push(msg);
			} else {
				id += 1;
				gm[id] = [msg];
				lastSender = msg.uid;
			}
		}
		groupedMessages = gm;
	}

	let text = $state(null);

	function handleSubmit() {
		if (text) {
			chatevent(text);
			text = "";
		}
	}
</script>

<div
	class="flex items-center p-1 bg-gruvlbg1/90 dark:bg-gruvdbg1/90 rounded-t-md"
>
	<button
		class="ml-2 bg-gruvlemphyellow w-3 h-3 rounded-full"
		aria-label="Close"
		onclick={close}
	></button>
	<div class="ml-2 text-gruvlfg dark:text-gruvdfg text-sm font-medium">
		Chat Messages
	</div>
</div>

<div
	class="px-3 py-2 flex-grow overflow-y-auto bg-gruvlbg0 text-gruvlfg dark:bg-gruvdbg0 dark:text-gruvdfg"
	bind:this={scrollEl}
>
	<div class="shellchat space-y-3">
		{#each Object.keys(groupedMessages) as id (id)}
			<div
				class="message-group"
				class:from-me={userId === groupedMessages[id][0].uid}
			>
				<aside class="pl-2.5 text-gruvlfg2 dark:text-gruvdfg2 text-xs">
					{groupedMessages[id][0].name}
				</aside>
				{#each groupedMessages[id] as chat (chat)}
					<div
						class="chat"
						title="sent at {chat.sentAt.toLocaleTimeString()}"
					>
						{chat.msg}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<form
	class="p-3 relative bg-gruvlbg0 dark:bg-gruvdbg0 rounded-b-md"
	data-sveltekit-keepfocus
	onsubmit={handleSubmit}
>
	<input
		id="chatinput"
		class="pl-3 pr-12 py-1.5 w-full outline-none rounded-2xl text-gruvlfg bg-gruvlbg1 dark:text-gruvdfg dark:bg-gruvdbg1 focus:ring-2 focus:ring-ring"
		placeholder="Aa"
		bind:value={text}
	/>
	<div class="absolute right-6 inset-y-0">
		<button class="h-full align-middle" transition:fly|local={{ x: 8 }}>
			<Send class="text-gruvdfg4 hover:text-gruvdfg transition-colors" />
		</button>
	</div>
</form>
