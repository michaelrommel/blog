<script>
	import { page } from "$app/stores";
	import ShellSession from "$lib/components/ShellSession.svelte";
	let title = "Remote Terminal";
</script>

<svelte:head>
	<title>{title}</title>
	<style>
		body {
			overscroll-behavior: none;
		}
	</style>
</svelte:head>

<ShellSession
	id={$page.params.id}
	receiveName={({ detail: sessionName }) => {
		if (sessionName) {
			title = `${sessionName}`;
		}
	}}
/>
