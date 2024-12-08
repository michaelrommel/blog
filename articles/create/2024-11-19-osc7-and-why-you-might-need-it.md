---
thumbnailUrl: "/articles/assets/2024-11-19-osc7-and-why-you-might-need-it/thumbnail.png"
thumbnailTitle: "Icon showing a terminal with split panes"
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2024-11-19T18:13:02+01:00",
    "datePublished": "2024-11-19T18:13:02+01:00",
    "headline": "OSC7 And Why You Might Need It",
    "abstract": "A short description of why and how you can use OSC7 to make your terminal life easier."
}
tags: ["new", "create", "code"]
published: true
---

# OSC7 And Why You Might Need It

## Contents

## Motivation

You may have found yourself in the situation where you started tmux and are
working in the terminal. You switch to your code in a directory and then
you divide the screen up into more panes, e.g. to have a pane with the
editor, another where you start the application and a third one to `tail -f`
the logs.

After you have split the screen, the new pane's `cwd` is usually the
directory where you had been in when you started `tmux`. You would then
need to switch again to your code dir and to the same again in your third
pane.

This is where `OSC7` comes in.

## What is OSC7?

`OSC7` is a terminal escape sequence that advises a terminal of the working
directory. So in order to take advantage of that all three components:
Shell, Terminal Multiplexer and Terminal need to work together. OSC stands
for Operating System Command.

## Configuration

The Shell has the task to emit the `OSC7` sequence whenever the directoy 
changes. With `oh-my-posh` I have already a shell prompt with customizable
segments, so I configured that. 

`.oh-my-posh/posh.json`:

```js
{
	"$schema": "https://raw.githubu...chema.json",
	"version": 2,
	"pwd": "osc7",
    ...
}
```

Then `tmux` needs some tweaks to let the escape sequences pass through to the
terminal:

`.config/tmux/tmux.conf`:

```tmux
# split using the OSC7 path, this has the format:
# file://hostname//home/rommel/software/rust
# note that the colon cannot be matched directly
bind-key '"'   split-window -h -c '#{s|file.//.*//|/|:pane_path}'
bind-key %     split-window -c '#{s|file.//.*//|/|:pane_path}'
bind-key c     new-window -c '#{s|file.//.*//|/|:pane_path}'

if-shell -b '[ "$(echo "$TMUX_VERSION >= 3.4" | bc)" = 1 ]' {
  # allow special OSC control escapes to pass through
  # used to send macos desktop notifications from scripts
  # although a pane option, it can be set on a global window level
  set -wg allow-passthrough on
}
```

This now allows me to create splits or new windows and automatically set
the current working directory to the `OSC7` defined path of the pane we
split from.

![tmux shell split](/articles/assets/2024-11-19-osc7-and-why-you-might-need-it/thumbnail.png)

And since `wezterm` also now receives this information any new tab created
with `Ctrl-Shift-t` drops the shell into that last directory.

## Conclusion

With very little effort working in the terminal has been much more
streamlined for me compared to before. Many of the tedious `cd .....`
commands that I used to type (even with tab completion) are now a thing of
the past.

