<script>
	import { getContext } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import ShellSession from "$lib/components/ShellSession.svelte";

	let titlectx = getContext("title");

	let { data } = $props();
	let hash = $state(null);

	const url = page.url;
	const user = data.user;

	const sessionId = page.params.id;

	function checkAuth() {
		if (!user?.id) {
			console.log("no user -> goto login page");
			hash = url?.hash.slice(1);
			const pair = {};
			pair[sessionId] = hash;
			localStorage.setItem("hash", JSON.stringify(pair));
			setTimeout(() => {
				goto(`/login?referrer=/shell/session/${sessionId}`);
			}, 2000);
		} else {
			if (url?.hash) {
				//console.log("Hash was ok");
				hash = url.hash.slice(1);
			} else {
				//console.log("no hash in url string, get from store");
				const pair = JSON.parse(localStorage.getItem("hash"));
				hash = pair?.[sessionId];
				goto(`/shell/session/${sessionId}#${hash}`);
				// localStorage.removeItem("hash");
			}
		}
	}

	checkAuth();
</script>

{#if !user?.id}
	<div class="mt-20 w-full flex justify-center">
		<div class="p-8 text-lg rounded-2xl dark:bg-gruvdbg1 text-center">
			<p>In order to use a shell session, you need to be logged in.</p>
			<p>Redirecting you to the login page...</p>
		</div>
	</div>
{:else}
	<ShellSession
		id={page.params.id}
		receiveName={(sessionName) => {
			if (sessionName) {
				titlectx.title = `${sessionName}`;
			}
		}}
		{hash}
		{user}
	/>
{/if}
