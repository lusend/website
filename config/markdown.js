const markdownIt = require('markdown-it');
const anchor = require('markdown-it-anchor');
const options = {
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true
};

module.exports = markdownIt(options)
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-attrs'))
  .use(anchor, {
    leveL: 6,
    class: 'header-anchor',
    permalink: anchor.permalink.headerLink()
  })
  .use(require('markdown-it-toc-done-right'), {
    containerClass: 'table-of-contents not-prose',
    level: [1, 2, 3]
  });
