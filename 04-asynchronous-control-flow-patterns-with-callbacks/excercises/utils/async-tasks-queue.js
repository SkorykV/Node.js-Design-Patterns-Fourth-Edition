import { EventEmitter } from "node:events";

export class AsyncTasksQueue extends EventEmitter {
  #tasks = [];
  #running = 0;
  #hasFailed = false;
  #maxConcurrency;
  constructor(maxConcurrency) {
    super();
    this.#maxConcurrency = maxConcurrency;
  }
  push(task) {
    if (this.#hasFailed) {
      return false;
    }
    this.#tasks.push(task);
    process.nextTick(this.run.bind(this));
    return true;
  }

  run() {
    if (!this.#tasks.length && !this.#running) {
      this.emit("finished");
    }
    while (this.#tasks.length && this.#running < this.#maxConcurrency) {
      const task = this.#tasks.shift();
      task((err) => {
        this.#running--;
        if (this.#hasFailed) {
          return;
        }
        if (err) {
          this.#hasFailed = true;
          this.#tasks = [];
          return;
        }
        process.nextTick(this.run.bind(this));
      });
      this.#running++;
    }
  }
}
