---
thumbnailUrl: "/articles/assets/2024-11-16-cat-weight/thumbnail.png"
thumbnailTitle: "Icon showing a bubble chart"
dataSource: "url"
dataUrl: "cat_weight.json" 
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2024-11-16T13:46:15+01:00",
    "datePublished": "2024-11-16T13:46:15+01:00",
    "headline": "My Cats Are Getting Bigger...",
    "abstract": "After a year, my cats are adults now - and gaining (too much) weight..."
}
tags: ["new", "create", "cat"]
published: true
---

# My Cat's Weights

Cats and food is seemingly a never ending topic. Every "cat feeder" I talk to
is telling stories about refused food and pickyness etc. I experience the
same. Many times, I end up putting the food from the can into the bowl and
several hours later directly into the garbage.

Still -- although I am not giving a lot of snacks -- they continue to grow
and gain weight and at the very least Nicky is approaching a critical mass.

This is a bubble chart that shows the difference.

::svelte[]{ componentname="BubbleChart" data="dataset" xSelector="date"}

To weigh the cats, I have to weigh in myself then myself with a cat on my
arm and calculate the difference, like $$85.5-80.9$$ kg. 

Although Ricky is _always_ the first at the food bowls, she stops when she
is full and almost never complains that she's hungry. She is also more
agile and over the course of the day seems to be always up and about.

Nicky is lazier and often sleeps in my vicinity. She seems to eat --
especially the kibble -- until the bowl is empty.

I am now reducing the availability of food during the day and fill up the
bowls now only on mealtimes 2--3 times a day. Keep your fingers crossed for
me, that this works out...

