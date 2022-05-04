async function get(link, { asText = false, headers = {} } = {}) {
  const res = await fetch(link, { headers });
  if (res.status !== 200) throw res;
  if (asText) return await res.text();
  return await res.json();
}

window.get = get;
