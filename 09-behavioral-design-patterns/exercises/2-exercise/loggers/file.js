import { open } from "node:fs/promises";
import { resolve } from "node:path";
import { BaseLogger } from "./base-logger.js";

export class FileLogger extends BaseLogger {
  #fh;
  constructor(fh) {
    super();
    this.#fh = fh;
  }
  static async create(filePath) {
    const absolutePath = resolve(filePath);
    const fh = await open(absolutePath, "a");
    const logger = new FileLogger(fh);
    return logger;
  }
  async log(message) {
    await this.#fh.write(`${message}\n`);
  }
  async destroy() {
    await this.#fh.close();
  }
}
