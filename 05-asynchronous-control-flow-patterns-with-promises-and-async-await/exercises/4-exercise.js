// Implement a concurrent asynchronous version of Array.map()
// that supports promises and a concurrency limit.
// The function should not directly leverage the TaskQueue or TaskQueuePC
// classes we presented in this chapter, but it can use the underlying patterns.
// The function, which we will define as mapAsync(iterable, callback, concurrency),
// will accept the following as inputs:
// An iterable, such as an array.
// A callback, which will receive as the input each item of the iterable
// (exactly like in the original Array.map())
// and can return either a Promise or a simple value.
// A concurrency, which defines how many items in the iterable
// can be processed by callback concurrently at each given time.

function mapAsync(iterable, callback, concurrency) {
  const itemsArray = Array.from(iterable);
  if (itemsArray.length === 0) {
    return Promise.resolve([]);
  }
  const { promise, resolve, reject } = Promise.withResolvers();
  const results = Array.from({ length: itemsArray.length });
  let rejected = false;
  let processed = 0;
  let running = 0;
  let i = 0;
  const run = () => {
    while (!rejected && i < itemsArray.length && running < concurrency) {
      const index = i;
      Promise.resolve()
        .then(() => callback(itemsArray[i++]))
        .then((value) => {
          processed++;
          results[index] = value;
          if (processed === itemsArray.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          rejected = true;
          reject(error);
        })
        .finally(() => {
          running--;
          run();
        });
      running++;
    }
  };
  run();
  return promise;
}

// test 1: run 10 tasks in queue with concurrency 2
import { setTimeout } from "node:timers/promises";
const start = Date.now();
const items = Array.from({ length: 10 }).map((_, i) => i + 1);
const results = await mapAsync(
  items,
  async (i) => {
    console.log(`Start task ${i}`);
    await setTimeout(1000);
    console.log(`End task ${i}`);
    return `done ${i}`;
  },
  2
);
const end = Date.now();
console.log("All tasks are done", results, (end - start) / 1000);
