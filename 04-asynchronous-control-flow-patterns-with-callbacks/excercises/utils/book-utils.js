import { Parser } from "htmlparser2";

export function getUrlStatus(url, cb) {
  fetch(url, { method: "HEAD" })
    .then((response) => {
      cb(null, response.status);
    })
    .catch((err) => cb(err));
}

// NOTE: this function is just for illustrative purposes. We are wrapping
// fetch in a callback-based API because at this point of the book we want
// to demonstrate callback based patterns
export function get(url, cb) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      // NOTE: this loads all the content in memory and therefore is not suitable
      // to handle large payloads.
      // For large payloads, we would need to use a stream-based approach
      return response.arrayBuffer();
    })
    .then((content) => cb(null, Buffer.from(content)))
    .catch((err) => cb(err));
}

export function getPageLinks(currentUrl, body) {
  const url = new URL(currentUrl);
  const internalLinks = [];
  const parser = new Parser({
    onopentag(name, attribs) {
      if (name === "a" && attribs.href) {
        const newUrl = new URL(attribs.href, url);
        if (
          newUrl.hostname === url.hostname &&
          newUrl.pathname !== url.pathname
        ) {
          internalLinks.push(newUrl.toString());
        }
      }
    },
  });
  parser.end(body);

  return internalLinks;
}
