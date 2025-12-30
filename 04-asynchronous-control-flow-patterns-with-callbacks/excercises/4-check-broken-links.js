import {
  AsyncTasksQueue,
  getUrlStatus,
  get,
  getPageLinks,
} from "./utils/index.js";

function checkBrokenLinks(url, maxDepth, tasksQueue, finalCb) {
  if (maxDepth === 0) {
    finalCb(null);
  }
  getUrlStatus(url, (err, status) => {
    if (err) {
      return finalCb(err);
    }

    if (status !== 200) {
      console.log({ url, status });
      return finalCb(null);
    }
    const leftDepth = maxDepth - 1;
    if (!leftDepth) {
      return finalCb(null);
    }
    get(url, (getError, content) => {
      if (getError) {
        return finalCb(getError);
      }
      const links = getPageLinks(url, content.toString("utf8"));
      for (const link of links) {
        startLinksCheck(link, leftDepth, tasksQueue);
      }
      finalCb(null);
    });
  });
}

const visited = new Set();

function startLinksCheck(url, maxDepth, tasksQueue) {
  if (visited.has(url)) {
    return;
  }
  visited.add(url);
  tasksQueue.push((done) => checkBrokenLinks(url, maxDepth, tasksQueue, done));
}

function main() {
  const tasksQueue = new AsyncTasksQueue(20);
  tasksQueue.once("finished", () => {
    console.log("All links checked");
  });
  startLinksCheck("https://korter.ge/en/", 2, tasksQueue);
}

main();
