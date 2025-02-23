<script module>
</script>

<script>
	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";
	import Menu from "lucide-svelte/icons/menu";
	import ArrowDown from "lucide-svelte/icons/a-arrow-down";
	import ArrowUp from "lucide-svelte/icons/a-arrow-up";
	import User from "lucide-svelte/icons/user-round";
	import Logout from "lucide-svelte/icons/log-out";
	import Journal from "virtual:icons/bi/journal-bookmark-fill";

	import { toggleMode } from "mode-watcher";

	import { Button } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import Logo from "$lib/components/Logo.svelte";
	import * as Avatar from "$lib/components/ui/avatar";

	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { enhance } from "$app/forms";

	let { data } = $props();
	// console.log(
	// 	`in Navigation.svelte data is ${JSON.stringify(data, null, 4)}`,
	// );

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

	async function gotoLogin() {
		popoverOpen = false;
		goto("/login");
	}

	function closePopupAndSubmit() {
		setTimeout(() => {
			popoverOpen = false;
		}, 250);
		logoutForm.requestSubmit();
	}

	const fontBaseSizes = [
		{ value: "fb-xs", label: "xs", menu: "xs:hidden", buttons: "xs:flex" },
		{ value: "fb-sm", label: "sm", menu: "sm:hidden", buttons: "sm:flex" },
		{ value: "fb-base", label: "m", menu: "md:hidden", buttons: "md:flex" },
		{ value: "fb-lg", label: "lg", menu: "lg:hidden", buttons: "lg:flex" },
		{ value: "fb-xl", label: "xl", menu: "lg:hidden", buttons: "lg:flex" },
		{
			value: "fb-2xl",
			label: "xxl",
			menu: "xl:hidden",
			buttons: "xl:flex",
		},
	];

	let selectedFontBaseSize = $state(fontBaseSizes[2]);

	function changeSize(classname, index) {
		let allFontBaseSizeValues = fontBaseSizes.map((s) => s.value);
		let currentClasses = document.documentElement.className
			.split(" ")
			.filter((s) => {
				if (!allFontBaseSizeValues.includes(s)) return s;
			});
		currentClasses.push(classname);
		document.documentElement.className = currentClasses.join(" ");
		selectedFontBaseSize = fontBaseSizes[index];
		// selectedFontBaseSize = fontBaseSizes.filter(
		// 	(s) => s.value == classname,
		// )[0];
	}

	function stepFontSize(offset) {
		const values = fontBaseSizes.map((s) => s.value);
		const index = values.indexOf(selectedFontBaseSize.value);
		// console.log(`Current Fontsize Index: ${index}`);
		let newIndex = index + offset;
		if (newIndex < 0) newIndex = 0;
		if (newIndex > fontBaseSizes.length - 1)
			newIndex = fontBaseSizes.length - 1;
		const newSize = values[newIndex];
		// console.log(`Changing to: ${newSize}`);
		changeSize(newSize, newIndex);
	}

	function decreaseFontSize() {
		stepFontSize(-1);
	}
	function increaseFontSize() {
		stepFontSize(1);
	}

	let popoverOpen = $state(false);
	let menuTarget = $state(null);
	let logoutForm = $state(null);

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

<!-- class="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full" -->

