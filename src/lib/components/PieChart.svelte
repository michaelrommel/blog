<script>
	import Chart from "chart.js/auto";
	import { onMount } from "svelte";
	import { chartcolours } from "$lib/util.js";
	import { format } from "date-fns";

	const colourMap = Object.keys(chartcolours).map((c) => chartcolours[c]);

	export let totalData;

	const sortedData = totalData.sort((a, b) => {
		if (a.hackers < b.hackers) {
			return 1;
		} else if (a.hackers > b.hackers) {
			return -1;
		}
		return 0;
	});

	const summarizedData = [];
	const various = [];
	let variousTotal = 0;

	sortedData.forEach((slice) => {
		if (slice.hackers < 20) {
			various.push(slice.country);
			variousTotal += slice.hackers;
		} else {
			summarizedData.push(slice);
		}
	});
	summarizedData.push({
		country: "Various",
		hackers: variousTotal,
	});

	const data = {
		labels: summarizedData.map((slice) => slice.country),
		datasets: [],
	};

	const dataset = {
		data: summarizedData.map((slice) => {
			return slice.hackers ?? 0;
		}),
		backgroundColor: summarizedData.map((slice, i) => {
			return colourMap[i % colourMap.length];
		}),
	};
	data.datasets.push(dataset);

	let chartCanvas;

	onMount(async () => {
		new Chart(chartCanvas, {
			type: "doughnut",
			data,
			options: {
				borderWidth: 0,
				responsive: true,
				maintainAspectRatio: false,
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
							label: function (context) {
								let label = context.label || "";

								if (label === "Various") {
									label += ` (${various.length} countries)`;
								}
								label += `: ${context.formattedValue}`;
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
