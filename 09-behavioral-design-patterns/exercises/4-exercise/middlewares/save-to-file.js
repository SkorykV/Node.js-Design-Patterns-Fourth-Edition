import fs from "fs/promises";
import { resolve } from "path";

export function getSaveToFileMiddleware(filePath) {
  const absolutePath = resolve(filePath);
  return async function saveToFileMiddleware(initialMessage) {
    const logLine = `${initialMessage.message}\n`;
    await fs.appendFile(absolutePath, logLine);
    return initialMessage;
  };
}
