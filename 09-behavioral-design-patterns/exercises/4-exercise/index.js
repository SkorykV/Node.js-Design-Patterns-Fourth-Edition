import { setTimeout } from "timers/promises";
import { LoggerMiddlewareManager } from "./middleware-manager.js";
import * as middlewares from "./middlewares/index.js";

const LOGGER_LEVELS = ["info", "debug", "warn", "error"];

const middlewareManager = new LoggerMiddlewareManager(console);
const logger = new Proxy(middlewareManager, {
  get(target, property) {
    if (LOGGER_LEVELS.includes(property)) {
      return async (message) => {
        await target.log({ level: property, message });
      };
    }
    if (property === "log") {
      throw new Error('"log" method is not accessible directly');
    }
    return target[property];
  },
});

middlewareManager
  .use(middlewares.serialize)
  .use(middlewares.addTimestamp)
  .use(middlewares.addLogLevelToMessage)
  .use(middlewares.getSaveToFileMiddleware("logs.txt"))
  .use(middlewares.applyColor)
  .use(middlewares.mapToMessage);

await logger.info({ event: "user_login", user: "john_doe" });
await logger.debug("Debug log");
await setTimeout(1000);
await logger.warn("Warning log");
await logger.error(new Error("Something went wrong"));
