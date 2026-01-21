import { BaseLogger } from "./base-logger.js";

export class ConsoleLogger extends BaseLogger {
  async log(message) {
    console.log(message);
  }
  async destroy() {}
}
