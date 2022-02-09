async function get(link, { asText = false, headers = {} } = {}) {
  const res = await fetch(link, { headers });
  if (res.status !== 200) throw res;
  if (asText) return await res.text();
  return await res.json();
}

async function checkIfDeployed() {
  try {
    const deployments = await get(
      'https://api.github.com/repos/lusend/testwebsite/deployments'
    );

    const branches = await get(
      'https://api.github.com/repos/lusend/testwebsite/branches'
    );

    const { sha: commitID } = branches.find((el) => el.name === 'main').commit;

    const { sha: deploymentCommitID, url } = branches.find(
      (el) => el.name === 'gh-pages'
    ).commit;

    const deploymentCommit = await get(url);
    const { sha: deploymentID } = deployments[0];
    const { message: deploymentCommitMessage } = deploymentCommit.commit;

    const deployed =
      deploymentCommitMessage.includes(commitID) &&
      deploymentID === deploymentCommitID;

    if (deployed)
      document.getElementById('status').innerHTML =
        'Deployment Status: ✅ Deployed!';

    if (!deployed)
      document.getElementById('status').innerHTML =
        'Deployment Status: 🚧 Deploying... (Reload to check again)';
  } catch (error) {
    console.log(error);

    document.getElementById('status').innerHTML =
      'Deployment Status: ⛔ Unknown (Reached API Rate Limit)';
  }
}
