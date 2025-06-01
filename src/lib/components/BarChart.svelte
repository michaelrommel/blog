<script>
	import Chart from "chart.js/auto";
	import { onMount } from "svelte";
	import { chartcolours } from "$lib/utils.js";
	import { format } from "date-fns";

	const colourMap = Object.keys(chartcolours).map((c) => chartcolours[c]);

	let { data, xSelector } = $props();

	const allcountries = [
		...new Set(
			data.flatMap((c) =>
				Object.keys(c).filter((key) => key !== xSelector),
			),
		),
	];

	const chartData = {
		labels: data.map((slice) =>
			format(new Date(slice[xSelector]), "yyyy-MM-dd"),
		),
		datasets: [],
	};

	allcountries.map((ccode, i) => {
		const dataset = {
			label: ccode,
			data: data.map((slice) => {
				return slice[ccode] ?? 0;
			}),
			backgroundColor: colourMap[i % colourMap.length],
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
			type: "bar",
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
				elements: {
					bar: {
						borderRadius: 3,
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
