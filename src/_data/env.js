module.exports = async function (configData) {
  return process.env.ELEVENTY_ENV || 'development';
};
