async function checkIfDeployed() {
  try {
    const deployments = await get(
      'https://api.github.com/repos/lusend/website/deployments'
    );

    const branches = await get(
      'https://api.github.com/repos/lusend/website/branches'
    );

    const { sha: commitID } = branches.find((el) => el.name === 'main').commit;

    const { sha: deploymentCommitID, url } = branches.find(
      (el) => el.name === 'gh-pages'
    ).commit;

    const deploymentCommit = await get(url);
    const { sha: deploymentID } = deployments[0];
    const { message: deploymentCommitMessage } = deploymentCommit.commit;
    const files = deploymentCommit.files;

    const deployed =
      deploymentCommitMessage.includes(commitID) &&
      deploymentID === deploymentCommitID;

    if (deployed) {
      document.getElementById('status').innerHTML =
        'Deployment Status: ✅ Deployed!';

      files.map((file) => {
        const name = './src/' + file.filename.slice(0, -4) + 'md';
        const badge = document.querySelector(`[data-inputpath='${name}'`);

        if (badge) badge.style.display = 'flex';
      });
    }

    if (!deployed)
      document.getElementById('status').innerHTML =
        'Deployment Status: 🚧 Deploying... (Reload to check again)';
  } catch (error) {
    console.log(error);

    document.getElementById('status').innerHTML =
      'Deployment Status: ⛔ Unknown (Reached API Rate Limit)';
  }
}
