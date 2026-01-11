import * as http from "node:http";
import { setTimeout } from "node:timers/promises";

class Queue {
  #tasks = [];
  #workers = [];
  constructor(tasksGenerator) {
    tasksGenerator(this.#enqueue.bind(this));
  }
  dequeue() {
    const { promise, resolve } = Promise.withResolvers();
    if (this.#tasks.length && !this.#workers.length) {
      resolve(this.#tasks.shift());
    } else {
      this.#workers.push(resolve);
    }
    return promise;
  }
  #enqueue(task) {
    if (this.#workers.length) {
      const worker = this.#workers.shift();
      worker(task);
      return;
    }
    this.#tasks.push(task);
  }
}

const queue = new Queue((enqueue) => {
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      chunks.push(chunk);
    });
    req.on("end", () => {
      res.writeHead(200);
      res.end("ok");
      const body = Buffer.concat(chunks).toString();
      const { tasks } = JSON.parse(body);
      console.log("tasks received from client", tasks);
      for (const task of tasks) {
        enqueue(task);
      }
    });
  });
  server.listen(3000, () => {
    console.log("Server is listening");
  });
});

async function startWorker(workerName) {
  while (true) {
    console.log(`${workerName} trying to get a task`);
    const task = await queue.dequeue();
    console.log(`${workerName} received task`, task);
    await setTimeout(500);
    console.log(`${workerName} processed task`, task);
  }
}

startWorker("first");
startWorker("second");
