// TaskQueue with promises:
// Migrate the TaskQueue class internals
// from promises to async/await where possible.

import { EventEmitter, once } from "node:events";
import { setTimeout } from "node:timers/promises";

export class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));
    return this;
  }

  async next() {
    if (this.running === 0 && this.queue.length === 0) {
      return this.emit("empty");
    }

    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      this.#runTask(task);
      this.running++;
    }
  }

  async #runTask(task) {
    try {
      await task();
    } catch (error) {
      this.emit("error", error);
    } finally {
      this.running--;
      this.next();
    }
  }

  stats() {
    return {
      running: this.running,
      scheduled: this.queue.length,
    };
  }
}

// test 1: run 10 tasks in queue with concurrency 2
const start = Date.now();
const tasks = Array.from({ length: 10 }).map((_, i) => async () => {
  console.log(`Start task ${i + 1}`);
  await setTimeout(1000);
  console.log(`End task ${i + 1}`);
});
const queue = new TaskQueue(2);
for (const task of tasks) {
  queue.pushTask(task);
}
await once(queue, "empty");
const end = Date.now();
console.log("All tasks are done", (end - start) / 1000);
