const fetch = require('node-fetch');
const markdown = require('../../config/markdown');

const GH_PAC = process.env.GH_PAC || '';

async function get(link, { asText = false, headers = {} } = {}) {
  const res = await fetch(link, { headers });
  if (res.status !== 200) throw res;
  if (asText) return await res.text();
  return await res.json();
}

module.exports = async function () {
  try {
    const branches = await get(
      'https://api.github.com/repos/lusend/testwebsite/branches',
      {
        headers: {
          authorization: `token ${GH_PAC}`
        }
      }
    );

    const { sha: id, url: url } = branches.find(
      (el) => el.name === 'main'
    ).commit;

    const main = await get(url, {
      headers: {
        authorization: `token ${GH_PAC}`
      }
    });
    const {
      message,
      committer: { name, email, date }
    } = main.commit;

    return {
      message: markdown.renderInline(message),
      name,
      email,
      date,
      id
    };
  } catch (error) {
    return {
      message: undefined,
      name: undefined,
      email: undefined,
      date: undefined,
      id: undefined
    };
  }
};
