const env = process.env.ELEVENTY_ENV || 'development';

module.exports = async function (configData) {
  return {
    layout: 'base.njk',
    type: 'page',
    tags: ['pages'],
    suffix: env === 'stage' ? '_stage' : '',
    eleventyComputed: {
      path: `{{ page.filePathStem }}{{ suffix }}`,
      permalink: `{{ path }}.html`,
      slug: '{{ page.fileSlug }}{{ suffix }}',
      edit: (data) =>
        'https://github.com/lusend/testwebsite/edit/main/src' +
        data.page.filePathStem +
        '.' +
        data.page.inputPath.split('.').pop(),
      title: (data) => (data.title ? data.title : data.slug)
    }
  };
};
