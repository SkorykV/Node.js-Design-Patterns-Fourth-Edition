class AsyncQueue {
  #tasks = [];
  #workers = [];
  #finished = false;
  get length() {
    return this.#tasks.length;
  }
  enqueue(task) {
    if (this.#finished) {
      return false;
    }
    if (this.#workers.length && !this.#tasks.length) {
      const worker = this.#workers.shift();
      worker(task);
    } else {
      this.#tasks.push(task);
    }
    return true;
  }
  done() {
    this.#finished = true;
  }

  async *[Symbol.asyncIterator]() {
    while (!this.#finished || this.#tasks.length) {
      const task = await this.#getTask();
      yield task;
    }
    return;
  }

  #getTask() {
    if (!this.#tasks.length || this.#workers.length) {
      const { promise, resolve } = Promise.withResolvers();
      this.#workers.push(resolve);
      return promise;
    }
    return Promise.resolve(this.#tasks.shift());
  }
}

// usage
import { setTimeout } from "timers/promises";
const queue = new AsyncQueue();
(async () => {
  let taskId = 1;
  while (true) {
    const currentTaskId = taskId++;
    const task = async () => {
      //   console.log(`Start task ${currentTaskId}`);
      await setTimeout(1000);
      //   console.log(`End task ${currentTaskId}`);
    };
    const result = queue.enqueue(task);
    if (!result) {
      console.log("Was not able to enqueue task", currentTaskId);
      break;
    }
    // console.log("Enqueued task", currentTaskId);
    await setTimeout(3000);
  }
})();

async function startWorker(workerId) {
  let i = 1;
  for await (const task of queue) {
    console.log(`[worker ${workerId}] Got task`, {
      task: i++,
      queueLength: queue.length,
    });
    await task();
  }
}

for (let i = 1; i <= 5; i++) {
  startWorker(i);
}

await setTimeout(1000 * 30);
queue.done();
