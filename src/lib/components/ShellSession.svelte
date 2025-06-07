<script>
	import { onDestroy, onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import { on } from "svelte/events";

	import { throttle, integerMedian } from "$lib/utils.js";
	import { toast } from "svelte-sonner";

	import FabricHandler from "./shell/FabricHandler.js";

	import { ReconWS } from "./shell/reconws.js";
	import { Encrypt } from "./shell/encrypt.js";
	import { createLock } from "./shell/lock.js";

	import { settings } from "./shell/settings.js";

	import TermWindow from "./shell/TermWindow.svelte";
	import LiveCursor from "./shell/LiveCursor.svelte";
	import Toolbar from "./shell/Toolbar.svelte";
	import Chat from "./shell/Chat.svelte";
	import BuddyList from "./shell/BuddyList.svelte";
	import ChooseName from "./shell/ChooseName.svelte";
	import SettingsDialog from "./shell/SettingsDialog.svelte";

	let { id, receiveName } = $props();

	// DOM Element where the fabric is mounted
	let fabricElement;
	// enclosing container, needed for proper resizing
	let fabricContainer;
	// a debug console for tablets and such, where console.log is difficult
	let consoleElement;

	// the fabric instance
	let fabric;
	let gridSpacing = 32;
	let center = $state([0, 0]);
	let zoom = $state(1.0);

	const DEBUG = false;
	// let terminalWindows = $state([
	// 	{ id: 1, z: 1, x: 96, y: 32, rows: 24, cols: 80 },
	// 	{ id: 2, z: 3, x: 0, y: 0, rows: 24, cols: 80 },
	// 	{ id: 3, z: 2, x: 64, y: 64, rows: 24, cols: 80 },
	// ]);

	// the individual terminal windows
	let terminalWindows = $state([]);
	// Bound "write" method for each terminal.
	let writers = $state({});
	// Terminal ID that is being dragged. This is being set in the
	// TermWindow component itself and reported back here.
	let movingId = $state(-1);

	// toggles for UI elements
	let showChat = $state(false); // @hmr:keep
	let showSettings = $state(false); // @hmr:keep
	let showNetworkInfo = $state(false); // @hmr:keep

	// a method of resizing the fabric container to fill the whole viewport
	const _resizeFabricContainer = () => {
		// the binding may not be establised by now
		if (!fabricContainer) {
			return;
		}
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
		// account for "m-3" on the outer enclosing element. I did not want
		// to change that, because it is nice to have some separation from the
		// browser's edge not only for articles. One pixel for Firefox, which
		// miraculously started adding a scrollbar.
		fabricContainer.style.height = `calc(${height} - 6 * var(--spacing) - 1px)`;
		// console.log(`resize: ${height}`);
	};

	// all functions for maintaining the fabric
	onMount(() => {
		let headerHeight = null;
		let windowHeight = null;

		// at max every 250ms actually resize the container
		let resizeFabricContainer = throttle(_resizeFabricContainer, 250, {
			leading: true,
			trailing: true,
		});

		// window.resize event listener
		window.addEventListener("resize", function () {
			if (window.innerHeight !== windowHeight) {
				windowHeight = window.innerHeight;
				resizeFabricContainer();
			}
		});

		// we observe the header because it will change on font size changes
		const headerTarget = document.getElementById("header");
		function menuObserveCallback(entries) {
			for (const entry of entries) {
				if (entry.contentRect.height !== headerHeight) {
					headerHeight = entry.contentRect.height;
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
		fabric.onMove(() => {
			center = fabric.center;
			zoom = fabric.zoom;
		});
	});

	// communication functions and variables
	const chunknums = {};
	const locks = {};

	let encrypt;
	let ws = null;
	let counter = 0n;

	let connected = $state(false);
	let exitReason = $state(null);

	let subscriptions = new Set();

	let userId = $state(0);
	let users = $state([]);

	// May be undefined before `users` is first populated.
	let hasWriteAccess = $derived(
		users.find(([uid]) => uid === userId)?.[1]?.canWrite,
	);

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

		// /shell/api is passed on by nginx to the sshx server instance on localhost
		ws = new ReconWS(`/shell/api/session/${id}`, {
			onMessage(message) {
				if (message.hello) {
					userId = message.hello[0];
					receiveName(message.hello[1]);
					toast.success("Connected to the server", {
						duration: 3000,
					});
					exitReason = null;
				} else if (message.invalidAuth) {
					exitReason =
						"The URL is not correct, invalid end-to-end encryption key.";
					toast.error(exitReason, {
						duration: 30000,
					});
					ws?.dispose();
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
					// complete update on the user list
					users = message.users;
				} else if (message.userDiff) {
					// differential update of single users, used a lot for updating
					// user cursor positions
					const [id, update] = message.userDiff;
					// keep all other users, except the one in the message
					users = users.filter(([uid]) => uid !== id);
					// add the user back, but only if there is an actual user
					// object provided, otherwise the user stays removed
					if (update !== null) {
						users = [...users, [id, update]];
					}
				} else if (message.shells) {
					// console.log(message.shells);
					// update on the set of terminal windows
					let toBeClosed = terminalWindows.map((tw) => tw.id);
					// we remember how many terminals there were
					// for the z stacking order.
					let maxZ = toBeClosed.length;
					for (const [id, size] of message.shells) {
						toBeClosed = toBeClosed.filter((tw) => tw !== id);
						// iterate over all shells, old and new
						let found = false;
						for (const tw of terminalWindows) {
							// look at the existing list, which has slightly
							// different attributes and I want to keep that because
							// it simplifies state management in the TermWindow component
							if (tw.id !== id) continue;
							found = true;
							// take over attributes only if the window is *not* locally moved
							if (id === movingId) continue;
							// we found an existing entry, take over only the
							// portions that the server maintains
							tw.x = size.x;
							tw.y = size.y;
							tw.rows = size.rows;
							tw.cols = size.cols;
						}
						if (!found) {
							// this is a new terminal window that the server
							// sent us. Maybe another user added it.
							// here would be the place to add additional parameters
							// that the TermWindow component needs
							maxZ += 1;
							terminalWindows.push({
								id, // the terminal ID
								z: maxZ, // the z stacking order of the terminal
								x: size.x,
								y: size.y,
								rows: size.rows,
								cols: size.cols,
							});
						}
						if (!subscriptions.has(id)) {
							chunknums[id] ??= 0;
							locks[id] ??= createLock();
							subscriptions.add(id);
							ws?.send({ subscribe: [id, chunknums[id]] });
						}
					}
					// remove closed terminals
					// if (toBeClosed.length > 0) {
					// 	console.log(
					// 		`need to close window ${JSON.stringify(toBeClosed)}`,
					// 	);
					// }
					terminalWindows = terminalWindows.filter(
						(tw) => !toBeClosed.includes(tw.id),
					);
					restackTerminals(null);
				} else if (message.hear) {
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
				ws?.send({
					authenticate: [encryptedZeros, writeEncryptedZeros],
				});
				if ($settings.name) {
					ws?.send({ setName: $settings.name });
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

	onDestroy(() => ws?.dispose());

	// Send periodic ping messages for latency estimation.
	onMount(() => {
		const pingIntervalId = window.setInterval(() => {
			if (ws?.connected) {
				ws.send({ ping: BigInt(Date.now()) });
			}
		}, 2000);
		return () => window.clearInterval(pingIntervalId);
	});

	$effect(() => {
		if ($settings.name) {
			// console.log("settings: user name changed");
			ws?.send({ setName: $settings.name });
		}
	});

	$effect(() => {
		// this effect runs, when the terminalWindows change. This can
		// happen, when we locally move a window or when somebody else moves
		// it. In order to avoid loops, we send moves to the server only for
		// terminals, when they are locally moved.
		for (const tw of terminalWindows) {
			if (tw.id === movingId) {
				// this is the locally moving window, report to the server
				updateServer(tw);
				// console.log(
				// 	"effect session: " +
				// 		JSON.stringify($state.snapshot(terminalWindows)),
				// );
			}
		}
	});

	// this function does not check for moving windows so we can use it
	// to send a resize triggered by a toolbar button to the server
	const updateServer = (tw, force = false) => {
		if (force) {
			ws?.send({
				move: [
					tw.id,
					{ x: tw.x, y: tw.y, rows: tw.rows, cols: tw.cols },
				],
			});
		} else {
			sendMove({
				move: [
					tw.id,
					{ x: tw.x, y: tw.y, rows: tw.rows, cols: tw.cols },
				],
			});
		}
	};
	// 50 milliseconds between successive terminal move updates.
	const sendMove = throttle((message) => {
		ws?.send(message);
	}, 100);

	async function handleCreate() {
		if (hasWriteAccess === false) {
			toast.info(
				"You are in read-only mode and cannot create new terminals.",
				{
					duration: 5000,
				},
			);
			return;
		}
		if (terminalWindows.length >= 4) {
			toast.error("You can only create up to 4 terminals.", {
				duration: 5000,
			});
			return;
		}
		ws?.send({ create: [64, 64] });
	}

	async function onData(id, data) {
		// console.log(data);
		if (counter === 0n) {
			// On the first call, initialize the counter to a random 64-bit integer.
			const array = new Uint8Array(8);
			crypto.getRandomValues(array);
			counter = new DataView(array.buffer).getBigUint64(0);
		}
		const offset = counter;
		counter += BigInt(data.length); // Must increment before the `await`.
		const encrypted = await encrypt.segment(0x200000000n, offset, data);
		ws?.send({ data: [id, encrypted, offset] });
	}

	// let focused = [];
	// $effect(() => {
	// 	setFocus(focused);
	// });

	// // Wait a small amount of time, since blur events happen before focus events.
	// const setFocus = debounce((focused) => {
	// 	console.log("setFocus");
	// 	srocket?.send({ setFocus: focused[0] ?? null });
	// }, 20);

	// nn milliseconds between successive cursor updates.
	const sendCursor = throttle(
		(message) => {
			// fabric._consolelog(`cursor: ${JSON.stringify(message)}`);
			ws?.send(message);
		},
		100,
		{ leading: true, trailing: true },
	);

	const getFabricOffset = () => [
		fabricElement?.getBoundingClientRect().x +
			(window.pageXOffset || window.scrollX),
		fabricElement?.getBoundingClientRect().y +
			(window.pageYOffset || window.scrollY),
	];

	const pointerMove = (coords) => {
		if (!coords) sendCursor({ setCursor: null });
		else {
			const fabricOffset = getFabricOffset();
			let x = Math.round(
				(coords[0] - fabricOffset[0]) / zoom - center[0],
			);
			let y = Math.round(
				(coords[1] - fabricOffset[1]) / zoom - center[1],
			);
			sendCursor({ setCursor: [x, y] });
		}
	};

	onMount(() => {
		function handlePointer(event) {
			const coords = [event.pageX, event.pageY];
			pointerMove(coords);
		}
		on(fabricElement, "pointerenter", handlePointer);
		on(fabricElement, "pointermove", handlePointer);
	});

	const restackTerminals = (frontId) => {
		// console.log(`restack: ${frontId}`);
		// console.log($state.snapshot(terminalWindows));
		// map of ids in z-descending order
		const stackMap = terminalWindows
			.map((win) => [win.z, win.id])
			.sort((a, b) => {
				return a[0] == b[0] ? 0 : a[0] > b[0] ? -1 : 1;
			});
		let num_of_windows = stackMap.length;
		let maxZ = num_of_windows;
		const reorderedTerminalWindows = [];
		stackMap.forEach(([, id]) => {
			const tw = { ...terminalWindows.filter((tw) => tw.id === id)[0] };
			// if we have been given a frontId, this window shall
			// receive the topmost z value
			if (frontId) {
				if (tw.id === frontId) {
					tw.z = maxZ;
				} else {
					tw.z = --num_of_windows;
				}
			} else {
				tw.z = num_of_windows--;
			}
			reorderedTerminalWindows.push(tw);
		});
		// console.log(reorderedTerminalWindows);
		terminalWindows = reorderedTerminalWindows;
	};

	// this function is used to scroll to the top of the fabric and
	// all the way to the left. So the users can doubletap the canvas
	// and return to a safe spot, where they are able to use the
	// normal device zoom functions again.
	const scrollToEdge = () => {
		window.scrollTo(0, fabric.fabricOffset[1]);
	};

	const collectWindows = () => {
		fabric.center = [gridSpacing, gridSpacing];
		center = fabric.center;
		if (!hasWriteAccess) return;
		let offset = 1;
		const stackMap = terminalWindows
			.map((win) => [win.z, win.id])
			.sort((a, b) => {
				return a[0] == b[0] ? 0 : a[0] > b[0] ? -1 : 1;
			});
		const reorderedTerminalWindows = [];
		stackMap.forEach(([, id]) => {
			const tw = { ...terminalWindows.filter((tw) => tw.id === id)[0] };
			tw.x = offset * gridSpacing;
			tw.y = offset * gridSpacing;
			offset += 1;
			reorderedTerminalWindows.push(tw);
		});
		terminalWindows = reorderedTerminalWindows;
		reorderedTerminalWindows.forEach((tw) => updateServer(tw, true));
		scrollToEdge();
	};

	const sl = (node, userId) => {
		$effect(() => {
			let user = users.filter(
				([id, user]) => id === userId && user.cursor !== null,
			)[0][1];
			let cursorX = Math.round(user.cursor?.[0] + center?.[0]);
			let cursorY = Math.round(user.cursor?.[1] + center?.[1]);
			let transform = `scale(${(zoom * 100).toFixed(3)}%) translate3d(${cursorX}px, ${cursorY}px, 0px)`;
			node.style.transform = transform;
			// fabric._consolelog(JSON.stringify($state.snapshot(user)));
			// fabric._consolelog(
			// 	JSON.stringify($state.snapshot(terminalWindows)),
			// );
			// fabric._consolelog(JSON.stringify($state.snapshot(center)));
		});
	};
</script>

<div
	id="fabricContainer"
	bind:this={fabricContainer}
	class="flex overflow-hidden"
	style:height="600px"
>
	<Toolbar
		{connected}
		{hasWriteAccess}
		{newMessages}
		createTerminal={handleCreate}
		{collectWindows}
		toggleChat={() => {
			showChat = !showChat;
			newMessages = false;
		}}
		toggleSettings={() => {
			showSettings = !showSettings;
		}}
		toggleNetworkInfo={() => {
			showNetworkInfo = !showNetworkInfo;
		}}
		serverLatency={integerMedian(serverLatencies)}
		shellLatency={integerMedian(shellLatencies)}
		status={connected ? "connected" : exitReason ? "no shell" : "no server"}
	/>

	<div class="relative h-full flex-grow overflow-hidden">
		<div
			class="absolute right-0 w-40 top-0 z-10 flex flex-col rounded-md border border-gruvgray"
			in:fade|local={{ duration: 100 }}
			out:fade|local={{ duration: 75 }}
		>
			<BuddyList {users} />
		</div>
		<div
			class="absolute right-0 w-80 bottom-0 z-10 flex flex-col rounded-md border border-gruvgray"
			class:hidden={!showChat}
			style:height="clamp(30%,900px,80%)"
			in:fade|local={{ duration: 100 }}
			out:fade|local={{ duration: 75 }}
		>
			<Chat
				{showChat}
				{userId}
				messages={chatMessages}
				chatevent={(text) => ws?.send({ chat: text })}
				close={() => (showChat = false)}
			/>
		</div>
		<ChooseName />
		<SettingsDialog bind:isopen={showSettings} />
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
		{#each users.filter(([id, user]) => id !== userId && user.cursor !== null) as [id, user] (id)}
			<div
				class="absolute left-0 top-0 z-99"
				style:transform-origin="left top"
				transition:fade|local
				use:sl={id}
			>
				<LiveCursor {user} />
			</div>
		{/each}
		<div
			class="absolute top-[0px] inset-0 overflow-hidden touch-none"
			bind:this={fabricElement}
			ondblclick={scrollToEdge}
			role="none"
		>
			{#each terminalWindows as terminalWindow, i (terminalWindow.id)}
				<TermWindow
					{center}
					{zoom}
					bind:terminalWindow={terminalWindows[i]}
					bind:write={writers[terminalWindow.id]}
					bind:movingId
					{hasWriteAccess}
					bringWindowToFront={restackTerminals}
					{onData}
					onClose={() => ws?.send({ close: terminalWindow.id })}
					onWindowUpdate={() => updateServer(terminalWindow)}
				/>
			{/each}
		</div>
		<div
			class="absolute bottom-0 inset-x-0 px-2 h-48 bg-gruvdbg1 text-xs"
			class:hidden={!DEBUG}
		>
			<pre
				class="absolute top-0"
				id="console"
				bind:this={consoleElement}></pre>
		</div>
	</div>
</div>

<!-- 		focus={() => { -->
<!-- 			if (!hasWriteAccess) return; -->
<!-- 			focused = [...focused, id]; -->
<!-- 		}} -->
<!-- 		blur={() => { -->
<!-- 			focused = focused.filter((i) => i !== id); -->
<!-- 		}} -->
