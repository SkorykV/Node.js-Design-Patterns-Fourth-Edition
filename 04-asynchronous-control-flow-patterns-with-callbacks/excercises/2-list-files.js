import * as fs from "node:fs";
import * as path from "node:path";
import { parallelExecution } from "./utils/index.js";

export function listNestedFiles(dir, cb) {
  fs.readdir(dir, (err, items) => {
    if (err) {
      return cb(err);
    }
    const analyzeChildrenTasks = items.map((item) => (taskCb) => {
      fs.stat(path.resolve(dir, item), (statError, itemStat) => {
        if (statError) {
          return taskCb(statError);
        }
        taskCb(null, {
          path: path.resolve(dir, item),
          isFile: itemStat.isFile(),
        });
      });
    });
    parallelExecution(
      analyzeChildrenTasks,
      (analyzeChildrenError, children) => {
        if (analyzeChildrenError) {
          return cb(analyzeChildrenError);
        }
        const topLevelFiles = children
          .filter((child) => child.isFile)
          .map((child) => child.path);
        const exploreFoldersTasks = children
          .filter((child) => !child.isFile)
          .map((child) => (taskCb) => listNestedFiles(child.path, taskCb));
        parallelExecution(
          exploreFoldersTasks,
          (innerFilesSearchError, innerFiles) => {
            if (innerFilesSearchError) {
              return cb(innerFilesSearchError);
            }
            cb(null, [...topLevelFiles, ...innerFiles.flat()]);
          }
        );
      }
    );
  });
}

// ---- usage ----
// const dir = process.argv[2];
// listNestedFiles(dir, (error, files) => {
//   if (error) {
//     console.log("error", error);
//     return;
//   }
//   const resolvedDirPath = path.resolve(dir);
//   console.log(files.map((filePath) => filePath.replace(resolvedDirPath, ".")));
// });
