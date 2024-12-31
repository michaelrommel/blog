<script>
	import Chart from "chart.js/auto";
	import { onMount } from "svelte";
	import { chartcolours } from "$lib/util.js";
	import { format } from "date-fns";

	const colourMap = Object.keys(chartcolours).map((c) => chartcolours[c]);

	let { data, xSelector } = $props();

	const allseries = [
		...new Set(
			data.flatMap((c) =>
				Object.keys(c).filter((key) => key !== xSelector),
			),
		),
	];

	const chartData = {
		labels: data.map((slice) =>
			format(new Date(slice[xSelector]), "yyyy-MM"),
		),
		datasets: [],
	};

	// console.log(`chartData: ${JSON.stringify(chartData, null, 4)}`);

	allseries.map((seriesname, i) => {
		const dataset = {
			label: seriesname,
			data: data.map((slice) => {
				return slice[seriesname] ?? 0;
			}),
			borderColor: colourMap[i % colourMap.length],
		};
		chartData.datasets.push(dataset);
	});

	const totals = data.map((slice) => {
		let subtotal = Object.keys(slice).reduce((acc, cur) => {
			return acc + (cur !== xSelector ? slice[cur] : 0);
		}, 0);
		return subtotal;
	});

	let chartCanvas;

	onMount(async () => {
		new Chart(chartCanvas, {
			type: "line",
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
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
