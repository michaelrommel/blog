---
thumbnailUrl: "/articles/assets/2024-11-14-fail2ban-actions/chart.png"
thumbnailTitle: "fail2ban logo"
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2024-11-14T00:19:00+01:00",
    "datePublished": "2024-11-14T00:19:00+01:00",
    "headline": "fail2ban Actions in Python",
    "abstract": "Implementing a custom action storing IP addresses of hacking attempts in keydb"
}
tags: ["new", "create", "code"]
published: true
---

# fail2ban Actions in Python

## Motivation

Usually there are several dozends of attacks per day on my servers. fail2ban helps me to 
keep things tight, since it can automatically detect those hacking attempts
and after a few unsuccessful attempts it bans the sender's IP address for
the next year.

In the past I had fail2ban send an informative email to myself, with the
whois entry of the attacking IP. That was interesting, but it cluttered my
mailbox. I also wanted to have the info, where the hackers come from, in a
machine-readable way.

## Custom Actions

I turns out that writing a custom action for fail2ban is not particularly
difficult. As example code, there is an action called `smtp.py` in the
default distribution, that gets you started quickly.

My design goals were:

- store the attacker's IP in a database
- with some information about the port they attacked, time and
- most notably the country of the attacker

## Keydb

I had very good experience with redis for a long time. Since they have been
more restrictive in their licensing, I decided to give keydb a try - at
least until they as well switch to a different licensing model...

When dealing with KV stores, it is important to get the datastructures set
up in a way that one can most efficiently query the data afterwards.

### Design Goals

My intended queries are the result of a visualisation, that I intend to
publish here as well. I had three graphs in mind:

1. a week view of the last days and a stacked bar with the number of
   hacking attempts grouped by country
1. the same view grouped by jail
1. a doughnut chart with the overall blocked IPs per country

### Keys and Types

The following table show the used namespaced, keys and types of those keys.

| ns  | key | type   | description                                                    |
|----:|:----|:------:|----------------------------------------------------------------|
|f2b: | CC  | SET    | stores all hack attempts for a country code by a unique NID    |
|f2b: | IP  | SET    | stores all hack attempts from one IP address ( multiple jails) |
|f2b: | NID | HASH   | for one attempt, store under the nanoid, time, jail, country   |
|cidr:| net | STRING | store the raw, parsed, pickled whois info for a network        |

## Implementation

The code can be found [here](https://github.com/michaelrommel/fail2ban-action).

The main action `StoreInRedis` (I know, should have changed that name as
well...) has only 5 functions apart from the constructor. In the
constructor things like the Keydb connection is set up and the WhoisCache
is initialized.

There are start and stop functions, that have no relevance here, as we do
not initialize ban tables or manage firewalls.

The `ban()` and `unban()` functions are the entrypoints that manage the
information stored in Keydb.

The most interesting function is actually the `flush()` function. Very
simple, because the function just returns `True` but bear with me.

Whenever fail2ban starts or stops it needs to re-create the nftables or
other firewall information based on its stored banned IP database. So it
issues 4.000 `ban()` requests. Those would create additional unique
identifiers, which is not desired. For that the designers of fail2ban
already have an option, that can be set in the constructor:

```python
self.norestored = 1
```

This statement instructs fail2ban to not call this action for old bans that
are just restored when the program starts.

But on shutdown fail2ban needs to revert all tables again in the firewalls.
So it calls `unban()` thousands of times... _OR_ it calls a `flush()`
function if it is implemented and _IF_ that returns `True` then `unban()`
is not called.

### Helpers

The WhoisCache is a second class, that interfaces with a global CIDR Cache
object, that loads all known networks when fail2ban intitialises. Whenever
a new IP is encountered, it checks, whether the IP falls in one of the
already known CIDR addresses that I have stored - more than 1.000 in the
meantime.

A whois call is only made, if the IP is from a new network or if the cached
whois entry is older than 14 days.

The CIDRCache is implemented in a separate module and acts as singleton.
When fail2ban launches, it loads via `importlib.machinery` all other Python
files. Unfortunately even a single action module that is used in three
jails is being _executed_ three times, leading to three times the
initialisation of the CIDR Cache, which is expensive, because it is
currently a complete scan of all Keydb keys.

So the CIDRCache lives in its own module and is imported via the normal
Python import mechanism, hence only one instance is created, which is
shared across all fail2ban threads of its jails. A proper `Lock()`
guarantees thread-safe adding of new CIDRs to the cache.

## UI

For the UI I implemented a stacked bar chart and a doughnot chart with 
`chart.js`. I started out with `layerchart` as this is a chart library 
designed for Svelte components. I had a first version running after a few
hours, but I battled for almost one additional day the complicated mechanism
of tweaking its appearance and then I gave up. In the end `layerchart` is a
wrapper around `layercake` which is a wrapper around `d3`. The benefit of
`d3` is the insane amount of charts, that can be created and the endless
flexibility of it. It also renders SVG in the browser, meaning, that we can
style it with CSS. For complex charts it may be a bit slow, but for my use
case, that would have been just fine.

`chart.js` on the other hand offers only a small selection of charts, but
those are very well documented and swapping out everything I wrote for
`layerchart` previously, including restructuring the dataset, took me only
a couple of hours and the third chart was a breeze as well. It renders to a
canvas element, so getting the container size right and having it
responsive is always tricky.

## Conclusion

Implementing this in Python was again a very pleasant experience. The
language has very efficient programming patterns and leads to concise code.
The whole fail2ban code was 186 lines.

The result of this endeavour can be found here: [fail2ban Hacker
Statistics](/create/2024-11-14-fail2ban-charts)

Maybe this gives you some ideas for your own fail2ban configurations. Have
fun!


