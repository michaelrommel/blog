<svelte:options runes />

<script module>
	// Deduplicated terminal font loading.
	const waitForFonts = (() => {
		let state = "initial";
		const waitlist = [];

		return async function waitForFonts() {
			if (state === "loaded") return;
			else if (state === "initial") {
				const FontFaceObserver = (await import("fontfaceobserver"))
					.default;
				state = "loading";
				let regular = new FontFaceObserver("Victor Mono NF", {
					weight: "normal",
					style: "normal",
				});
				let bold = new FontFaceObserver("Victor Mono NF", {
					weight: "bold",
					style: "normal",
				});
				let italic = new FontFaceObserver("Victor Mono NF", {
					weight: "normal",
					style: "italic",
				});
				let bolditalic = new FontFaceObserver("Victor Mono NF", {
					weight: "bold",
					style: "italic",
				});
				try {
					await Promise.all([
						regular.load(),
						bold.load(),
						italic.load(),
						bolditalic.load(),
					]);
				} catch (error) {
					console.log(error);
				}
				state = "loaded";
				console.log("ff observer loaded");
				for (const fn of waitlist) fn();
			} else {
				await new Promise((resolve) => {
					if (state === "loaded") resolve();
					else waitlist.push(resolve);
				});
			}
		};
	})();
</script>

<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { on } from "svelte/events";
	import { Tween } from "svelte/motion";
	import { expoOut } from "svelte/easing";

	import themes from "./themes";
	import { settings } from "$lib/components/shell/settings";

	let {
		center,
		zoom,
		terminalWindow = $bindable(),
		write = $bindable(),
		movingId = $bindable(), // the id of the moving window, to report back
		hasWriteAccess,
		focusWindow,
		pointerMove,
		onData,
	} = $props();

	let windowElement;
	let terminalElement;
	let isMoving = false; // are we moving
	let movingOrigin = [0, 0]; // Coordinates of mouse at origin when drag started.
	let tweenie = $state();
	let immediate = true;

	let term = null;
	let theme = $derived(themes[$settings.theme]);
	let terminalTitle = $state("Remote Terminal");

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
		return [Math.round(event.pageX / zoom), Math.round(event.pageY / zoom)];
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
		const [{ Terminal }, { WebglAddon }] = await Promise.all([
			//import("@xterm/xterm"),
			import("sshx-xterm"),
			import("@xterm/addon-webgl"),
		]);

		await waitForFonts();

		term = new Terminal({
			allowTransparency: false,
			cursorBlink: false,
			cursorStyle: "block",
			fontFamily: '"Victor Mono NF"',
			fontSize: 16,
			fontWeight: 400,
			fontWeightBold: 600,
			lineHeight: 1.0,
			scrollback: $settings.scrollback,
			theme,
		});
		term.loadAddon(new WebglAddon());
		term.open(terminalElement);
		term.resize(terminalWindow.cols, terminalWindow.rows);
		term.onTitleChange((title) => {
			terminalTitle = title;
		});

		const utf8 = new TextEncoder();
		term.onData((data) => {
			if (hasWriteAccess) {
				onData(terminalWindow.id, utf8.encode(data));
			}
		});
		term.onBinary((data) => {
			if (hasWriteAccess) {
				onData(terminalWindow.id, Buffer.from(data, "binary"));
			}
		});
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

		function handlePointerStart(event) {
			console.log(event);
			// only react on left mouse button
			if (event.button === 0) {
				isMoving = true;
				movingOrigin = [
					Math.round(event.pageX / zoom) - terminalWindow.x,
					Math.round(event.pageY / zoom) - terminalWindow.y,
				];
				movingId = terminalWindow.id;
				immediate = false;
				focusWindow(terminalWindow.id);
				pointerMove([event.pageX, event.pageY]);
				event.stopPropagation();
			}
		}

		function handlePointerMove(event) {
			if (isMoving) {
				terminalWindow = {
					...terminalWindow,
					x: Math.round(event.pageX / zoom) - movingOrigin[0],
					y: Math.round(event.pageY / zoom) - movingOrigin[1],
				};
			}
			pointerMove([event.pageX, event.pageY]);
		}
		function handlePointerEnd() {
			if (isMoving) {
				isMoving = false;
				movingId = -1;
				immediate = true;
			}
		}
		function handlePointerEnter() {
			console.log("pointerEnter");
			pointerMove(null);
		}
		function handlePointerLeave() {
			console.log("pointerleave");
			pointerMove(null);
		}
		function focusTerminal(event) {
			// console.log(event);
			focusWindow(terminalWindow.id);
			pointerMove([event.pageX, event.pageY]);
			event.stopPropagation();
		}

		on(window, "pointermove", handlePointerMove);
		on(window, "pointerup", handlePointerEnd);
		on(window, "pointerenter", handlePointerEnter);
		on(window, "pointerleave", handlePointerLeave);
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
	class="absolute bg-gruvdbg0/50 top-0 left-0 inline-block border border-gruvdemphblue focused rounded-lg"
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
			class="p-1 text-sm text-gruvdfg text-center font-medium overflow-hidden whitespace-nowrap text-ellipsis w-0 flex-grow-[4]"
		>
			{terminalTitle}
		</div>
		<div class="flex-1"></div>
	</div>

	<div bind:this={terminalElement} class="rounded-lg p-1"></div>
	<!-- <div -->
	<!-- 	class="p-2 text-slate-100 bg-gray-800 rounded-b-2xl w-[20rem] h-[250px] overflow-y-scroll overflow-x-hidden" -->
	<!-- 	style:scrollbar-color="gray rgba(0, 0, 0, 0)" -->
	<!-- 	bind:this={terminalElement} -->
	<!-- > -->
	<!-- 		Windows with Svelte 5.<br /><br /> -->
	<!-- 		<pre> -->
	<!-- id={tweenie.current.winSize.id} -->
	<!-- x={tweenie.current.winSize.x.toFixed(3)} -->
	<!-- y={tweenie.current.winSize.y.toFixed(3)} -->
	<!-- z={tweenie.current.winSize.z.toFixed(3)} -->
	<!-- center=[ {tweenie.current.center[0].toFixed( -->
	<!-- 				0, -->
	<!-- 			)}, {tweenie.current.center[1].toFixed(0)} ] -->
	<!-- zoom={tweenie.current.zoom.toFixed(3)} -->

	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->
	<!-- And this is some long text, so that this div will overflow -->
	<!-- and I have the chance to see scrolling with the wheel working. -->

	<!-- 		</pre> -->
	<!-- 	</div> -->
</div>
