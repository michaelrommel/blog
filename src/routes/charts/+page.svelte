<script>
	import StackedBarChart from "$lib/components/StackedBarChart.svelte";
	export let data;
</script>

<div id="articlecontainer" class="col-span-12 md:mx-auto">
	<div
		class="mdsvx prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
	>
		<h1>Fail2Ban Statistics</h1>
		<h2>Banned IPs per Country</h2>
		<p>
			Here is the distribution of banned IPs of the last days per country.
		</p>
		<div class="self-center m-1 p-1">
			<div class="w-[500px] h-[300px] bg-gruvdbg0 block">
				<StackedBarChart
					stackedData={data.data.perCountry}
					xSelector={"day"}
				/>
			</div>
		</div>

		<h2>Banned IPs per Jail</h2>
		<p>Here is the distribution of banned IPs of the last days per jail.</p>
		<div class="self-center m-1 p-1">
			<div class="w-[500px] h-[300px] bg-gruvdbg0 block">
				<StackedBarChart
					stackedData={data.data.perJail}
					xSelector={"day"}
				/>
			</div>
		</div>
	</div>
</div>
