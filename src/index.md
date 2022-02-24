---
layout: preview
---

[![Build and Deploy Website](https://github.com/lusend/website/actions/workflows/build.yml/badge.svg)](https://github.com/lusend/website/actions/workflows/build.yml){.inline-block .mb-2} [![pages-build-deployment](https://github.com/lusend/website/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/lusend/website/actions/workflows/pages/pages-build-deployment){.inline-block .mb-2}

<details>

<summary>Table of Contents</summary>

<div class="max-h-44 overflow-auto p-3 rounded-2xl shadow-md mt-5">

[[_toc_]]

</div>

</details>

<span id="status" class="text-xs font-semibold">&nbsp;</span>

# LU Send Website

Welcome to the Content Editing Page for the LU Send Website! All pages are listed below. Copy each page for the stage and/or production environments, or preview the page as desired. If the `Current Deployment Commit` does not match the most recent change made to the website, the website is still deploying. Please reload to check again.

_The deployment status should be visible at the top of the page. Check the status by clicking on either of the status badges or visiting the [repository](https://github.com/lusend/website)._

<details>

<summary>View Plugin Documentation</summary>

## Plugin Documentation

| Option                        | Input                                                    | Output                                                |
| ----------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| Bold                          | `**Test**`                                               | **Test**                                              |
| Italic                        | `_Test_`                                                 | _Test_                                                |
| Superscript                   | `^Test^`                                                 | ^Test^                                                |
| Subscript                     | `~Test~`                                                 | ~Test~                                                |
| Strikethrough                 | `~~Test~~`                                               | ~~Test~~                                              |
| Highlight                     | `==Test==`                                               | ==Test==                                              |
| Typographer                   | Automatic (i.e. `(c)` for (c))                           | (c) (C) (r) (R) (tm) (TM) (p) (P) +- "Test" 'Test'    |
| Inline Code                   | `Test`                                                   | `Test`                                                |
| Emoji                         | `:) OR :thumbsdown:`                                     | :thumbsdown: :1st_place_medal: :) :adult: :( :P       |
| Adding Classes                | `[Text]{.text-accent .font-bold}`                        | [Text]{.text-secondary .font-bold}                    |
| Adding Buttons                | {{ "`[text]({{link(slug)}} OR link){.btn}`" }}           | [Button](#){.btn}                                     |
| Adding Buttons Secondary      | {{ "`[text](link){.btn .btn-secondary}`" }}              | [Button](#){.btn .btn-secondary}                      |
| Adding Buttons Full           | {{ "`[text](link){.btn .btn-full}`" }}                   | [Button](#){.btn .btn-full}                           |
| Header Images                 | `![description](link){.header}`                          | ![Header Image](https://cataas.com/cat){.header .h-8} |
| Regular Images                | `![description](link)`                                   | ![Header Image](https://cataas.com/cat){.h-8}         |
| Current Year                  | {{ "`{% year %}`" }}                                     | {% year %}                                            |
| Output link to external page  | `[text](link)`                                           | [See Random Cat Image](https://cataas.com/cat)        |
| Output link to internal page  | {{ "`{{ link(slug) }}`" }}                               | _Unable to Preview_                                   |
| Format Date from Front Matter | {{ "`{{ postDate(date) }}`" }}                           | _Unable to Preview_                                   |
| Adding Table of Contents      | `${toc}`                                                 | _Unable to Preview_                                   |
| Input Post CSS and Output CSS | {{ "`{{ postcss(css) }}`" }}                             | _Unable to Preview_                                   |
| Include Separate File         | {{ "`{% include filename.md %}`" }}                      | _Unable to Preview_                                   |
| Testimonials                  | See Example in `_includes/content/group_testimonials.md` | _Unable to Preview_                                   |
| Actions                       | See Example in `pages/home.md`                           | _Unable to Preview_                                   |

</details>

<details>

<summary>View Front Matter Documentation</summary>

## Front Matter Documentation

### Default Architecture

```yaml
type: page
title: undefined
planes: false,
header: true,
full: false,
custom: false,
author: false,
date: today's date
hero: '',
background: '',
order: [],
nav:
  title: {{ "{{ title }}" }}
  parent: undefined
  order: undefined
```

### Options

#### `type`

If set to `brochure`, the layout will be specific to a brochure page rather than a normal page. Defaults to `page`.

#### `title`

The title of the page. Will be used in the header if included. Has no default.

#### `planes`

If set to `true`, the planes will be on by default when you navigate to the page and will have to be toggled off. The default is `false` (i.e. A person on the website would have to manually turn them on).

#### `header`

If set to `true`, a header is included with the title and breadcrumb navigation. Defaults to `true`.

#### `full`

If set to `true`, the main content section will take up the entire width rather than being cut off. Defaults to `false`.

#### `custom`

If set to `true`, the content would have no presets. This is useful when injecting HTML and no default classes/layout is desired. Defaults to `false`.

#### `author`

If given a value, the author and date will be listed in the header. If the author is given an empty string value (`''`), only the date will be listed. Defaults to `false`.

#### `date`

If given a value in the form YYYY-MM-DD (i.e. `2022-02-22` for February 22, 2022), this will set the date listed below the header. It will be shown based on the `author` front matter option. The default date is based on the last build. Best practice is to set the date manually, since the default date will be updated for any change to any part of the website regardless of whether or not this page itself was updated.

#### `hero`

If set to a value, a section will be included that contains the website logo, this value as the subtitle underneath it, and a scroll down button. Defaults to `''`.

#### `background`

If set to a value, a background will be applied to the website. Defaults to `''`.

#### `order`

Currently supports ordering `actions`, `content`, and `testimonials`. The default order is `['actions', 'content', 'testimonials']`. If a different order is desired, set this option to an array with the desired order. If an option is left out, it will be appended at the end. This means that if you only want content to be at the front and want to leave the rest as default use the following:

```yaml
order: ['content']
```

This will result in an order of `content`, then `actions`, then `testimonials`.

#### `nav`

This option allows you to define navigation hierarchy and will apply to the navigation bar as well as the breadcrumbs if the header is visible. If you set the `parent` option to a slug (the file name of a page without the extension), that slug will become its parent and the link in the header will be nested under its parent. If you set the `title` option, you can have a separate title for your navbar and breadcrumbs. Otherwise, it defaults to the base title. If you set the `order` option to a number, you can manually position an item relative to its siblings.

</details>

<details>

<summary>View TODO Tracker</summary>

## TODO Tracker

### Landing/Special Pages

- [x] Support Map and JS that belongs with it
- [x] Support Testimonials
- [x] Support Landing Hero
- [x] Support Call to Actions
- [x] Support Changing Backgrounds

### Blog/Information Pages

- [x] Support Embedded Images
- [x] Support Header Images
- [x] Allow Date Sorting for Deadlines
- [x] Support Buttons

### Optimizations

- [x] Add CSS minification
- [x] Add HTML minification
- [x] Add JS minification
- [x] Optimize Testimonial Images
- [x] Optimize Home Images
- [x] Optimize Individual Images
- [x] Optimize Faculty Images
- [x] Optimize Program Process Images
- [x] Optimize Getting Started Images
- [x] Optimize Individual Programs Images
- [x] Optimize Policies Images
- [x] Optimize Int Proposal Images
- [x] Optimize Dom Proposal Images

### Content

- [x] Add Correct Content to Pages
- [x] Document Usage of Website
- [x] Include Advanced Menu Button
- [ ] Improve TD Driver
- [ ] Improve Map Driver
- [ ] Improve Map Styles

</details>

## Current Deployment Commit

<blockquote class="not-italic">
  <a href="https://github.com/lusend/website/commit/{{ commit.id }}" class="no-underline hover:underline" target="_blank">{{ commit.message | safe }}</a>
  <div class='mt-2 text-xs'>
    <a href="mailto:{{ commit.email }}" target="_blank">{{ commit.name }}</a> on <span id="committerDate">{{ commit.date }}</span>
  </div>
</blockquote>

## Pages

_If any page content was changed based on the above commit, a badge will appear next to the page._
