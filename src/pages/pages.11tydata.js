module.exports = async function (configData) {
  return {
    layout: 'base.njk',
    type: 'page',
    tags: ['pages'],
    eleventyComputed: {
      permalink: '{{ page.filePathStem }}.html',
      slug: '{{ page.fileSlug }}'
    }
  };
};
