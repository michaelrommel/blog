<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import ShellSession from "$lib/components/ShellSession.svelte";

	let title = $state("Remote Terminal");

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
			goto(`/login?referrer=/shell/session/${sessionId}`);
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

<svelte:head>
	<title>{title}</title>
	<!-- <style> -->
	<!-- 	body { -->
	<!-- 		overscroll-behavior: none; -->
	<!-- 	} -->
	<!-- </style> -->
</svelte:head>

<ShellSession
	id={page.params.id}
	receiveName={(sessionName) => {
		if (sessionName) {
			title = `${sessionName}`;
		}
	}}
	{hash}
	{user}
/>
