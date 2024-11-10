<script>
	import { BarChart } from "layerchart";

	const stackedData = [
		// {{{
		{
			year: 2019,
			apples: 3840,
			bananas: 1920,
			cherries: 960,
			grapes: 400,
		},
		{
			year: 2018,
			apples: 1600,
			bananas: 1440,
			cherries: 960,
			grapes: 400,
		},
		{
			year: 2017,
			apples: 820,
			bananas: 1000,
			cherries: 640,
			grapes: 400,
		},
		{
			year: 2016,
			apples: 820,
			bananas: 560,
			cherries: 720,
			grapes: 400,
		},
		// }}}
	];
</script>

<div class="col-span-12 min-h-[300px] max-h-[300px] bg-gruvdbg0 block">
	<BarChart
		padding={{ left: 50, top: 50, right: 50, bottom: 30 }}
		data={stackedData}
		x="year"
		series={[
			{ key: "apples", color: "hsl(var(--gruvorange))" },
			{
				key: "bananas",
				color: "hsl(var(--gruvyellow))",
			},
			{
				key: "cherries",
				color: "hsl(var(--gruvred))",
			},
			{
				key: "grapes",
				color: "hsl(var(--gruvgreen))",
			},
		]}
		seriesLayout="stack"
		props={{
			xAxis: {
				format: "none",
				tickLabelProps: {
					class: "text-sm",
				},
			},
			yAxis: {
				format: "metric",
				tickLabelProps: {
					class: "text-xs",
				},
			},
		}}
	/>
</div>
