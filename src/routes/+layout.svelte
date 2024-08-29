<script>
	import "../app.css";
	import Navigation from "$lib/components/Navigation.svelte";
	import PageHead from "$lib/components/PageHead.svelte";
</script>

<Navigation />
<div>
	<div class="grid grid-cols-12 gap-4 m-3">
		<div class="col-span-12">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss" global>
	.mdsvx h1 {
		@apply text-2xl font-bold my-6;
	}

	.mdsvx h2 {
		@apply text-xl font-bold my-6;
	}

	.mdsvx h3 {
		@apply text-lg font-bold my-4;
	}

	.mdsvx h4 {
		@apply font-bold my-4;
	}

	.mdsvx p {
		@apply mb-4 leading-snug;
	}

	.mdsvx .img-right {
		@apply max-w-2xl;
	}

	pre[class*="shiki"] > code,
	code[class*="language-"],
	pre[class*="language-"] {
		font-family: "Victor Mono", Consolas, Monaco, "Andale Mono", monospace;
		font-style: normal;
		/* font-size: 16px; */
		direction: ltr;
		text-align: left;
		white-space: pre;
		word-spacing: normal;
		word-break: normal;
		/* line-height: 1; */

		-moz-tab-size: 2;
		-o-tab-size: 2;
		tab-size: 2;

		-webkit-hyphens: none;
		-moz-hyphens: none;
		-ms-hyphens: none;
		hyphens: none;
	}

	@media (prefers-color-scheme: dark) {
		code[class*="language-"],
		pre[class*="language-"] {
			background-color: theme("colors.gruvdbg0");
		}

		pre[class*="language-"]::-moz-selection,
		pre[class*="language-"] ::-moz-selection,
		code[class*="language-"]::-moz-selection,
		code[class*="language-"] ::-moz-selection {
			color: theme("colors.gruvdfg0");
			background-color: theme("colors.gruvdbg4");
		}

		pre[class*="language-"]::selection,
		pre[class*="language-"] ::selection,
		code[class*="language-"]::selection,
		code[class*="language-"] ::selection {
			color: theme("colors.gruvdfg0");
			background-color: theme("colors.gruvdbg4");
		}

		/* Code blocks */
		pre[class*="language-"] {
			padding: 1em;
			margin: 0.5em 0;
			overflow: auto;
		}

		:not(pre) > code[class*="language-"],
		pre[class*="language-"] {
			background-color: theme("colors.gruvdbg0");
		}

		/* Inline code */
		:not(pre) > code[class*="language-"] {
			padding: 0.1em;
			border-radius: 0.3em;
		}

		.token.comment,
		.token.prolog,
		.token.cdata {
			color: theme("colors.gruvgray");
			font-style: italic;
		}

		.token.hashbang {
			color: theme("colors.gruvaqua");
			font-style: normal;
		}

		.token.delimiter,
		.token.selector,
		.token.important,
		.token.atrule {
			color: theme("colors.gruvdemphorange");
		}

		.token.keyword {
			color: theme("colors.gruvdemphorange");
		}

		.token.operator,
		.token.attr-name {
			color: theme("colors.gruvdemphyellow");
		}

		.token.punctuation {
			color: theme("colors.gruvdfg3");
		}

		.token.interpolation-punctuation {
			color: theme("colors.gruvdemphaqua");
		}

		.token.tag,
		.token.tag .punctuation,
		.token.doctype,
		.token.builtin {
			color: theme("colors.gruvdemphyellow");
		}

		.token.class-name,
		.token.boolean,
		.token.entity,
		.token.number,
		.token.symbol {
			color: theme("colors.gruvdemphpurple");
		}

		.token.constant,
		.token.variable {
			color: theme("colors.gruvdemphred");
		}

		.token.property,
		.token.regex,
		.token.string,
		.token.char {
			color: theme("colors.gruvdemphgreen");
		}

		.token.attr-value,
		.token.attr-value .punctuation {
			color: theme("colors.gruvdfg4");
		}

		.token.url {
			color: theme("colors.gruvblue");
			text-decoration: underline;
		}

		.token.function {
			color: theme("colors.gruvdemphblue");
		}

		.token.bold {
			font-weight: bold;
		}

		.token.italic {
			font-style: italic;
		}

		.token.inserted {
			color: theme("colors.gruvdfg4");
		}

		.token.deleted {
			background: theme("colors.gruvdemphred");
		}
	}
</style>
