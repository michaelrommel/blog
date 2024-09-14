<script>
	import "../../../app.css";
	export let data;
</script>

<div id="articlecontainer" class="col-span-12 md:mx-auto">
	<div
		class="mdsvx prose prose-sm lg:prose-base prose-gruvbox dark:prose-invert"
	>
		{@html data.html}
	</div>
</div>

<style lang="postcss" global>
	.mdsvx .img-right {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.mdsvx .img-right > p {
		max-width: 500px;
	}

	@media (min-width: 768px) {
		.mdsvx .img-right {
			float: right;
			width: 40%;
			margin-left: 3rem;
		}
	}
</style>
