import { Logger } from "./logger.js";
import { FileStrategy } from "./strategies/file.js";
import { ConsoleStrategy } from "./strategies/console.js";

const fileStrategy = await FileStrategy.create("./logs.txt");
const consoleStrategy = new ConsoleStrategy();
const logger = new Logger(fileStrategy);

await logger.debug("Debugging info");
await logger.info("Started program");
await logger.warn("Strange thing happened");
await logger.info("Exit");
await logger.destroy();