<header class="bg-gruvlbg/90 dark:bg-gruvdbg/90 backdrop-blur-xs">
	<nav class="mx-2 md:mx-4 lg:mx-8">
		<div
			class="w-full flex items-center justify-between text-base xs:text-lg md:text-xl lg:text-2xl xl:text-3xl"
		>
			<div
				class="grow py-2 xs:py-4 mr-2 xs:mr-4 md:mr-8 flex items-center justify-start"
			>
				<div>
					<a
						class="w-10 xs:w-12 md:w-16 block whitespace-nowrap ring-offset-background focus-visible:ring-ring transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full"
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
						<div class="ml-1 md:p-1 md:pl-4 lg:pl-4 navigation">
							<a
								href={link.href}
								class="hover:text-gruvblue dark:hover:text-gruvblue p-1 ring-offset-gruvlbg/90 dark:ring-offset-gruvdbg/90 focus-visible:ring-ring transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none rounded-sm"
							>
								{link.name}
							</a>
						</div>
					{/each}
					{#if data?.user?.id}
						<div class="ml-1 md:p-1 md:pl-4 lg:pl-4 navigation">
							<a
								href="/journal"
								class="hover:text-gruvblue dark:hover:text-gruvblue p-1 ring-offset-gruvlbg/90 dark:ring-offset-gruvdbg/90 focus-visible:ring-ring transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none rounded-sm"
							>
								<Journal class="inline mb-1" />
							</a>
						</div>
					{/if}
				</div>
			</div>
			<div class="py-2 xs:py-4 flex items-center justify-end">
				<div class={selectedFontBaseSize.menu} id="menu">
					<Popover.Root bind:open={popoverOpen}>
						<Popover.Trigger
							class="ring-offset-gruvlbg/90 dark:ring-offset-gruvdbg/90 focus-visible:ring-ring transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none rounded-sm"
						>
							<div class="p-2">
								<Menu size="1.25rem" />
							</div>
						</Popover.Trigger>
						<Popover.Content
							class="flex flex-col w-fit items-end gap-y-2"
						>
							<div class="flex-item">
								<Button
									onclick={toggleAndClose}
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
										onclick={decreaseFontSize}
										variant="outline"
										size="icon"
										class="mr-1"
									>
										<ArrowDown strokeWidth="1.7" />
									</Button>
									<Button
										onclick={increaseFontSize}
										variant="outline"
										size="icon"
										class="ml-1"
									>
										<ArrowUp strokeWidth="1.7" />
									</Button>
								</div>
							</div>
							<div class="flex-item">
								{#if data?.user?.id}
									<div class="flex items-center justify-end">
										<Avatar.Root>
											<Avatar.Image
												src={data?.user?.image}
												title={(data?.user?.provider
													? data?.user?.provider + ":"
													: "") + data?.user?.name}
											/>
											<Avatar.Fallback
												title={(data?.user?.provider
													? data?.user?.provider + ":"
													: "") + data?.user?.name}
											>
												<User />
											</Avatar.Fallback>
										</Avatar.Root>
										<form
											bind:this={logoutForm}
											method="post"
											action="/login?/logout"
											onsubmit={closePopupAndSubmit}
											use:enhance
										>
											<Button
												type="submit"
												variant="outline"
												size="icon"
												class="px-1 ml-2"
											>
												<Logout />
											</Button>
										</form>
									</div>
								{:else}
									<Button
										variant="outline"
										onclick={gotoLogin}
									>
										Sign in
									</Button>
								{/if}
							</div>
						</Popover.Content>
					</Popover.Root>
				</div>
				<div class="hidden {selectedFontBaseSize.buttons} items-center">
					<Button
						onclick={toggleMode}
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
						onclick={decreaseFontSize}
						variant="outline"
						size="icon"
						class="px-1 ml-2 mr-1"
					>
						<ArrowDown strokeWidth="1.7" />
					</Button>
					<Button
						onclick={increaseFontSize}
						variant="outline"
						size="icon"
						class="px-1 mr-2"
					>
						<ArrowUp strokeWidth="1.7" />
					</Button>
					{#if data?.user?.id}
						<Avatar.Root>
							<Avatar.Image
								src={data?.user?.image}
								title={(data?.user?.provider
									? data?.user?.provider + ":"
									: "") + data?.user?.name}
							/>
							<Avatar.Fallback
								title={(data?.user?.provider
									? data?.user?.provider + ":"
									: "") + data?.user?.name}
							>
								<User />
							</Avatar.Fallback>
						</Avatar.Root>
						<form method="post" action="/login?/logout" use:enhance>
							<Button
								type="submit"
								variant="outline"
								size="icon"
								class="px-1 mx-2"
							>
								<Logout />
							</Button>
						</form>
					{:else}
						<Button variant="outline" onclick={gotoLogin}>
							Sign in
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</nav>
</header>
