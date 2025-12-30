import * as fs from "node:fs";
import * as path from "node:path";

const ignoreFolders = ["node_modules", ".git", "dist", "build"];

function findBloat(folderPath, cb) {
  fs.stat(folderPath, (err, data) => {
    if (err) {
      return cb(err);
    }
    if (data.isFile()) {
      cb(null, { name: folderPath, size: data.size });
      return;
    }
    fs.readdir(folderPath, (err, allChildren) => {
      if (err) {
        return cb(err);
      }
      let biggestChild = { name: null, size: 0 };
      let checkedChildren = 0;
      let alreadyFailed = false;
      const children = allChildren.filter(
        (child) => !ignoreFolders.includes(child)
      );
      if (children.length === 0) {
        return cb(null, biggestChild);
      }
      for (const child of children) {
        const childPath = path.resolve(folderPath, child);
        findBloat(childPath, (childCheckError, biggestSubChild) => {
          if (alreadyFailed) {
            return;
          }
          if (childCheckError) {
            alreadyFailed = true;
            return cb(childCheckError);
          }
          if (biggestChild.size < biggestSubChild.size) {
            biggestChild = biggestSubChild;
          }
          checkedChildren += 1;
          //   console.log(folderPath, checkedChildren, children.length);
          if (checkedChildren >= children.length) {
            cb(null, biggestChild);
          }
        });
      }
    });
  });
}

const directory = path.resolve(import.meta.dirname, "../..");
console.log("Start checking", directory);
findBloat(directory, (error, result) => {
  if (error) {
    console.log("findBloatFailed", error);
    return;
  }
  console.log("result", result);
});
