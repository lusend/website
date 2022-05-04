---
title: Brochure Title
type: brochure
planes: false
header: true
nav:
  title: Brochure Title
  parent: home
---

<div id="appOverview" x-data="editor()" x-init="currentId = 'appOverview'" x-show="currentId === $el.id" x-cloak>

# Trip Overview

<div id="pdf-mypdf" data-src="https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf" data-filename="Bodea Brochure.pdf"></div>

</div>

<div id="appResources" x-data="editor()" x-show="currentId === $el.id" x-cloak>

# Travel Resources

</div>

<div id="appSafety" x-data="editor()" x-show="currentId === $el.id" x-cloak>

# Travel Safety

</div>

<div id="appChecklist" x-data="editor()" x-show="currentId === $el.id" x-cloak>

# Traveler Checklist

</div>

<div id="appFlights" x-data="editor()" x-show="currentId === $el.id" x-cloak>

# Flight Itinerary

</div>

<div id="appPacking" x-data="editor()" x-show="currentId === $el.id" x-cloak>

# Packing Guide

</div>
