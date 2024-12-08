export async function GET({ fetch, setHeaders }) {
	let articleList = null;
	articleList = await fetch(`/api/articles`).then((res) => res.json());

	setHeaders({
		'Content-Type': 'application/xml'
	});

	let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
	xhtml="https://www.w3.org/1999/xhtml"
	mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
	news="https://www.google.com/schemas/sitemap-news/0.9"
	image="https://www.google.com/schemas/sitemap-image/1.1"
	video="https://www.google.com/schemas/sitemap-video/1.1"
>\n`;
	for (const article of articleList) {
		// <url>
		// <loc>https://www.example.com/foo.html</loc>
		// <lastmod>2022-06-04</lastmod>
		//  </url>
		sitemap += `<url>\n 	<loc>https://michaelrommel.com/${article.articleCategory}/${article.slug}</loc>\n 	<lastmod>${article.dateModified ? article.dateModified : article.dateCreated}</lastmod>\n</url>\n`;
	}
	sitemap += '</urlset>';

	return new Response(sitemap);
}
