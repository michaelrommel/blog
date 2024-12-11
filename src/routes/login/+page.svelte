<script>
	import Github from "virtual:icons/cib/github";
	import Google from "virtual:icons/cib/google";
	import Windows from "virtual:icons/cib/windows";
	import Instagram from "virtual:icons/cib/instagram";
	import Spotify from "virtual:icons/cib/spotify";
</script>

<article id="articlecontainer" class="col-span-12 md:mx-auto">
	<div
		class="mdsvx prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
	>
		<h1>Login</h1>
		<div class="flex justify-center">
			<div class="flex flex-col justify-center w-fit">
				<a
					class="dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
					href="/login/github"
					alt="Login with Github"
				>
					<span class="grow px-3 align-middle">
						Login with Github
					</span>
					<span class="flex-none"><Github class="inline mr-3" /></span
					>
				</a>
				<a
					class="dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
					href="/login/google"
					alt="Login with Google"
				>
					<span class="grow px-3 align-middle">
						Login with Google
					</span>
					<span class="flex-none"><Google class="inline mr-3" /></span
					>
				</a>
				<a
					class="dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
					href="/login/microsoft"
					alt="Login with Microsoft"
				>
					<span class="grow px-3 align-middle">
						Login with Microsoft
					</span>
					<span class="flex-none"
						><Windows class="inline mr-3" /></span
					>
				</a>
				<a
					class="dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
					href="/login/instagram"
					alt="Login with Instagram"
				>
					<span class="grow px-3 align-middle">
						Login with Instagram
					</span>
					<span class="flex-none"
						><Instagram class="inline mr-3" /></span
					>
				</a>
				<a
					class="dark:bg-gruvdbg2 m-1 p-2 rounded-lg no-underline flex flex-row"
					href="/login/spotify"
					alt="Login with Spotify"
				>
					<span class="grow px-3 align-middle">
						Login with Spotify
					</span>
					<span class="flex-none"
						><Spotify class="inline mr-3" /></span
					>
				</a>
			</div>
		</div>
		<h2>Why should you log in?</h2>
		<p>
			If you log in using one of the methods offered above, there are some
			small benefits for you:
		</p>
		<ul>
			<li>
				I can store the set of articles, that you already saw. This
				allows you to set a filter and only unread, new articles are
				shown in the list.
			</li>
			<li>
				Some articles I write are only visible to persons in my inner
				circle. So if you consider yourself to be amonst this elusive
				group, log in to see those.
			</li>
		</ul>
		<p>
			When you log in, I retrieve only the bare minimum information from
			these services, like name, email, avatar or an account id. A session
			cookie will be stored on your computer so that you do not have to
			authenticate again for 30 days.
		</p>
	</div>
	<div class="flex flex-row py-3">
		<div class="basis-5/12 flex-grow content-center">
			<hr class="border-gruvblue" />
		</div>
		<div class="px-6 text-gruvyellow">~~~</div>
		<div class="basis-5/12 flex-grow content-center">
			<hr class="border-gruvblue" />
		</div>
	</div>
</article>
