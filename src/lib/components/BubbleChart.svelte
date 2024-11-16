<script>
	import Chart from "chart.js/auto";
	import { onMount } from "svelte";
	import { chartcolours } from "$lib/util.js";
	import { format } from "date-fns";
	import colorLib from "@kurkle/color";

	const colourMap = Object.keys(chartcolours).map((c) => chartcolours[c]);

	export let data;
	export let xSelector;

	export function transparentize(value, opacity) {
		var alpha = opacity === undefined ? 0.5 : 1 - opacity;
		return colorLib(value).alpha(alpha).rgbString();
	}

	const allseries = [
		...new Set(
			data.flatMap((c) =>
				Object.keys(c).filter((key) => key !== xSelector),
			),
		),
	];

	const chartData = {
		datasets: [],
	};

	// console.log(`chartData: ${JSON.stringify(chartData, null, 4)}`);
	let xTitle = null;
	let displayXTitle = false;

	allseries.map((seriesname, i) => {
		const dataset = {
			label: seriesname,
			data: data
				.map((slice) => {
					if (slice[seriesname]) {
						// try to identify xSelector as date
						let x = new Date(slice[xSelector]);
						if (isNaN(x.valueOf())) {
							x = slice[xSelector];
						} else {
							x =
								(new Date(slice[xSelector]) - Date.now()) /
								1000 /
								3600 /
								24;
							if (!xTitle) {
								xTitle = "Days";
								displayXTitle = true;
							}
						}
						return {
							x,
							y: slice[seriesname],
							r: 5,
						};
					}
				})
				.filter((n) => n !== undefined),
			borderColor: colourMap[i % colourMap.length],
			backgroundColor: transparentize(
				colourMap[i % colourMap.length],
				0.4,
			),
		};
		chartData.datasets.push(dataset);
	});

	console.log(`chartData: ${JSON.stringify(chartData, null, 4)}`);

	const totals = data.map((slice) => {
		let subtotal = Object.keys(slice).reduce((acc, cur) => {
			return acc + (cur !== xSelector ? slice[cur] : 0);
		}, 0);
		return subtotal;
	});

	let chartCanvas;

	onMount(async () => {
		new Chart(chartCanvas, {
			type: "bubble",
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						title: {
							display: displayXTitle,
							text: xTitle,
						},
					},
					y: {
						ticks: {
							font: {
								size: 16,
							},
						},
					},
				},
				animation: {
					duration: 250,
				},
				plugins: {
					legend: {
						labels: {
							boxWidth: 14,
							borderRadius: 5,
							useBorderRadius: true,
							font: {
								size: 14,
							},
						},
					},
					tooltip: {
						callbacks: {
							footer: function (context) {
								return `Sum: ${totals[context[0].dataIndex]}`;
							},
						},
					},
				},
			},
		});
	});
</script>

<div class="h-[500px]">
	<canvas bind:this={chartCanvas}></canvas>
</div>
