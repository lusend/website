require('dotenv').config();

const postcss = require('postcss');
const markdown = require('./config/markdown');

const env = process.env.ELEVENTY_ENV || 'development';

async function renderPostCSS(css, callback) {
  await postcss([
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer')
  ])
    .process(css, { from: 'src/_includes/styles/main.css' })
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
  eleventyConfig.setLibrary('md', markdown);

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);
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
