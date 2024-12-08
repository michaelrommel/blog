---
thumbnailUrl: "/articles/assets/2024-11-14-fail2ban-charts/thumbnail.png"
thumbnailTitle: "Icon representing markdown text documents"
dataSource: "api"
dataUrl: "/hackers"
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2024-11-14T19:48:16+01:00",
    "datePublished": "2024-11-14T19:48:16+01:00",
    "headline": "fail2ban Statistics",
    "abstract": "Charts displaying the hack attempts on this system"
}
tags: ["new", "locked", "create", "code"]
published: true
---

# fail2ban Statistics

## Banned IPs per Country

Here is the distribution of banned IPs of the last days per country.
Each IP gets blocked for 365 days.

::svelte[]{ componentname="StackedBarChart" data="perCountry" xSelector="day"}


## Banned IPs per Jail

Here is the distribution of banned IPs of the last days per jail.

::svelte[]{ componentname="StackedBarChart" data="perJail" xSelector="day"}


## Hackers per Country

Here is the overall distribution of banned IPs per country.

::svelte[]{ componentname="PieChart" data="totalPerCountry"}

I hope you like those charts and they inspire you to make your own.
