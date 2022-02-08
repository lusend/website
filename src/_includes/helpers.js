function get(link, callback, error) {
  fetch(link)
    .then((res) => {
      switch (res.status) {
        case 200:
          return res.text();
        case 404:
          throw res;
      }
    })
    .then(callback)
    .catch(error ? error : (res) => console.log(res.statusText));
}
