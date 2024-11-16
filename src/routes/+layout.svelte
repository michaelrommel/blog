<script>
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Navigation from "$lib/components/Navigation.svelte";
	import Article from "$lib/components/Article.svelte";
</script>

<ModeWatcher />
<Navigation />
<Article>
	<slot />
</Article>
