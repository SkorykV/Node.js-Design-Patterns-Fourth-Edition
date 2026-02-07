import { createServer } from "node:http";
import { URL } from "node:url";
import path from "node:path";
import { ThreadPool } from "./threadPool.js";

const workerFile = path.join(import.meta.dirname, "worker.js");
const workersPool = new ThreadPool(workerFile, 1);

async function handleExecuteEndpoint(code, args) {
  const worker = await workersPool.acquire();
  worker.postMessage({ code, args });
  return new Promise((resolve) => {
    worker.once("message", (message) => {
      workersPool.release(worker);
      resolve(message);
    });
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3000");
  if (req.method !== "POST" || url.pathname !== "/execute") {
    res.write("Im alive");
    res.end();
    return;
  }
  const body = await parseBody(req);
  const { code, args } = JSON.parse(body);
  const result = await handleExecuteEndpoint(code, args);
  res.write(JSON.stringify(result));
  res.end();
});

server.listen(3000, () => {
  console.log("server is listening");
});

function parseBody(req) {
  const chunks = [];
  return new Promise((resolve) => {
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const bodyBuffer = Buffer.concat(chunks);
      const body = bodyBuffer.toString("utf-8");
      resolve(body);
    });
  });
}
