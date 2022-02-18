const markdown = require('./markdown');
const env = process.env.ELEVENTY_ENV || 'development';

const testimonial = async (
  quote,
  testimonials,
  { profile = '', name = '', subtitle = '', truncate = true }
) => {
  testimonials.push({
    profile,
    name,
    subtitle,
    truncate,
    quote: markdown.render(quote)
  });
  return '';
};

module.exports = {
  testimonial
};
