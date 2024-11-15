---
title: 'Markdown & Svelte'
description: 'A sample markdown text with an embedded Svelte component'
thumbnailUrl: '/articles/assets/2022-01-25-markdown-sample/thumbnail.svg'
thumbnailTitle: 'Icon representing markdown text documents'
creationDate: '2024-11-14T19:48:16+01:00'
authorName: 'Michael Rommel'
authorAvatarUrl: 'https://avatars.githubusercontent.com/u/919935?s=40&v=4'
tags: ['locked', 'create', 'code']
published: true
---

# Fail2Ban Statistics

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

