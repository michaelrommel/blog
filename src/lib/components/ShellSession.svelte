<script>
	import { onDestroy, onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import { debounce, throttle } from "lodash-es";

	import FabricHandler from "./shell/FabricHandler.js";
	import TermWindow from "./shell/TermWindow.svelte";

	import { Encrypt } from "./shell/encrypt";
	import { createLock } from "./shell/lock";
	import { Srocket } from "./shell/srocket";

	import { makeToast } from "./shell/toast";
	import { settings } from "./shell/settings";

	import Chat from "./shell/ui/Chat.svelte";
	import ChooseName from "./shell/ui/ChooseName.svelte";
	import NameList from "./shell/ui/NameList.svelte";
	import NetworkInfo from "./shell/ui/NetworkInfo.svelte";
	import SettingsDialog from "./shell/ui/SettingsDialog.svelte";
	import Toolbar from "./shell/ui/Toolbar.svelte";
	// import XTerm from "./shell/ui/XTerm.svelte";
	import Avatars from "./shell/ui/Avatars.svelte";
	import LiveCursor from "./shell/ui/LiveCursor.svelte";
	import { Eye } from "lucide-svelte";

	let { id, receiveName } = $props();

	// Terminal width and height limits.
	const TERM_MIN_ROWS = 8;
	const TERM_MIN_COLS = 32;

	let fabricElement;
	let fabricContainer;
	let consoleElement;
	let fabric;
	let gridSpacing = 32;
	let center = $state([0, 0]);
	let zoom = $state(1.0);

	let terminalWindows = $state([]);

	let showChat = $state(false); // @hmr:keep
	let showSettings = $state(false); // @hmr:keep
	let showNetworkInfo = $state(false); // @hmr:keep

	let delay = 250;
	let throttled = false;
	let calls = 0;

	const resizeFabricContainer = () => {
		let headerSize = document
			.getElementById("header")
			.getBoundingClientRect();
		let footerSize = document
			.getElementById("footer")
			.getBoundingClientRect();
		// get viewport height
		let vh = Math.max(
			document.documentElement.clientHeight || 0,
			window.innerHeight || 0,
		);
		// get raw height
		let height = `${vh - headerSize.height - footerSize.height}px`;
		// account for "m-3"
		fabricContainer.style.height = `calc(${height} - 6 * var(--spacing))`;
	};

	onMount(() => {
		// window.resize event listener
		window.addEventListener("resize", function () {
			// only run if we're not throttled
			if (!throttled) {
				// actual callback action
				resizeFabricContainer();
				// we're throttled!
				throttled = true;
				// set a timeout to un-throttle
				setTimeout(function () {
					throttled = false;
				}, delay);
			}
		});

		// we observe the header because it will change on font size changes
		const headerTarget = document.getElementById("header");
		function menuObserveCallback(entries) {
			let cr = null;
			for (const entry of entries) {
				if (entry.contentRect.height !== cr) {
					cr = entry.contentRect.height;
					resizeFabricContainer();
				}
			}
		}
		const headerObserver = new ResizeObserver(menuObserveCallback);
		headerObserver.observe(headerTarget);

		fabric = new FabricHandler({
			fabricEl: fabricElement,
			consoleEl: consoleElement,
		});
		fabric.onMove((state) => {
			center = fabric.center;
			zoom = fabric.zoom;

			// Blur if the user is currently focused on a terminal.
			//
			// This makes it so that panning does not stop when the cursor happens to
			// intersect with the textarea, which absorbs wheel and touch events.
			if (document.activeElement) {
				const classList = [...document.activeElement.classList];
				if (classList.includes("xterm-helper-textarea")) {
					document.activeElement.blur();
				}
			}

			showNetworkInfo = false;
		});
	});

	const chunknums = {};
	const locks = {};

	let encrypt;
	let srocket = null;

	let connected = $state(false);
	let exitReason = $state(null);

	/** Bound "write" method for each terminal. */
	let writers = $state({});
	let termElements = $state({});
	let termWrappers = $state({});
	let userId = $state(0);
	let users = $state([]);

	let subscriptions = new Set();

	// May be undefined before `users` is first populated.
	let hasWriteAccess = $derived(
		users.find(([uid]) => uid === userId)?.[1]?.canWrite,
	);

	let moving = $state(-1); // Terminal ID that is being dragged.
	let movingOrigin = [0, 0]; // Coordinates of mouse at origin when drag started.
	let movingSize = $state(); // New [x, y] position of the dragged terminal.
	let movingIsDone = false; // Moving finished but hasn't been acknowledged.

	let resizing = $state(-1); // Terminal ID that is being resized.
	let resizingOrigin = [0, 0]; // Coordinates of top-left origin when resize started.
	let resizingSize; // Last resize message sent.
	let resizingCell = [0, 0]; // Pixel dimensions of a single terminal cell.

	let chatMessages = $state([]);
	let newMessages = $state(false);

	let serverLatencies = $state([]);
	let shellLatencies = $state([]);

	onMount(async () => {
		// The page hash sets the end-to-end encryption key.
		const key = window.location.hash?.slice(1).split(",")[0] ?? "";
		const writePassword =
			window.location.hash?.slice(1).split(",")[1] ?? null;

		encrypt = await Encrypt.new(key);
		const encryptedZeros = await encrypt.zeros();

		const writeEncryptedZeros = writePassword
			? await (await Encrypt.new(writePassword)).zeros()
			: null;

		srocket = new Srocket(`/shell/api/session/${id}`, {
			onMessage(message) {
				if (message.hello) {
					userId = message.hello[0];
					receiveName(message.hello[1]);
					makeToast({
						kind: "success",
						message: `Connected to the server.`,
					});
					exitReason = null;
				} else if (message.invalidAuth) {
					exitReason =
						"The URL is not correct, invalid end-to-end encryption key.";
					srocket?.dispose();
				} else if (message.chunks) {
					let [id, seqnum, chunks] = message.chunks;
					locks[id](async () => {
						await tick();
						chunknums[id] += chunks.length;
						for (const data of chunks) {
							const buf = await encrypt.segment(
								0x100000000n | BigInt(id),
								BigInt(seqnum),
								data,
							);
							seqnum += data.length;
							writers[id](new TextDecoder().decode(buf));
						}
					});
				} else if (message.users) {
					users = message.users;
				} else if (message.userDiff) {
					const [id, update] = message.userDiff;
					users = users.filter(([uid]) => uid !== id);
					if (update !== null) {
						users = [...users, [id, update]];
					}
				} else if (message.shells) {
					for (const [id, size] of message.shells) {
						let found = false;
						for (const tw of terminalWindows) {
							if (tw.id !== id) continue;
							tw.x = size.x;
							tw.y = size.y;
							tw.rows = size.rows;
							tw.cols = size.cols;
							found = true;
						}
						if (!found)
							[
								terminalWindows.push({
									id,
									z: id,
									x: size.x,
									y: size.y,
									rows: size.rows,
									cols: size.cols,
								}),
							];
					}
					if (movingIsDone) {
						moving = -1;
					}
					for (const [id] of message.shells) {
						if (!subscriptions.has(id)) {
							chunknums[id] ??= 0;
							locks[id] ??= createLock();
							subscriptions.add(id);
							srocket?.send({ subscribe: [id, chunknums[id]] });
						}
					}
				} else if (message.hear) {
					console.log(message.hear);
					const [uid, name, msg] = message.hear;
					chatMessages.push({ uid, name, msg, sentAt: new Date() });
					chatMessages = chatMessages;
					if (!showChat) newMessages = true;
				} else if (message.shellLatency !== undefined) {
					const shellLatency = Number(message.shellLatency);
					shellLatencies = [...shellLatencies, shellLatency].slice(
						-10,
					);
				} else if (message.pong !== undefined) {
					const serverLatency = Date.now() - Number(message.pong);
					serverLatencies = [...serverLatencies, serverLatency].slice(
						-10,
					);
				} else if (message.error) {
					console.warn("Server error: " + message.error);
				}
			},

			onConnect() {
				srocket?.send({
					authenticate: [encryptedZeros, writeEncryptedZeros],
				});
				if ($settings.name) {
					srocket?.send({ setName: $settings.name });
				}
				connected = true;
			},

			onDisconnect() {
				connected = false;
				subscriptions.clear();
				users = [];
				serverLatencies = [];
				shellLatencies = [];
			},

			onClose(event) {
				if (event.code === 4404) {
					exitReason = "Failed to connect: " + event.reason;
				} else if (event.code === 4500) {
					exitReason = "Internal server error: " + event.reason;
				}
			},
		});
	});

	onDestroy(() => srocket?.dispose());

	// Send periodic ping messages for latency estimation.
	onMount(() => {
		const pingIntervalId = window.setInterval(() => {
			if (srocket?.connected) {
				srocket.send({ ping: BigInt(Date.now()) });
			}
		}, 2000);
		return () => window.clearInterval(pingIntervalId);
	});

	function integerMedian(values) {
		if (values.length === 0) {
			return null;
		}
		const sorted = values.toSorted();
		const mid = Math.floor(sorted.length / 2);
		return sorted.length % 2 !== 0
			? sorted[mid]
			: Math.round((sorted[mid - 1] + sorted[mid]) / 2);
	}

	$effect(() => {
		if ($settings.name) {
			console.log("User name changed");
			srocket?.send({ setName: $settings.name });
		}
	});

	let counter = 0n;

	async function handleCreate() {
		if (hasWriteAccess === false) {
			makeToast({
				kind: "info",
				message:
					"You are in read-only mode and cannot create new terminals.",
			});
			return;
		}
		if (terminalWindows.length >= 14) {
			makeToast({
				kind: "error",
				message: "You can only create up to 14 terminals.",
			});
			return;
		}
		// const existing = terminalWindows.map(([id, winsize]) => ({
		// 	x: winsize.x,
		// 	y: winsize.y,
		// 	width: termWrappers[id].clientWidth,
		// 	height: termWrappers[id].clientHeight,
		// }));
		// const { x, y } = arrangeNewTerminal(existing);
		srocket?.send({ create: [64, 64] });
		// touchZoom.moveTo([x, y], INITIAL_ZOOM);
	}

	async function handleInput(id, data) {
		if (counter === 0n) {
			// On the first call, initialize the counter to a random 64-bit integer.
			const array = new Uint8Array(8);
			crypto.getRandomValues(array);
			counter = new DataView(array.buffer).getBigUint64(0);
		}
		const offset = counter;
		counter += BigInt(data.length); // Must increment before the `await`.
		const encrypted = await encrypt.segment(0x200000000n, offset, data);
		srocket?.send({ data: [id, encrypted, offset] });
	}

	// // Stupid hack to preserve input focus when terminals are reordered.
	// // See: https://github.com/sveltejs/svelte/issues/3973
	// let activeElement = null;

	// $effect.pre(() => {
	// 	activeElement = document.activeElement;
	// });

	// $effect(() => {
	// 	if (activeElement instanceof HTMLElement) activeElement.focus();
	// });

	// Global mouse handler logic follows, attached to the window element for smoothness.
	// onMount(() => {
	// 	// 50 milliseconds between successive terminal move updates.
	// 	const sendMove = throttle((message) => {
	// 		srocket?.send(message);
	// 	}, 200);

	// 	// 80 milliseconds between successive cursor updates.
	// 	const sendCursor = throttle((message) => {
	// 		srocket?.send(message);
	// 	}, 80);

	// 	function handleMouse(event) {
	// 		if (moving !== -1 && !movingIsDone) {
	// 			console.log("handleMouse");
	// 			const [x, y] = normalizePosition(event);
	// 			movingSize = {
	// 				...movingSize,
	// 				x: Math.round(x - movingOrigin[0]),
	// 				y: Math.round(y - movingOrigin[1]),
	// 			};
	// 			// sendMove({ move: [moving, movingSize] });
	// 		}

	// if (resizing !== -1) {
	// 	const cols = Math.max(
	// 		Math.floor(
	// 			(event.pageX - resizingOrigin[0]) / resizingCell[0],
	// 		),
	// 		TERM_MIN_COLS, // Minimum number of columns.
	// 	);
	// 	const rows = Math.max(
	// 		Math.floor(
	// 			(event.pageY - resizingOrigin[1]) / resizingCell[1],
	// 		),
	// 		TERM_MIN_ROWS, // Minimum number of rows.
	// 	);
	// 	if (rows !== resizingSize.rows || cols !== resizingSize.cols) {
	// 		resizingSize = { ...resizingSize, rows, cols };
	// 		srocket?.send({ move: [resizing, resizingSize] });
	// 	}
	// }

	// sendCursor({ setCursor: normalizePosition(event) });
	// 	}

	// 	function handleMouseEnd(event) {
	// 		if (moving !== -1) {
	// 			console.log("handleMouseEnd");
	// 			movingIsDone = true;
	// 			// sendMove.cancel();
	// 			// srocket?.send({ move: [moving, movingSize] });
	// 		}

	// 		// if (resizing !== -1) {
	// 		// 	resizing = -1;
	// 		// }

	// 		// if (event.type === "mouseleave") {
	// 		// 	sendCursor.cancel();
	// 		// 	srocket?.send({ setCursor: null });
	// 		// }
	// 	}

	// 	window.addEventListener("mousemove", handleMouse);
	// 	window.addEventListener("mouseup", handleMouseEnd);
	// 	// document.body.addEventListener("mouseleave", handleMouseEnd);
	// 	return () => {
	// 		window.removeEventListener("mousemove", handleMouse);
	// 		window.removeEventListener("mouseup", handleMouseEnd);
	// 		// document.body.removeEventListener("mouseleave", handleMouseEnd);
	// 	};
	// });

	// let focused = [];
	// $effect(() => {
	// 	setFocus(focused);
	// });

	// // Wait a small amount of time, since blur events happen before focus events.
	// const setFocus = debounce((focused) => {
	// 	console.log("setFocus");
	// 	srocket?.send({ setFocus: focused[0] ?? null });
	// }, 20);

	const focusWindow = (id) => {
		let num_of_windows = terminalWindows.length;
		let order = num_of_windows - 1;
		terminalWindows = terminalWindows
			.sort((a, b) => {
				return a.z == b.z ? 0 : a.z > b.z ? -1 : 1;
			})
			.map((win) => {
				if (win.id == id) {
					win.z = num_of_windows;
				} else {
					win.z = order;
					order = order - 1;
				}
				return win;
			});
	};

	// this function is used to scroll to the top of the fabric and
	// all the way to the left. So the users can doubletap the canvas
	// and return to a safe spot, where they are able to use the
	// normal device zoom functions again.
	const scrollToEdge = () => {
		window.scrollTo(0, fabric.fabricOffset[1]);
	};
</script>

<div
	id="fabricContainer"
	bind:this={fabricContainer}
	class="flex"
	style:height="200px"
>
	<div class="w-16">pinch</div>
	<div class="relative h-full flex-grow">
		<div
			class="absolute inset-0 -z-10 bg-[#212121]"
			style:background-image="radial-gradient(#404040 {1.5 * zoom}px,
			transparent 0), radial-gradient(#8800ff {5 * zoom}px, transparent 0)"
			style:background-size="{gridSpacing * zoom}px {gridSpacing *
				zoom}px, {gridSpacing * zoom}px {gridSpacing * zoom}px"
			style:background-repeat="repeat, no-repeat"
			style:background-position="{zoom * (center[0] - gridSpacing / 2)}px {zoom *
				(center[1] - gridSpacing / 2)}px, {zoom *
				(center[0] - gridSpacing / 2)}px {zoom *
				(center[1] - gridSpacing / 2)}px"
		></div>
		<div
			class="absolute top-[0px] inset-0 overflow-hidden touch-none"
			bind:this={fabricElement}
			ondblclick={scrollToEdge}
			role="none"
		>
			{#each terminalWindows as terminalWindow, i (terminalWindow.id)}
				<!-- {@const ws = id === moving ? movingSize : terminalWindow} -->
				<TermWindow
					{center}
					{zoom}
					bind:terminalWindow={terminalWindows[i]}
					bind:write={writers[terminalWindow.id]}
					{focusWindow}
				/>
			{/each}
		</div>
		<div
			class="absolute bottom-0 inset-x-0 px-2 h-24 bg-emerald-200 text-zinc-800"
		>
			<pre id="console" bind:this={consoleElement}></pre>
		</div>
	</div>
</div>
<!-- <main -->
<!-- 	class="p-8" -->
<!-- 	class:cursor-nwse-resize={resizing !== -1} -->
<!-- 	onwheel={(event) => event.preventDefault()} -->
<!-- > -->
<!-- <div -->
<!-- 	class="absolute top-100px inset-x-0 flex justify-center pointer-events-none z-10" -->
<!-- > -->
<!-- 	<Toolbar -->
<!-- 		{connected} -->
<!-- 		{newMessages} -->
<!-- 		{hasWriteAccess} -->
<!-- 		createTerminal={handleCreate} -->
<!-- 		toggleChat={() => { -->
<!-- 			showChat = !showChat; -->
<!-- 			newMessages = false; -->
<!-- 		}} -->
<!-- 		toggleSettings={() => { -->
<!-- 			showSettings = true; -->
<!-- 		}} -->
<!-- 		toggleNetworkInfo={() => { -->
<!-- 			showNetworkInfo = !showNetworkInfo; -->
<!-- 		}} -->
<!-- 	/> -->

<!-- 	{#if showNetworkInfo} -->
<!-- 		<div class="absolute"> -->
<!-- 			<NetworkInfo -->
<!-- 				status={connected -->
<!-- 					? "connected" -->
<!-- 					: exitReason -->
<!-- 						? "no-shell" -->
<!-- 						: "no-server"} -->
<!-- 				serverLatency={integerMedian(serverLatencies)} -->
<!-- 				shellLatency={integerMedian(shellLatencies)} -->
<!-- 			/> -->
<!-- 		</div> -->
<!-- 	{/if} -->
<!-- </div> -->

<!-- {#if showChat} -->
<!-- 	<div -->
<!-- 		class="absolute flex flex-col justify-end inset-y-14 right-4 top-28 w-80 pointer-events-none z-10" -->
<!-- 	> -->
<!-- 		<Chat -->
<!-- 			{userId} -->
<!-- 			messages={chatMessages} -->
<!-- 			chatevent={(text) => srocket?.send({ chat: text })} -->
<!-- 			close={() => (showChat = false)} -->
<!-- 		/> -->
<!-- 	</div> -->
<!-- {/if} -->

<!-- <SettingsDialog bind:isopen={showSettings} /> -->
<!-- <ChooseName /> -->

<!--
    Dotted circle background appears underneath the rest of the elements, but
    moves and zooms with the fabric of the canvas.
  -->

<!-- <div class="py-2"> -->
<!-- 	{#if exitReason !== null} -->
<!-- 		<div class="text-red-400">{exitReason}</div> -->
<!-- 	{:else if connected} -->
<!-- 		<div class="flex items-center"> -->
<!-- 			<div class="text-green-400">You are connected!</div> -->
<!-- 			{#if userId && hasWriteAccess === false} -->
<!-- 				<div -->
<!-- 					class="bg-yellow-900 text-yellow-200 px-1 py-0.5 rounded ml-3 inline-flex items-center gap-1" -->
<!-- 				> -->
<!-- 					<Eye size="14" /> -->
<!-- 					<span class="text-xs">Read-only</span> -->
<!-- 				</div> -->
<!-- 			{/if} -->
<!-- 		</div> -->
<!-- 	{:else} -->
<!-- 		<div class="text-yellow-400">Connecting…</div> -->
<!-- 	{/if} -->

<!-- 	<div class="mt-4"> -->
<!-- 		<NameList {users} /> -->
<!-- 	</div> -->
<!-- </div> -->

<!-- <div -->
<!-- 	class="absolute inset-0 overflow-hidden touch-none" -->
<!-- 	id="fabricEl" -->
<!-- 	bind:this={fabricEl} -->
<!-- > -->
<!-- <div -->
<!-- 	id="termwrapper" -->
<!-- 	class="absolute" -->
<!-- 	style:left={OFFSET_LEFT_CSS} -->
<!-- 	style:top={OFFSET_TOP_CSS} -->
<!-- 	style:transform-origin={OFFSET_TRANSFORM_ORIGIN_CSS} -->
<!-- 	transition:fade|local -->
<!-- 	use:slide={{ -->
<!-- 		x: ws.x, -->
<!-- 		y: ws.y, -->
<!-- 		center, -->
<!-- 		zoom, -->
<!-- 		immediate: id === moving, -->
<!-- 	}} -->
<!-- 	bind:this={termWrappers[id]} -->
<!-- > -->
<!-- 	<XTerm -->
<!-- 		{setupTestEventlisteners} -->
<!-- 		rows={ws.rows} -->
<!-- 		cols={ws.cols} -->
<!-- 		bind:write={writers[id]} -->
<!-- 		bind:termEl={termElements[id]} -->
<!-- 		dataevent={(data) => -->
<!-- 			hasWriteAccess && handleInput(id, data)} -->
<!-- 		close={() => { -->
<!-- 			console.log("Closing Terminal"); -->
<!-- 			srocket?.send({ close: id }); -->
<!-- 		}} -->
<!-- 		bringToFront={() => { -->
<!-- 			console.log("bringToFront"); -->
<!-- 			if (!hasWriteAccess) return; -->
<!-- 			showNetworkInfo = false; -->
<!-- 			srocket?.send({ move: [id, null] }); -->
<!-- 		}} -->
<!-- 		startMove={(event) => { -->
<!-- 			console.log("startMove"); -->
<!-- 			if (!hasWriteAccess) return; -->
<!-- 			const [x, y] = normalizePosition(event); -->
<!-- 			// the setting of movingSize has to come first, because -->
<!-- 			// if we set moving first, the browser re-renders so fast -->
<!-- 			// that there is then an error that ws is not set. -->
<!-- 			movingSize = ws; -->
<!-- 			movingOrigin = [x - ws.x, y - ws.y]; -->
<!-- 			movingIsDone = false; -->
<!-- 			moving = id; -->
<!-- 		}} -->
<!-- 		focus={() => { -->
<!-- 			if (!hasWriteAccess) return; -->
<!-- 			focused = [...focused, id]; -->
<!-- 		}} -->
<!-- 		blur={() => { -->
<!-- 			focused = focused.filter((i) => i !== id); -->
<!-- 		}} -->
<!-- 	/> -->

<!-- User avatars -->
<!-- <div class="absolute bottom-2.5 right-2.5 pointer-events-none"> -->
<!-- 	<Avatars -->
<!-- 		users={users.filter( -->
<!-- 			([uid, user]) => -->
<!-- 				uid !== userId && user.focus === id, -->
<!-- 		)} -->
<!-- 	/> -->
<!-- </div> -->

<!-- Interactable element for resizing -->
<!-- <div -->
<!-- 	class="absolute w-5 h-5 -bottom-1 -right-1 cursor-nwse-resize" -->
<!-- 	onmousedown={(event) => { -->
<!-- 		const canvasEl = -->
<!-- 			termElements[id].querySelector(".xterm-screen"); -->
<!-- 		if (canvasEl) { -->
<!-- 			resizing = id; -->
<!-- 			const r = canvasEl.getBoundingClientRect(); -->
<!-- 			resizingOrigin = [ -->
<!-- 				event.pageX - r.width, -->
<!-- 				event.pageY - r.height, -->
<!-- 			]; -->
<!-- 			resizingCell = [ -->
<!-- 				r.width / ws.cols, -->
<!-- 				r.height / ws.rows, -->
<!-- 			]; -->
<!-- 			resizingSize = ws; -->
<!-- 		} -->
<!-- 	}} -->
<!-- 	onpointerdown={(event) => event.stopPropagation()} -->
<!-- 	role="none" -->
<!-- ></div> -->
<!-- </div> -->

<!-- {#each users.filter(([id, user]) => id !== userId && user.cursor !== null) as [id, user] (id)} -->
<!-- 	<div -->
<!-- 		class="absolute" -->
<!-- 		style:left={OFFSET_LEFT_CSS} -->
<!-- 		style:top={OFFSET_TOP_CSS} -->
<!-- 		style:transform-origin={OFFSET_TRANSFORM_ORIGIN_CSS} -->
<!-- 		transition:fade|local={{ duration: 200 }} -->
<!-- 		use:slide={{ -->
<!-- 			x: user.cursor?.[0] ?? 0, -->
<!-- 			y: user.cursor?.[1] ?? 0, -->
<!-- 			center, -->
<!-- 			zoom, -->
<!-- 		}} -->
<!-- 	> -->
<!-- 		<LiveCursor {user} /> -->
<!-- 	</div> -->
<!-- {/each} -->
