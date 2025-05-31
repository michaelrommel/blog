<svelte:options runes />

<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { on } from "svelte/events";
	import { Tween } from "svelte/motion";
	import { expoOut } from "svelte/easing";

	import themes from "./themes";
	import { settings } from "$lib/components/shell/settings";

	const OFFSET_LEFT_CSS = "0px";
	const OFFSET_TOP_CSS = "0px";
	const OFFSET_TRANSFORM_ORIGIN_CSS = `calc(${OFFSET_LEFT_CSS}) calc( ${OFFSET_TOP_CSS})`;

	let {
		center,
		zoom,
		terminalWindow = $bindable(),
		write = $bindable(),
		focusWindow,
	} = $props();
	// let terminalWindow = { x: 0, y: 0, rows: 24, cols: 80 };

	let windowElement;
	let terminalElement;
	let isMoving = -1; // are we moving
	let movingOrigin = [0, 0]; // Coordinates of mouse at origin when drag started.
	let movingIsDone = false; // Moving finished but hasn't been acknowledged.
	let tweenie = $state();
	let immediate = true;

	let term = null;
	let theme = $derived(themes[$settings.theme]);

	$effect(() => {
		if (term) {
			// If the theme changes, update existing terminals' appearance.
			term.options.theme = theme;
			term.options.scrollback = $settings.scrollback;
		}
	});
	$effect(() => {
		// looks stupid, but otherwise effect would only trigger
		// again when term changes, not when cols/rows changes
		const c = terminalWindow.cols;
		const r = terminalWindow.rows;
		term?.resize(c, r);
	});

	// Returns the mouse position in infinite grid coordinates,
	// offset transformations and zoom.
	function normalizePosition(event) {
		return [
			Math.round(center[0] + event.pageX / zoom),
			Math.round(center[1] + event.pageY / zoom),
		];
	}

	const preloadBuffer = [];

	write = (data) => {
		if (!term) {
			// Before the terminal is loaded, push data into a buffer.
			preloadBuffer.push(data);
		} else {
			term.write(data);
		}
	};

	onMount(async () => {
		const [{ Terminal }, { WebglAddon }, { ImageAddon }] =
			await Promise.all([
				import("@xterm/xterm"),
				import("@xterm/addon-webgl"),
				import("@xterm/addon-image"),
			]);

		term = new Terminal({
			allowTransparency: false,
			cursorBlink: false,
			cursorStyle: "block",
			fontFamily:
				'"Victor Mono NF", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
			fontSize: 17,
			fontWeight: 400,
			fontWeightBold: 500,
			lineHeight: 1.06,
			scrollback: $settings.scrollback,
			theme,
		});
		term.loadAddon(new WebglAddon());
		term.open(terminalElement);

		term.resize(terminalWindow.cols, terminalWindow.rows);
		// term.onTitleChange((title) => {
		// 	currentTitle = title;
		// });
	});

	onMount(() => {
		// console.log(
		// 	"onMount: " + JSON.stringify($state.snapshot(terminalWindow)),
		// );
		// $effect(() => {
		// 	console.log(
		// 		"effect child: " +
		// 			JSON.stringify($state.snapshot(terminalWindow)),
		// 	);
		// });

		function handlePointerMove(event) {
			if (isMoving !== -1 && !movingIsDone) {
				const [x, y] = normalizePosition(event);
				terminalWindow = {
					...terminalWindow,
					x: Math.round(x - movingOrigin[0]),
					y: Math.round(y - movingOrigin[1]),
				};
			}
		}
		function handlePointerEnd(event) {
			if (isMoving !== -1) {
				movingIsDone = true;
				isMoving = -1;
				immediate = true;
			}
		}
		function handlePointerStart(event) {
			const [x, y] = normalizePosition(event);
			isMoving = 1;
			movingOrigin = [x - terminalWindow.x, y - terminalWindow.y];
			movingIsDone = false;
			immediate = false;
			focusWindow(terminalWindow.id);
			event.stopPropagation();
		}

		function focusTerminal(event) {
			// console.log(event);
			focusWindow(terminalWindow.id);
			event.stopPropagation();
		}

		on(window, "pointermove", handlePointerMove);
		on(window, "pointerup", handlePointerEnd);
		on(windowElement, "pointerdown", handlePointerStart);
		on(terminalElement, "pointerdown", focusTerminal);
		on(terminalElement, "wheel", focusTerminal);
	});

	tweenie = Tween.of(
		() => {
			return {
				winSize: { x: 0, y: 0, z: 0, rows: 24, cols: 80 },
				center: [0, 0],
				zoom: 1.0,
			};
		},
		{
			duration: 450,
			easing: expoOut,
		},
	);

	$effect(() => {
		tweenie.set(
			{
				winSize: terminalWindow,
				center,
				zoom,
			},
			{
				duration: immediate ? 0 : 250,
			},
		);
	});

	const sl = (node) => {
		$effect(() => {
			// console.log(
			// 	"ef slide child: " +
			// 		JSON.stringify(
			// 			$state.snapshot(tweenie?.current.winSize?.id),
			// 		) +
			// 		" => " +
			// 		JSON.stringify(
			// 			$state.snapshot(tweenie?.current.winSize?.x),
			// 		),
			// );
			node.style.transform = `scale(${(tweenie?.current.zoom * 100).toFixed(3)}%) translate3d(${tweenie?.current.winSize?.x + tweenie?.current.center?.[0]}px, ${tweenie?.current.winSize?.y + tweenie?.current.center?.[1]}px, 0)`;
			// node.style.transform = `scale(${(tweenie?.current.zoom * 100).toFixed(3)}%)`;
			// node.style.transform = `translate3d(${(tweenie?.current.winSize?.x + tweenie?.current.center?.[0]) * tweenie?.current.zoom}px, ${(tweenie?.current.winSize?.y + tweenie?.current.center?.[1]) * tweenie?.current.zoom}px, 0)`;
			node.style["z-index"] = tweenie?.current.winSize?.z;
		});
	};
	// function listen(node, { name, handler }) {
	// 	node.addEventListener(name, handler);
	// 	return { destroy: () => node.removeEventListener(name, handler) };
	// }
	// style:background-image="radial-gradient(#333 {zoom}px, transparent 0)"
