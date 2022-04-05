const Eleventy = require('@11ty/eleventy');
const fs = require('fs');

const isValidDirectory = (dir) => !dir.split('/').pop().startsWith('_');
const isValidFile = (dir) => dir.endsWith('.md');
const getFiles = (dir, files = []) => {
  (fs.readdirSync(dir) || []).forEach((file) => {
    const newDir = `${dir}/${file}`;
    if (fs.statSync(newDir).isDirectory()) {
      if (isValidDirectory(newDir)) files = getFiles(newDir, files);
    } else {
      if (isValidFile(newDir)) files.push(newDir);
    }
  });

  return files;
};

// getFiles('./src')
//   .filter((__, index) => index !== 7)
//   .forEach((file) => eleventyConfig.ignores.add(file));

(async function () {
  let elev = new Eleventy('src', 'dist', {
    quietMode: true,
    configPath: '.eleventy.js',
    config: function (eleventyConfig) {
      return eleventyConfig;
    }
  });

  let json = await elev.toJSON();
  console.log(json.length);
})();
