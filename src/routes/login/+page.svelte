<script>
	import Github from "virtual:icons/cib/github";
	import Google from "virtual:icons/cib/google";
	// import Instagram from "virtual:icons/cib/instagram";
	import Spotify from "virtual:icons/cib/spotify";

	import { goto } from "$app/navigation";

	let { data } = $props();

	if (data.user) {
		// we have an authenticated user now, see, if we stored a
		// referring url in localstorage
		const referrer = localStorage.getItem("referrer");
		localStorage.removeItem("referrer");
		goto(referrer ? referrer : "/");
	} else {
		localStorage.setItem("referrer", data?.referrer);
	}
</script>

<div id="articlecontainer" class="">
	<div id="centerwrapper" class="flex flex-col">
		<article id="article" class="flex justify-center">
			<main
				class="markdown prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
			>
				<h1>Login</h1>
				<div class="flex justify-center">
					<div class="flex flex-col justify-center w-fit">
						<a
							class="bg-gruvlbg1 dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
							href="/login/github"
							alt="Login with Github"
						>
							<span class="grow px-3 align-middle">
								Login with Github
							</span>
							<span class="flex-none">
								<Github
									class="inline mr-3 text-gruvlfg3 dark:text-gruvdfg"
								/>
							</span>
						</a>
						<a
							class="bg-gruvlbg1 dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
							href="/login/google"
							alt="Login with Google"
						>
							<span class="grow px-3 align-middle">
								Login with Google
							</span>
							<span class="flex-none">
								<Google
									class="inline mr-3 text-gruvlfg3 dark:text-gruvdfg"
								/>
							</span>
						</a>
						<a
							class="bg-gruvlbg1 dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
							href="/login/spotify"
							alt="Login with Spotify"
						>
							<span class="grow px-3 align-middle">
								Login with Spotify
							</span>
							<span class="flex-none">
								<Spotify
									class="inline mr-3 text-gruvlfg3 dark:text-gruvdfg"
								/>
							</span>
						</a>
					</div>
				</div>
				<h2>Why should you log in?</h2>
				<p>
					If you log in using one of the methods offered above, there
					are some small benefits for you:
				</p>
				<ul>
					<li>
						I can store the set of articles, that you already saw.
						This allows you to set a filter and only unread, new
						articles are shown in the list.
					</li>
					<li>
						Some articles I write are only visible to persons in my
						inner circle. So if you consider yourself to be amonst
						this elusive group, log in to see those.
					</li>
				</ul>
				<p>
					When you log in, I retrieve only the bare minimum
					information from these services, like name, email, avatar or
					an account id. A session cookie will be stored on your
					computer so that you do not have to authenticate again for
					30 days.
				</p>
			</main>
		</article>

		<div id="flourish" class="flex flex-row py-3 mx-auto">
			<div class="basis-5/12 grow content-center">
				<hr class="border-gruvblue" />
			</div>
			<div class="px-6 text-gruvpurple dark:text-gruvyellow">~~~</div>
			<div class="basis-5/12 grow content-center">
				<hr class="border-gruvblue" />
			</div>
		</div>
	</div>
</div>

<!-- <a -->
<!-- 	class="dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row" -->
<!-- 	href="/login/instagram" -->
<!-- 	alt="Login with Instagram" -->
<!-- > -->
<!-- 	<span class="grow px-3 align-middle"> -->
<!-- 		Login with Instagram -->
<!-- 	</span> -->
<!-- 	<span class="flex-none" -->
<!-- 		><Instagram class="inline mr-3" /></span -->
<!-- 	> -->
<!-- </a> -->
