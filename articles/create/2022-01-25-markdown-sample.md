---
thumbnailUrl: "/articles/assets/2022-01-25-markdown-sample/thumbnail.svg"
thumbnailTitle: "Icon representing markdown text documents"
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2024-10-01T18:21:13+01:00",
    "datePublished": "2022-01-25T03:21:13+01:00",
    "headline": "Markdown Sample Page",
    "abstract": "A markdown page, that shows all markdown elements supported by this blog."
}
tags: ["locked", "create", "code"]
published: true
---

# h1 Heading 8-)

## Contents

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

This document is mainly for educational purposes, to keep a reference which
markdown syntaxes are supported by all my rendering plugins on this site.


## Horizontal Rules

---
- - -
***
___

## Markdown Directives

::note[One Extension note arbitrary classes like LARGE text]{.fb-2xl}

:comment[Second Extension note of class 'comment']{.comment}

:note[Another Extension note highlighted]{.highlight}

:::img{.img-right}
Third Extension right aligned
:::

and normal text continuing to flow left of the other paragraph
that could also be an image or icon for something to download.


## Emphasis

**This is bold text**

_This is italic text_

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...
>
> > ...by using additional greater-than signs right next to each other...
> >
> > > ...or with spaces between arrows.

## Lists

Unordered

- Create a list by starting a line with `+`, `-`, or `*`
- Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    - Ac tristique libero volutpat at
    * Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
- Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

4. You can use sequential numbers...
5. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar

## Code

Inline `code`

Block code "fences"

```
// Some comments
line 1 of code
line 2 of code
line 3 of code
```


Indented code

    Sample text here...
    And another line


Syntax highlighting

```js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

## Tables

| Option | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default.    |
| ext    | extension to be used for dest files.                                      |

Aligned columns

| Option |        Centered Column             |                          Description |
|:-------|:----------------------------------:|-------------------------------------:|
|   data | path to data files to supply the   |  that will be passed into templates. |
| engine |   engine to be used for            |templates. Handlebars is the default. |
|    ext |                                    | extension to be used for dest files. |

## Superscript / Subscript

- 19^th^
- H~2~O

Footnote 1 link[^first].

Footnote 2 link[^second].

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

## Mathematical Formulas

With MathJax this blog also supports the display of mathematical formulas, like:

$$
x_{1,2} = \frac{-b \pm \sqrt{b^2 -4ac}}{2a}
$$

## Links

[link text](http://michaelrommel.com)

[link with title](http://michaelrommel.com 'title text!')

Autoconverted link https://michaelrommel.com/create/

## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg 'The Stormtroopocat')

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg 'The Dojocat'

## ToDo Lists

* [ ] Buy some milk
* [X] Write blog article
* [ ] Create photos
* [ ] Stop starting, start finishing

## Definition Lists (not supported as of now)

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

A suitable plugin might be: https://github.com/wataru-chocola/remark-definition-list

## Emojies

Classic markup: :wink: :cry: :laughing: :yum: :innocent:

Shortcuts (emoticons): :-) :-( 8-) ;)

