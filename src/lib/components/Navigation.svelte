<script context="module">
	export async function load({ session }) {
		return {
			props: {
				user: session.user || "",
			},
		};
	}
</script>

<script>
	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";
	import Menu from "lucide-svelte/icons/menu";
	import ArrowDown from "lucide-svelte/icons/a-arrow-down";
	import ArrowUp from "lucide-svelte/icons/a-arrow-up";
	import User from "lucide-svelte/icons/user-round";

	import { toggleMode } from "mode-watcher";

	import { Button } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import Logo from "$lib/components/Logo.svelte";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	const navigation = [
		{
			href: "/create",
			name: "Create",
		},
		{
			href: "/consume",
			name: "Consume",
		},
	];

	async function handleSignOut() {
		await fetch("/api/sign-out");
		goto("/");
	}

	async function gotoSignIn() {
		popoverOpen = false;
		goto("/login");
	}

	const fontBaseSizes = [
		{ value: "fb-xs", label: "xs" },
		{ value: "fb-sm", label: "sm" },
		{ value: "fb-base", label: "m" },
		{ value: "fb-lg", label: "lg" },
		{ value: "fb-xl", label: "xl" },
		{ value: "fb-2xl", label: "xxl" },
	];

	let selectedFontBaseSize = fontBaseSizes[2];

	function changeSize(classname) {
		let allFontBaseSizeValues = fontBaseSizes.map((s) => s.value);
		let currentClasses = document.documentElement.className
			.split(" ")
			.filter((s) => {
				if (!allFontBaseSizeValues.includes(s)) return s;
			});
		currentClasses.push(classname);
		document.documentElement.className = currentClasses.join(" ");
		selectedFontBaseSize = fontBaseSizes.filter(
			(s) => s.value == classname,
		)[0];
	}

	function stepFontSize(offset) {
		const values = fontBaseSizes.map((s) => s.value);
		const index = values.indexOf(selectedFontBaseSize.value);
		console.log(`Current Fontsize Index: ${index}`);
		let newIndex = index + offset;
		if (newIndex < 0) newIndex = 0;
		if (newIndex > fontBaseSizes.length - 1)
			newIndex = fontBaseSizes.length - 1;
		const newSize = values[newIndex];
		console.log(`Changing to: ${newSize}`);
		changeSize(newSize);
	}

	function decreaseFontSize() {
		stepFontSize(-1);
	}
	function increaseFontSize() {
		stepFontSize(1);
	}

	let popoverOpen = false;
	let menuTarget = null;

	function toggleAndClose() {
		popoverOpen = false;
		toggleMode();
	}

	onMount(async () => {
		menuTarget = document.getElementById("menu");
		function menuObserveCallback(entries) {
			for (const entry of entries) {
				if (entry.contentRect.width == 0) {
					popoverOpen = false;
				}
			}
		}

		const menuObserver = new ResizeObserver(menuObserveCallback);
		menuObserver.observe(menuTarget);
	});
</script>

<header
	class="sticky top-0 z-10 bg-gruvlbg/90 dark:bg-gruvdbg/90 backdrop-blur-sm overflow-auto"
>
	<nav class="mx-2 md:mx-4 lg:mx-8">
		<div
			class="w-full flex items-center justify-between text-base xs:text-lg md:text-xl lg:text-2xl"
		>
			<div
				class="grow py-2 xs:py-4 mr-2 xs:mr-4 md:mr-8 flex items-center justify-start"
			>
				<div>
					<a
						class="w-10 xs:w-12 md:w-16 ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full"
						aria-label="home page"
						href="/"
					>
						<Logo small />
					</a>
				</div>
				<div
					class="flex flex-wrap items-center text-gruvlfg dark:text-gruvdfg font-bold"
				>
					{#each navigation as link}
						<div class="ml-1 p-1 md:pl-4 lg:pl-8">
							<a
								href={link.href}
								class="hover:text-gruvblue dark:hover:text-gruvblue p-1 ring-offset-gruvlbg/90 dark:ring-offset-gruvdbg/90 focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none rounded"
							>
								{link.name}
							</a>
						</div>
					{/each}
				</div>
			</div>
			<div class="py-2 xs:py-4 flex items-center justify-end">
				<div class="md:hidden" id="menu">
					<Popover.Root bind:open={popoverOpen}>
						<Popover.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="ghost"
								class="rounded px-2 py-1"
							>
								<Menu size="1.25rem" />
							</Button>
						</Popover.Trigger>
						<Popover.Content
							class="flex flex-col w-fit items-end gap-y-2"
						>
							<div class="flex-item">
								<Button
									on:click={toggleAndClose}
									variant="outline"
									size="icon"
									class="px-2"
								>
									<Sun
										class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
									/>
									<Moon
										class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
									/>
								</Button>
							</div>
							<div class="flex-item">
								<div class="flex items-center">
									<Button
										on:click={decreaseFontSize}
										variant="outline"
										size="icon"
										class="mx-1"
									>
										<ArrowDown strokeWidth="1.7" />
									</Button>
									<Button
										on:click={increaseFontSize}
										variant="outline"
										size="icon"
										class="mx-1"
									>
										<ArrowUp strokeWidth="1.7" />
									</Button>
								</div>
							</div>
							<div class="flex-item">
								<Button variant="outline" on:click={gotoSignIn}>
									<User
										class="mr-2 size-5 text-foreground-alt"
									/>
									Sign in
								</Button>
							</div>
						</Popover.Content>
					</Popover.Root>
				</div>
				<div class="hidden md:flex items-center">
					<Button
						on:click={toggleMode}
						variant="outline"
						size="icon"
						class="px-2"
					>
						<Sun
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<Moon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
					</Button>
					<Button
						on:click={decreaseFontSize}
						variant="outline"
						size="icon"
						class="px-1 ml-2 mr-1"
					>
						<ArrowDown strokeWidth="1.7" />
					</Button>
					<Button
						on:click={increaseFontSize}
						variant="outline"
						size="icon"
						class="px-1 mr-2"
					>
						<ArrowUp strokeWidth="1.7" />
					</Button>
					<Button href="/login" variant="outline" on:click={null}
						>Sign in</Button
					>
				</div>
			</div>
		</div>
	</nav>
</header>
