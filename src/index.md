---
layout: preview
---

[![Build and Deploy Website](https://github.com/lusend/testwebsite/actions/workflows/build.yml/badge.svg)](https://github.com/lusend/testwebsite/actions/workflows/build.yml) [![pages-build-deployment](https://github.com/lusend/testwebsite/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/lusend/testwebsite/actions/workflows/pages/pages-build-deployment)

<span id="status" class="text-xs font-semibold">&nbsp;</span>

# LU Send Website

All pages are listed below. Copy each page for the stage and/or production environments, or preview the page as desired. If the `Current Deployment Commit` does not match the most recent change made to the website, the website is still deploying. Please reload to check again.

_The deployment status should be visible at the top of the page. Check the status by clicking on either of the status badges or visiting the [repository](https://github.com/lusend/testwebsite)._

## Current Deployment Commit

<blockquote class="not-italic">
  <a href="https://github.com/lusend/testwebsite/commit/{{ commit.id }}" class="no-underline hover:underline" target="_blank">{{ commit.message | safe }}</a>
  <div class='mt-2 text-xs'>
    <a href="mailto:{{ commit.email }}" target="_blank">{{ commit.name }}</a> on <span id="committerDate">{{ commit.date }}</span>
  </div>
</blockquote>

## Pages

<details>

<summary>View Future Projects</summary>

### Landing/Special Pages

- [ ] Support Map and JS that belongs with it
- [ ] Support Testimonials
- [x] Support Landing Hero
- [ ] Support Large Navigation Section
- [x] Support Changing Backgrounds

### Blog/Information Pages

- [x] Support Embedded Images
- [x] Support Header Images
- [x] Allow Date Sorting for Deadlines
- [x] Support Buttons

</details>
