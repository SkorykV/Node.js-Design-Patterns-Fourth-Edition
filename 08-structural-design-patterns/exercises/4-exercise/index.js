import * as fs from "node:fs/promises";
import { resolve } from "node:path";

function createFsAdapter(storage) {
  async function readFile(filename, options = undefined) {
    const resolvedPath = resolve(filename);
    const data = storage.get(resolvedPath);
    if (!data) {
      const e = new Error(
        `ENOENT: no such file or directory, open '${filename}'`
      );
      e.code = "ENOENT";
      e.errno = 34;
      e.path = filename;
      throw e;
    }
    const encoding = typeof options === "string" ? options : options?.encoding;
    if (!encoding) {
      return data;
    }
    return data.toString(encoding);
  }
  async function writeFile(filename, data, options = undefined) {
    const resolvedPath = resolve(filename);
    const encoding = typeof options === "string" ? options : options?.encoding;
    const buffer = Buffer.from(data, encoding);
    storage.set(resolvedPath, buffer);
  }
  return { readFile, writeFile };
}

const storage = new Map();
const adapter = createFsAdapter(storage);

await adapter.writeFile("./data/text.txt", Buffer.from("Hello World from Map"));
await fs.writeFile("./data/text.txt", "Hello world from fs");

const data = await adapter.readFile("./data/text.txt", "utf-8");
const realFsData = await fs.readFile("./data/text.txt", "utf-8");
console.log("data", { data, realFsData });
