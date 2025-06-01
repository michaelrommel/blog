<script>
	import { PUBLIC_ORIGIN } from "$env/static/public";
	import { decorate, serializeStructuredData } from "$lib/utils.js";
	import { page } from "$app/stores";
	export let data;
</script>

<!-- {$page.url.pathname !== "/" ? decorate(data.title) : data.title} -->

<svelte:head>
	<title>
		{decorate(data.title)}
	</title>
	<meta name="description" content={data.description} />
	<link
		rel="canonical"
		href={data.canonical ?? `${PUBLIC_ORIGIN}${$page.url.pathname}`}
	/>
	<meta property="og:site_name" content="Michael Rommel" />
	<meta property="og:title" content={decorate(data.title)} />
	<meta property="og:description" content={data.description} />
	<meta
		property="og:url"
		content={data.canonical ?? `${PUBLIC_ORIGIN}${$page.url.pathname}`}
	/>
	{#if data.structuredData}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html serializeStructuredData(data.structuredData)}
	{/if}
</svelte:head>
