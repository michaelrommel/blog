<script>
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import Navigation from "$lib/components/Navigation.svelte";
</script>

<ModeWatcher />
<Navigation />
<div class="overflow-auto m-3">
	<div class="grid grid-cols-12 gap-4">
		<slot />
	</div>
</div>
