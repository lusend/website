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

const action = async (
  text,
  actions,
  { picture = '', title = '', link = '' }
) => {
  actions.push({
    picture,
    title,
    link,
    text: markdown.render(text),
    short: text.length < 150
  });
  return '';
};

module.exports = {
  testimonial,
  action
};
