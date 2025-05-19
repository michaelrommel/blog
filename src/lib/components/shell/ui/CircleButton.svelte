<script>
	import { Minus, Plus, X } from "lucide-svelte";

	let { kind, onclick } = $props();

	const details = {
		red: {
			cls: "bg-red-500 active:bg-red-700",
			icon: X,
		},
		yellow: {
			cls: "bg-yellow-500 active:bg-yellow-700",
			icon: Minus,
		},
		green: {
			cls: "bg-green-500 active:bg-green-700",
			icon: Plus,
		},
	};

	let Icon = $derived(details[kind].icon);
</script>

<button class="w-3 h-3 p-[1px] rounded-full {details[kind].cls}" {onclick}>
	<Icon class="w-full h-full" strokeWidth={3} />
</button>
