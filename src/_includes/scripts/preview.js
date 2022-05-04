function preview(slug, production, stage) {
  document.getElementById(slug + '_preview').onclick = function () {
    const env = Alpine.store('env').value;
    const link = env === 'stage' ? stage : production;
    window.location.href = link + '?cache-bust=' + Date.now();
  };

  document.getElementById(slug + '_copy').onclick = async function () {
    const env = Alpine.store('env').value;
    const link = env === 'stage' ? stage : production;

    const page = await get(link + '?cache-bust=' + Date.now(), {
      asText: true
    });
    navigator.clipboard.writeText(page);
  };
}