</script>

<div
	class="absolute bg-gruvdbg0/50 inline-block border border-gruvdemphblue focused rounded-lg"
	style:left={OFFSET_LEFT_CSS}
	style:top={OFFSET_TOP_CSS}
	style:transform-origin="top left"
	transition:fade|local
	use:sl
	bind:this={windowElement}
>
	<div class="flex select-none">
		<div class="flex-1 flex items-center px-3">
			<div class="flex space-x-2 text-transparent hover:text-black/75">
				<button
					class="bg-red-500 w-3 h-3 rounded-full"
					aria-label="Close"
				></button>
				<button
					class="bg-yellow-300 w-3 h-3 rounded-full"
					aria-label="Shrink"
				></button>
				<button
					class="bg-green-400 w-3 h-3 rounded-full"
					aria-label="Expand"
				></button>
			</div>
		</div>
		<div
			class="p-2 text-sm text-zinc-300 text-center font-medium overflow-hidden whitespace-nowrap text-ellipsis w-0 flex-grow-[4]"
		>
			Remote Terminal
		</div>
		<div class="flex-1"></div>
	</div>

	<!-- <div -->
	<!-- 	class="p-2 text-slate-100 bg-gray-800 rounded-b-2xl w-[20rem] h-[250px] overflow-y-scroll overflow-x-hidden" -->
	<!-- 	style:scrollbar-color="gray rgba(0, 0, 0, 0)" -->
	<!-- 	bind:this={terminalElement} -->
	<!-- ></div> -->
	<div bind:this={terminalElement} class="rounded-lg p-1"></div>
</div>
