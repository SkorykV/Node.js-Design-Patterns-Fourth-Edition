import { open } from "node:fs/promises";
import { resolve } from "node:path";

export class FileStrategy {
  #fh;
  constructor(fh) {
    this.#fh = fh;
  }
  static async create(filePath) {
    const absolutePath = resolve(filePath);
    const fh = await open(absolutePath, "a");
    const strategy = new FileStrategy(fh);
    return strategy;
  }
  async log(message) {
    await this.#fh.write(`${message}\n`);
  }
  async destroy() {
    await this.#fh.close();
  }
}
