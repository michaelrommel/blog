<!-- @component Interactive terminal rendered with xterm.js -->
<script module>
	import { makeToast } from "$lib/components/shell/toast";

	// Deduplicated terminal font loading.
	// const waitForFonts = (() => {
	// 	let state = "initial";
	// 	const waitlist = [];

	// 	return async function waitForFonts() {
	// 		if (state === "loaded") return;
	// 		else if (state === "initial") {
	// 			const FontFaceObserver = (await import("fontfaceobserver"))
	// 				.default;
	// 			state = "loading";
	// 			try {
	// 				await new FontFaceObserver("Victor Mono NF").load();
	// 			} catch (error) {
	// 				console.log("Could not load font");
	// 				makeToast({
	// 					kind: "error",
	// 					message: `Could not load terminal font.${error}`,
	// 				});
	// 			}
	// 			state = "loaded";
	// 			for (const fn of waitlist) fn();
	// 		} else {
	// 			await new Promise((resolve) => {
	// 				if (state === "loaded") resolve();
	// 				else waitlist.push(resolve);
	// 			});
	// 		}
	// 	};
	// })();
</script>

<script>
	import { browser } from "$app/environment";

	import { onDestroy, onMount } from "svelte";

	import themes from "./themes";
	import CircleButton from "./CircleButton.svelte";
	import CircleButtons from "./CircleButtons.svelte";
	import { settings } from "$lib/components/shell/settings";

	/** Used to determine Cmd versus Ctrl keyboard shortcuts. */
	const isMac = browser && navigator.platform.startsWith("Mac");

	let {
		setupTestEventlisteners,
		rows,
		cols,
		write = $bindable(),
		termEl = $bindable(),
		focus,
		blur,
		dataevent,
		bringToFront,
		startMove,
		close,
		shrink,
		expand,
	} = $props();

	let term = null;
	let theme = $derived(themes[$settings.theme]);

	$effect(() => {
		if (term) {
			// If the theme changes, update existing terminals' appearance.
			term.options.theme = theme;
			term.options.scrollback = $settings.scrollback;
		}
	});

	let loaded = $state(false);
	let focused = $state(false);
	let currentTitle = $state("Remote Terminal");

	function handleWheelSkipXTerm(event) {
		event.preventDefault(); // Stop native macOS Chrome zooming on pinch.

		// We stop the event from propagating to the main `.xterm` terminal element,
		// so the xterm.js's event handlers do not fire and scroll the buffer.
		event.stopPropagation();

		// However, we still want it to propagate upward to our pan/zoom handlers,
		// so we re-dispatch the event higher up, skipping xterm.
		termEl?.dispatchEvent(new WheelEvent(event.type, event));
	}

	function setFocused(isFocused, cursorLayer) {
		if (isFocused && !focused) {
			focused = isFocused;
			cursorLayer.removeEventListener("wheel", handleWheelSkipXTerm);
			focus();
		} else if (!isFocused && focused) {
			focused = isFocused;
			cursorLayer.addEventListener("wheel", handleWheelSkipXTerm);
			blur();
		}
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

	$effect(() => {
		// looks stupid, but otherwise effect would only trigger
		// again when term changes, not when cols/rows changes
		const c = cols;
		const r = rows;
		term?.resize(c, r);
	});

	onMount(async () => {
		const [{ Terminal }, { WebglAddon }, { ImageAddon }] =
			await Promise.all([
				import("@xterm/xterm"),
				import("@xterm/addon-webgl"),
				import("@xterm/addon-image"),
			]);

		// await waitForFonts();

		term = new Terminal({
			allowTransparency: false,
			cursorBlink: false,
			cursorStyle: "block",
			// This is the monospace font family configured in Tailwind.
			fontFamily:
				'"Victor Mono NF", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
			fontSize: 17,
			fontWeight: 400,
			fontWeightBold: 500,
			lineHeight: 1.06,
			scrollback: $settings.scrollback,
			theme,
		});

		// Keyboard shortcuts for natural text editing.
		// term.attachCustomKeyEventHandler((event) => {
		// 	if (
		// 		(isMac && event.metaKey && !event.ctrlKey && !event.altKey) ||
		// 		(!isMac && !event.metaKey && event.ctrlKey && !event.altKey)
		// 	) {
		// 		if (event.key === "ArrowLeft") {
		// 			dataevent(new Uint8Array([0x01]));
		// 			return false;
		// 		} else if (event.key === "ArrowRight") {
		// 			dataevent(new Uint8Array([0x05]));
		// 			return false;
		// 		} else if (event.key === "Backspace") {
		// 			dataevent(new Uint8Array([0x15]));
		// 			return false;
		// 		}
		// 	}
		// 	return true;
		// });

		term.loadAddon(new WebglAddon());
		term.loadAddon(new ImageAddon({ enableSizeReports: true }));

		term.open(termEl);

		term.resize(cols, rows);
		term.onTitleChange((title) => {
			currentTitle = title;
		});

		// Hack: We artificially disable scrolling when the terminal is not focused.
		// ("termEl" > div.terminal.xterm > div.xterm-screen)
		const screenEl = termEl.querySelector(".xterm-screen");
		screenEl.addEventListener("wheel", handleWheelSkipXTerm);

		const focusObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class"
				) {
					// The "focus" class is set directly by xterm.js, but there isn't any way to listen for it.
					const target = mutation.target;
					const isFocused = target.classList.contains("focus");
					setFocused(isFocused, screenEl);
				}
			}
		});
		focusObserver.observe(term.element, { attributeFilter: ["class"] });

		loaded = true;
		for (const data of preloadBuffer) {
			term.write(data);
		}

		const utf8 = new TextEncoder();
		term.onData((data) => {
			dataevent(utf8.encode(data));
		});
		term.onBinary((data) => {
			console.log("Binary Data");
			// dispatch("data", Buffer.from(data, "binary"));
			dataevent(data);
		});

		setupTestEventlisteners(document);
	});

	onDestroy(() => term?.dispose());
</script>

<div
	id="termcontainer"
	class="term-container inline-block rounded-lg border border-zinc-700 opacity-90"
	class:focused
	style:background={theme.background}
	role="none"
	onmousedown={bringToFront}
	onpointerdown={(event) => event.stopPropagation()}
>
	<div
		id="termwindow"
		class="flex select-none"
		role="none"
		onmousedown={(event) => startMove(event)}
	>
		<div id="termtitlebar" class="flex-1 flex items-center px-3">
			<CircleButtons>
				<!--
          TODO: This should be on:click, but that is not working due to the
          containing element's on:pointerdown `stopPropagation()` call.
        -->
				<CircleButton
					kind="red"
					onclick={(event) => event.button === 0 && close()}
				/>
				<CircleButton
					kind="yellow"
					onclick={(event) => event.button === 0 && shrink()}
				/>
				<CircleButton
					kind="green"
					onclick={(event) => event.button === 0 && expand()}
				/>
			</CircleButtons>
		</div>
		<div
			class="p-2 text-sm text-zinc-300 text-center font-medium overflow-hidden whitespace-nowrap text-ellipsis w-0 flex-grow-[4]"
		>
			{currentTitle}
		</div>
		<div class="flex-1"></div>
	</div>
	<div
		id="termEl"
		bind:this={termEl}
		style:opacity={loaded ? 1.0 : 0.0}
		onwheel={(event) => {
			if (focused) {
				// Don't pan the page when scrolling while the terminal is selected.
				// Conversely, we manually disable terminal scrolling unless it is currently selected.
				event.stopPropagation();
			}
		}}
	></div>
</div>
