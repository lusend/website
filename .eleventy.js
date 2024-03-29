require('dotenv').config();

const postcss = require('postcss');
const markdown = require('./config/markdown');
const { testimonial, action } = require('./config/pairedShortcodes');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const { DateTime } = require('luxon');

const env = process.env.ELEVENTY_ENV || 'development';
const preview = process.env.ELEVENTY_PREVIEW || false;

async function renderPostCSS(css, html, callback) {
  const plugins = [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer')
  ];

  if (env !== 'development') {
    plugins.push(
      require('@fullhuman/postcss-purgecss')({
        content: [{ extension: 'html', raw: html }],
        css: [{ raw: css }],
        defaultExtractor: (content) =>
          content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
      })
    );
  }

  await postcss(plugins)
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

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode('date', () => `${Date.now()}`);

  eleventyConfig.addNunjucksFilter('printCode', (code) => {
    try {
      return JSON.stringify(code).replace(/\"/g, "'");
    } catch (error) {
      console.error('JSON Parse Error for Print Filter: ', error);
      return code;
    }
  });
  eleventyConfig.addNunjucksAsyncFilter('postcss', renderPostCSS);
  eleventyConfig.addNunjucksAsyncFilter('link', (slug, callback) =>
    callback(null, `https://liberty-sa.terradotta.com?go=${slug}`)
  );
  eleventyConfig.addNunjucksAsyncFilter('postDate', (dateObj, callback) =>
    callback(
      null,
      DateTime.fromJSDate(dateObj).toUTC().toLocaleString(DateTime.DATE_MED)
    )
  );

  eleventyConfig.addPairedAsyncShortcode('testimonial', testimonial);
  eleventyConfig.addPairedAsyncShortcode('action', action);

  if (env !== 'development') {
    eleventyConfig.addTransform('scriptmodule', (content, outputPath) => {
      if (outputPath === 'index.html')
        return content.replace(/<script>/g, `<script type="module">`);
      return content;
    });
  }

  return {
    pathPrefix: env === 'development' || preview ? '/' : '/website/',
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
