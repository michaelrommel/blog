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
				// console.log("ff observer loaded");
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
		onData,
		onClose,
		onWindowUpdate,
	} = $props();

	let windowElement;
	let terminalElement;
	let wireframeElement;
	let resizeHandle;
	let isResizing = false; // are we resizing
	let resizingSize = $state([0, 0]);
	let cell = [0, 0];
	let chromeHeight = 0;
	let resizingOrigin = [0, 0]; // Coordinates of mouse at origin when drag started.
	let isMoving = false; // are we moving
	let movingOrigin = [0, 0]; // Coordinates of mouse at origin when drag started.
	let tweenie = $state();
	let immediate = true;

	let term = null;
	let theme = $derived(themes[$settings.theme]);
	let terminalTitle = $state("Remote Terminal");

	// Terminal width and height limits.
	const TERM_MIN_ROWS = 8;
	const TERM_MIN_COLS = 32;

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

	const shrink = () => {
		if (!hasWriteAccess) return;
		terminalWindow.rows = Math.max(terminalWindow.rows - 4, TERM_MIN_ROWS);
		terminalWindow.cols = Math.max(terminalWindow.cols - 10, TERM_MIN_COLS);
		onWindowUpdate();
	};

	const expand = () => {
		if (!hasWriteAccess) return;
		terminalWindow.rows = terminalWindow.rows + 4;
		terminalWindow.cols = terminalWindow.cols + 10;
		onWindowUpdate();
	};

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

		function getWireframeRect() {
			return [
				`${resizingSize[0] * cell[0]}px`,
				`${resizingSize[1] * cell[1] + chromeHeight}px`,
			];
		}

		function handleResizeStart(event) {
			if (!hasWriteAccess) return;
			// only react on left mouse button
			if (event.button === 0) {
				isResizing = true;
				resizingSize = [terminalWindow.cols, terminalWindow.rows];
				resizingOrigin = [
					Math.round(event.pageX / zoom),
					Math.round(event.pageY / zoom),
				];
				chromeHeight =
					windowElement.getBoundingClientRect().height / zoom;
				let terminalHeight =
					terminalElement.getBoundingClientRect().height / zoom;
				let terminalWidth =
					terminalElement.getBoundingClientRect().width / zoom;
				cell = [
					terminalWidth / resizingSize[0],
					terminalHeight / resizingSize[1],
				];
				console.log(cell);
				let wfr = getWireframeRect();
				wireframeElement.style.width = wfr[0];
				wireframeElement.style.height = wfr[1];
				wireframeElement.classList.remove("hidden");
				wireframeElement.classList.add("flex");
				event.stopPropagation();
			}
		}

		function handlePointerStart(event) {
			if (!hasWriteAccess) return;
			// only react on left mouse button
			if (event.button === 0) {
				isMoving = true;
				movingOrigin = [
					Math.round(event.pageX / zoom - terminalWindow.x),
					Math.round(event.pageY / zoom - terminalWindow.y),
				];
				movingId = terminalWindow.id;
				immediate = false;
				focusWindow(terminalWindow.id);
				event.stopPropagation();
			}
		}

		function handlePointerMove(event) {
			if (isMoving) {
				terminalWindow = {
					...terminalWindow,
					x: Math.round(event.pageX / zoom - movingOrigin[0]),
					y: Math.round(event.pageY / zoom - movingOrigin[1]),
				};
			}
			if (isResizing) {
				let cols = Math.round(
					(event.pageX / zoom - resizingOrigin[0]) / cell[0],
				);
				let rows = Math.round(
					(event.pageY / zoom - resizingOrigin[1]) / cell[1],
				);
				resizingSize = [
					Math.max(terminalWindow.cols + cols, TERM_MIN_COLS),
					Math.max(terminalWindow.rows + rows, TERM_MIN_ROWS),
				];
				let wfr = getWireframeRect();
				wireframeElement.style.width = wfr[0];
				wireframeElement.style.height = wfr[1];
			}
		}
		function handlePointerEnd() {
			if (isMoving) {
				isMoving = false;
				movingId = -1;
				immediate = true;
			}
			if (isResizing) {
				isResizing = false;
				wireframeElement.classList.remove("flex");
				wireframeElement.classList.add("hidden");
				terminalWindow.cols = resizingSize[0];
				terminalWindow.rows = resizingSize[1];
				onWindowUpdate();
			}
		}

		function focusTerminal(event) {
			focusWindow(terminalWindow.id);
			event.stopPropagation();
		}

		on(window, "pointermove", handlePointerMove);
		on(window, "pointerup", handlePointerEnd);
		on(windowElement, "pointerdown", handlePointerStart);
		on(resizeHandle, "pointerdown", handleResizeStart);
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
	class="absolute bg-gruvdbg1/90 top-0 left-0 inline-block border border-gruvlfg3 focused rounded-lg"
	style:transform-origin="top left"
	transition:fade|local
	use:sl
>
	<div class="flex select-none" bind:this={windowElement}>
		<div class="flex items-center pt-1 px-3">
			<div class="flex space-x-2 text-transparent hover:text-black/75">
				<button
					class="bg-gruvlemphred w-3 h-3 rounded-full"
					aria-label="Close"
					onclick={onClose}
				></button>
				<button
					class="bg-gruvlemphyellow w-3 h-3 rounded-full"
					aria-label="Shrink"
					onclick={shrink}
				></button>
				<button
					class="bg-green-600 w-3 h-3 rounded-full"
					aria-label="Expand"
					onclick={expand}
				></button>
			</div>
		</div>
		<div
			class="pt-1 text-sm text-gruvdfg text-center font-medium overflow-hidden whitespace-nowrap text-ellipsis w-0 flex-grow-[4]"
		>
			{terminalTitle}
		</div>
		<div class="flex-1"></div>
	</div>

	<div bind:this={terminalElement} class="rounded-lg"></div>

	<div
		bind:this={wireframeElement}
		class="absolute top-0 left-0 outline-2 outline-orange-400 outline-dashed rounded-lg bg-transparent pointer-events-none hidden items-center justify-center"
	>
		<div
			class="bg-gruvdbg1 text-md text-gruvdfg1 px-8 py-3 border-2 border-gruvdbg4 border-dashed rounded-full select-none"
		>
			{resizingSize[0]} x {resizingSize[1]}
		</div>
	</div>

	<div
		bind:this={resizeHandle}
		class="absolute bottom-[-2px] right-[-2px] border-4 border-t-transparent border-l-transparent border-b-gruvdfg4 border-r-gruvdfg4 rounded-br-lg w-[15px] h-[15px] cursor-nwse-resize"
	></div>

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
