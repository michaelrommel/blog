<script>
	import CopyableCode from "$lib/components/shell/CopyableCode.svelte";
</script>

<div id="articlecontainer" class="">
	<div id="centerwrapper" class="flex flex-col">
		<article id="article" class="flex justify-center">
			<main
				class="markdown prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
			>
				<h1>A collaborative shell in your browser</h1>
				<h2>What is this?</h2>
				<p>
					If you have a coding or administrative issue and want to
					discuss it with me or you have just created the
					Next-Big-Thing(tm) and want to show off, you could share
					your shell with me.
				</p>
				<p>
					A small binary connects your computer to the backend running
					here and a link will be printed to your terminal, that we
					both will use in our web browsers. You can open a new
					window, which connects back to your shell and each of us
					sees the exact same window. We can even both type into the
					same terminal (requires some sort of coordination,
					obviously...) There is a chat facility, where we can
					exchange messages and questions. If you do not want to grant
					input access to me, then you can specify the command line
					option '--enable-readers' and share a read-only link with
					me. Then I can view the session and chat, but cannot type
					into the terminals.
				</p>
				<p>
					This is a fork of the "sshx.io" application, modified to
					connect your shell to a backend running here.
				</p>
				<h2>How to use it?</h2>
				<p>You can download the small app using this command line:</p>
				<div class="flex justify-items-center">
					<CopyableCode
						value="curl -sSf https://michaelrommel.com/releases/get-sshx.sh | sh -s run"
					/>
				</div>
				<p>
					This downloads the binary to a temporary folder and executes
					it. Without the '-s run', the binary is just downloaded to
					your current directory and you can execute it yourself.
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
