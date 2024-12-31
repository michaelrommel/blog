<script>
	import Chart from "chart.js/auto";
	import { onMount } from "svelte";
	import { chartcolours } from "$lib/util.js";
	import colorLib from "@kurkle/color";
	import { sub, format, startOfDay, differenceInDays } from "date-fns";

	const colourMap = Object.keys(chartcolours).map((c) => chartcolours[c]);

	let { data, xSelector } = $props();

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
	let xIsDay = false;

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
							x = differenceInDays(
								startOfDay(new Date(slice[xSelector])),
								startOfDay(Date.now()),
							);
							if (!xTitle) {
								xTitle = "Days";
								displayXTitle = true;
								xIsDay = true;
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

	// console.log(`chartData: ${JSON.stringify(chartData, null, 4)}`);

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
							title: function (context) {
								let label = context[0].raw.x;
								if (xIsDay) {
									let d = sub(startOfDay(Date.now()), {
										days: -label,
									});
									label = format(d, "yyyy-MM-dd");
								}
								return label;
							},
							label: function (context) {
								let label = context.label || "";
								label += `: ${context.raw.y}`;
								return label;
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
