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
	import Logo from "$lib/components/Logo.svelte";

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
		window.location = "/sign-in";
	}
</script>

<header
	class="sticky top-0 z-10 bg-gruvlbg/90 dark:bg-gruvdbg/90 backdrop-blur-sm overflow-auto"
>
	<nav class="mx-2 md:mx-4 lg:mx-8">
		<div
			class="w-full flex items-center justify-between text-xs xs:text-sm lg:text-xl"
		>
			<div class="grow py-2 xs:py-4 flex items-center justify-start">
				<div class="w-8 xs:w-16">
					<a aria-label="home page" href="/">
						<Logo small />
					</a>
				</div>
				<div class="text-gruvlfg dark:text-gruvdfg flex items-center">
					<div class="mx-4 md:mx-8 lg:mx-12 space-x-2 md:space-x-8">
						{#each navigation as link}
							<a
								href={link.href}
								class="font-bold hover:text-gruvlemphblue dark:hover:text-gruvdemphblue"
							>
								{link.name}
							</a>
						{/each}
					</div>
				</div>
			</div>
			<div class="">
				<a
					rel="external"
					href="/login"
					class="inline-block bg-gruvlemphblue text-gruvdfg py-1 xs:py-2 px-2 border border-transparent rounded-md font-medium hover:bg-opacity-75"
				>
					Sign in
				</a>
			</div>
		</div>
	</nav>
</header>
