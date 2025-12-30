import * as fs from "node:fs";
import * as path from "node:path";
import { listNestedFiles } from "./2-list-files.js";
import { parallelExecution } from "./utils/index.js";

function recursiveFind(dir, keyword, cb) {
  listNestedFiles(dir, (err, files) => {
    if (err) {
      return cb(err);
    }
    const checkFileTasks = files.map((file) => (taskCb) => {
      fs.readFile(file, "utf-8", (readError, fileContent) => {
        if (readError) {
          return taskCb(readError);
        }
        const isMatch = !!fileContent
          .toLowerCase()
          .match(keyword.toLowerCase());
        taskCb(null, { file, isMatch });
      });
    });
    parallelExecution(checkFileTasks, (matchingError, matchingResults) => {
      if (matchingError) {
        return cb(matchingError);
      }
      const matchedFiles = matchingResults
        .filter((result) => result.isMatch)
        .map((result) => result.file);
      cb(null, matchedFiles);
    });
  });
}

// ---- usage ----
const dir = process.argv[2];
recursiveFind(dir, "batman", (error, files) => {
  if (error) {
    console.log("error", error);
    return;
  }
  const resolvedDirPath = path.resolve(dir);
  console.log(files.map((filePath) => filePath.replace(resolvedDirPath, ".")));
});
