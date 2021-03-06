const env = process.env.ELEVENTY_ENV || 'development';
const preview = process.env.ELEVENTY_PREVIEW || false;

module.exports = async function (configData) {
  return {
    layout: 'base.njk',
    type: 'page',
    tags: ['pages'],
    suffix: env === 'stage' ? '_stage' : '',
    planes: false,
    header: true,
    full: false,
    custom: false,
    author: false,
    hero: '',
    background: '',
    bgPosition: '50%',
    testimonials: [],
    actions: [],
    order: [],
    pathPrefix: env === 'development' || preview ? '/' : '/website/',
    eleventyComputed: {
      path: `{{ page.filePathStem }}{{ suffix }}`,
      permalink: `{{ path }}.html`,
      slug: '{{ page.fileSlug }}',
      edit: (data) =>
        'https://github.com/lusend/website/edit/main/src' +
        data.page.filePathStem +
        '.' +
        data.page.inputPath.split('.').pop(),
      title: (data) => (data.title ? data.title : data.slug),
      link: (data) => (slug) =>
        data.collections.pages.find((page) => page.data.slug === slug)?.data
          ?.eleventyNavigation.url || '#',
      eleventyNavigation: {
        type: (data) => data.type,
        path: (data) => data.path,
        slug: (data) => data.slug,
        permalink: (data) => data.permalink,
        inputPath: (data) => data.page.inputPath,
        key: (data) => data.slug,
        title: (data) => data.nav?.title || data.title,
        parent: (data) => data.nav?.parent,
        order: (data) => data.nav?.order,
        url: (data) =>
          env === 'development'
            ? data.permalink
            : data.slug === 'home'
            ? '/'
            : `/?go=${data.page.fileSlug}`
      }
    }
  };
};
