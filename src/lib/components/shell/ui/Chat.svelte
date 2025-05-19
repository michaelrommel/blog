<script>
	import { createEventDispatcher, tick } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { Send } from "lucide-svelte";

	import CircleButton from "./CircleButton.svelte";
	import CircleButtons from "./CircleButtons.svelte";

	const dispatch = createEventDispatcher();

	export let userId;
	export let messages;

	let groupedMessages;
	$: {
		groupedMessages = [];
		let lastSender = -1;
		for (const chat of messages) {
			if (chat.uid === lastSender) {
				groupedMessages[groupedMessages.length - 1].push(chat);
			} else {
				groupedMessages.push([chat]);
				lastSender = chat.uid;
			}
		}
	}

	let scroller;
	$: if (scroller && groupedMessages.length) {
		tick().then(() => {
			scroller.scroll({ top: scroller.scrollHeight });
		});
	}

	let text;

	function handleSubmit() {
		if (text) {
			dispatch("chat", text);
			text = "";
		}
	}
</script>

<div
	class="panel flex flex-col h-full max-h-[480px]"
	in:fade|local={{ duration: 100 }}
	out:fade|local={{ duration: 75 }}
>
	<div class="flex items-center p-3">
		<CircleButtons>
			<CircleButton kind="red" on:click={() => dispatch("close")} />
		</CircleButtons>
		<div class="ml-3 text-zinc-300 text-sm font-medium">Chat Messages</div>
	</div>

	<div class="px-3 py-2 flex-1 overflow-y-auto" bind:this={scroller}>
		<div class="space-y-3">
			{#each groupedMessages as chatGroup (chatGroup[0].uid)}
				<div
					class="message-group"
					class:from-me={userId === chatGroup[0].uid}
				>
					<aside class="pl-2.5 text-zinc-400 text-xs">
						{chatGroup[0].name}
					</aside>
					{#each chatGroup as chat (chat)}
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

	<form class="relative p-3" on:submit|preventDefault={handleSubmit}>
		<input
			class="w-full rounded-2xl bg-zinc-800 pl-3.5 pr-9 py-1.5 outline-none text-zinc-300 focus:ring-2 focus:ring-indigo-500/50"
			placeholder="Aa"
			bind:value={text}
		/>
		{#if text}
			<button
				class="absolute w-4 h-4 top-[22px] right-[23px]"
				transition:fly|local={{ x: 8 }}
			>
				<Send
					class="w-full h-full text-indigo-300 hover:text-white transition-colors"
				/>
			</button>
		{/if}
	</form>
</div>
