const postcss = require('postcss');

const env = process.env.ELEVENTY_ENV || 'development';

async function renderPostCSS(css, callback) {
  await postcss([
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer')
  ])
    .process(css, { from: 'src/_includes/main.css' })
    .then(
      (result) => callback(null, result.css.replace(/\.prose/g, '#app .prose')),
      (error) => callback(error, null)
    );
}

/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 *  @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = function (eleventyConfig) {
  const markdownIt = require('markdown-it');
  const anchor = require('markdown-it-anchor');
  const options = {
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true
  };

  eleventyConfig.setLibrary(
    'md',
    markdownIt(options)
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
      })
  );

  eleventyConfig.addNunjucksAsyncFilter('postcss', renderPostCSS);
  eleventyConfig.addNunjucksAsyncFilter('link', (slug, callback) =>
    callback(null, `https://liberty-sa.terradotta.com?go=${slug}`)
  );

  return {
    pathPrefix: env === 'development' ? '/' : '/testwebsite/',
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    },
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};
