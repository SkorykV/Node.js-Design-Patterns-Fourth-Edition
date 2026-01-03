// Dissecting Promise.all(): Implement your own version of Promise.all()
// leveraging promises, async/await, or a combination of the two.
// The function must be functionally equivalent to its original counterpart.
import { delay } from "./utils/delay.js";

function promiseAll(promisesIterable) {
  const promisesArray = Array.from(promisesIterable);
  if (promisesArray.length === 0) {
    return Promise.resolve([]);
  }
  const { promise, resolve, reject } = Promise.withResolvers();
  let resolvedCount = 0;
  const values = Array.from({ length: promisesArray.length });
  for (let i = 0; i < promisesArray.length; i++) {
    Promise.resolve(promisesArray[i])
      .then((v) => {
        values[i] = v;
        if (++resolvedCount === promisesArray.length) {
          resolve(values);
        }
      })
      .catch(reject);
  }
  return promise;
}

// test 1: multiple promises in array
// try {
//   const start = Date.now();
//   const results = await promiseAll([
//     delay("hello", 1000).then(() => {
//       throw new Error("Not now!!!!");
//     }),
//     delay("world", 2000),
//     Promise.resolve("!!!"),
//   ]);
//   const end = Date.now();

//   console.log(results.join(" "), (end - start) / 1000);
// } catch (e) {
//   console.log("Error happened", e);
// }

// test 2: empty array
// const results = await promiseAll([]);
// console.log("Empty array", results);

// test 3: set of promises
// const results = await promiseAll(
//   new Set([delay("hello", 1000), delay("world", 2000)])
// );
// console.log(results.join(" "));

// test 4: array of promises and literals
const results = await promiseAll([
  delay("hello", 1000),
  delay("world", 2000),
  "!!!!",
]);
console.log(results.join(" "));
