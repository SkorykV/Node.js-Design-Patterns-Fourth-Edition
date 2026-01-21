import { FileLogger } from "./loggers/file.js";
import { ConsoleLogger } from "./loggers/console.js";

const fileLogger = await FileLogger.create("./logs.txt");
const consoleLogger = new ConsoleLogger();
let logger = consoleLogger;

await logger.debug("Debugging info");
await logger.info("Started program");
await logger.warn("Strange thing happened");
await logger.info("Exit");
await logger.destroy();
