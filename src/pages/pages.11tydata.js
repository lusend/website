const env = process.env.ELEVENTY_ENV || 'development';

module.exports = async function (configData) {
  return {
    layout: 'base.njk',
    type: 'page',
    tags: ['pages'],
    suffix: env === 'stage' ? '_stage' : '',
    planes: false,
    header: true,
    eleventyComputed: {
      path: `{{ page.filePathStem }}{{ suffix }}`,
      permalink: `{{ path }}.html`,
      slug: '{{ page.fileSlug }}',
      edit: (data) =>
        'https://github.com/lusend/testwebsite/edit/main/src' +
        data.page.filePathStem +
        '.' +
        data.page.inputPath.split('.').pop(),
      title: (data) => (data.title ? data.title : data.slug),
      link: (data) => (slug) =>
        data.collections.pages.find((page) => page.data.slug === slug)?.data
          ?.eleventyNavigation.url || '#',
      eleventyNavigation: {
        path: (data) => data.path,
        permalink: (data) => data.permalink,
        key: (data) => data.slug,
        title: (data) => data.nav?.title,
        parent: (data) => data.nav?.parent,
        order: (data) => data.nav?.order,
        url: (data) =>
          env === 'development'
            ? data.permalink
            : data.slug === 'pages'
            ? '/'
            : `/?go=${data.page.fileSlug}`
      }
    }
  };
};
