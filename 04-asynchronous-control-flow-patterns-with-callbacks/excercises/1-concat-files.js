import { readFile, writeFile } from "node:fs";
import { sequentialExecution } from "./utils/index.js";

function concatFiles(sources, dest, cb) {
  const tasks = sources.map((source, i) => {
    return function (_, callback) {
      readFile(source, (err, data) => {
        if (err) {
          return callback(err);
        }
        const writeFlag = i === 0 ? { flag: "w" } : { flag: "a" };
        writeFile(dest, data, writeFlag, callback);
      });
    };
  });
  sequentialExecution(tasks, cb);
}

concatFiles(
  ["./input/a.txt", "./input/b.txt", "./input/c.txt"],
  "./output/dest.txt",
  (err) => {
    if (err) {
      console.log("Concatenation failed", err);
    } else {
      console.log("Concatenation succeeded");
    }
  }
);
