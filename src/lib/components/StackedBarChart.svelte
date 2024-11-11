<script>
	import { BarChart } from "layerchart";
	import { scaleOrdinal, scaleTime, scaleLog } from "d3-scale";

	const colourPalette = [
		// {{{
		"hsl(var(--gruvred))",
		"hsl(var(--gruvgreen))",
		"hsl(var(--gruvyellow))",
		"hsl(var(--gruvblue))",
		"hsl(var(--gruvpurple))",
		"hsl(var(--gruvaqua))",
		"hsl(var(--gruvorange))",
		"hsl(var(--gruvgray))",
		"hsl(var(--gruvdgray))",
		"hsl(var(--gruvdbg))",
		"hsl(var(--gruvdfg))",
		"hsl(var(--gruvdemphred))",
		"hsl(var(--gruvdemphgreen))",
		"hsl(var(--gruvdemphyellow))",
		"hsl(var(--gruvdemphblue))",
		"hsl(var(--gruvdemphpurple))",
		"hsl(var(--gruvdemphaqua))",
		"hsl(var(--gruvdemphorange))",
		"hsl(var(--gruvlemphred))",
		"hsl(var(--gruvlemphgreen))",
		"hsl(var(--gruvlemphyellow))",
		"hsl(var(--gruvlemphblue))",
		"hsl(var(--gruvlemphpurple))",
		"hsl(var(--gruvlemphaqua))",
		"hsl(var(--gruvlemphorange))",
		// }}}
	];

	export let stackedData;
	export let xSelector;

	const allcountries = [
		...new Set(
			stackedData.flatMap((c) =>
				Object.keys(c).filter((key) => key !== xSelector),
			),
		),
	];

	const colourScale = scaleOrdinal(allcountries, colourPalette);

	const seriesData = allcountries.map((c) => ({
		key: c,
		color: colourScale(c),
	}));
</script>

<BarChart
	padding={{ left: 50, top: 50, right: 50, bottom: 30 }}
	data={stackedData}
	x={xSelector}
	series={seriesData}
	seriesLayout="stack"
	props={{
		xAxis: {
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
