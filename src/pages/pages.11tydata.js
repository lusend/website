const env = process.env.ELEVENTY_ENV || 'development';

module.exports = async function (configData) {
  return {
    layout: 'base.njk',
    type: 'page',
    tags: ['pages'],
    suffix: env === 'stage' ? '_stage' : '',
    eleventyComputed: {
      permalink: `{{ page.filePathStem }}{{ suffix }}.html`,
      slug: '{{ page.fileSlug }}'
    }
  };
};
