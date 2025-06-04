<script>
	import { tick } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { Send } from "@lucide/svelte";

	let { userId, messages, chatevent, close } = $props();

	let scrollEl;
	let groupedMessages = $state({});

	$effect(() => {
		console.log("message update");
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
		console.log(gm);
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
	class="absolute right-3 w-80 bottom-10 z-10 flex flex-col h-dvh rounded-md border border-gruvgray"
	style:max-height="max(min(80dvh,600px),60dvh)"
	in:fade|local={{ duration: 100 }}
	out:fade|local={{ duration: 75 }}
>
	<div class="flex items-center p-3 bg-gruvdbg0/50 rounded-t-md">
		<button
			class="bg-gruvlemphyellow w-3 h-3 rounded-full"
			aria-label="Close"
			onclick={close}
		></button>
		<div class="ml-3 text-zinc-300 text-sm font-medium">Chat Messages</div>
	</div>

	<div
		class="px-3 py-2 flex-grow overflow-y-auto bg-gruvdbg1"
		bind:this={scrollEl}
	>
		<div class="shellchat space-y-3">
			{#each Object.keys(groupedMessages) as id (id)}
				<div
					class="message-group"
					class:from-me={userId === groupedMessages[id][0].uid}
				>
					<aside class="pl-2.5 text-zinc-400 text-xs">
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
		class="p-3 relative bg-gruvdbg1 rounded-b-md"
		data-sveltekit-keepfocus
		onsubmit={handleSubmit}
	>
		<input
			id="chatinput"
			class="pl-3 pr-12 py-1.5 w-full outline-none rounded-2xl bg-gruvdbg0/60 focus:ring-2 focus:ring-ring"
			placeholder="Aa"
			bind:value={text}
		/>
		<div class="absolute right-6 inset-y-0">
			<button class="h-full align-middle" transition:fly|local={{ x: 8 }}>
				<Send
					class="text-indigo-300 hover:text-white transition-colors"
				/>
			</button>
		</div>
	</form>
</div>
