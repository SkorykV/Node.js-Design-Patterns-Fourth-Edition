function cachedFetch(fetch) {
  const cache = new Map();
  return function (...args) {
    const options = args[1] ?? {};
    if (!options.method || options.method === "GET") {
      const { headers = {} } = options;
      const url = args[0];
      const key = JSON.stringify({ url, headers });
      if (cache.has(key)) {
        const response = cache.get(key);
        return Promise.resolve(response.clone());
      }
      return fetch(...args).then((response) => {
        cache.set(key, response.clone());
        return response;
      });
    }
  };
}

// usage example

const fetchWithCache = cachedFetch(fetch);

async function fetchPost(postId) {
  const url = `https://jsonplaceholder.typicode.com/posts/${postId}`;
  const response = await fetchWithCache(url);
  const start = process.hrtime.bigint();
  const data = await response.json();
  const end = process.hrtime.bigint(start);
  console.log({
    data,
    duration: `${(end - start) / BigInt(10e3)} micro seconds`,
  });
}

await fetchPost(1);
await fetchPost(1);
await fetchPost(1);
