---
title: "fail2ban Statistics"
description: "Charts displaying the hack attempts on this system"
thumbnailUrl: "/articles/assets/2024-11-14-fail2ban-charts/thumbnail.png"
thumbnailTitle: "Icon representing markdown text documents"
creationDate: "2024-11-14T19:48:16+01:00"
dataSource: "api"
dataUrl: "/hackers"
authorName: "Michael Rommel"
authorAvatarUrl: "https://avatars.githubusercontent.com/u/919935?s=40&v=4"
tags: ["locked", "create", "code"]
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

