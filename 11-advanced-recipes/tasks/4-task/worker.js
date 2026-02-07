import { parentPort } from "node:worker_threads";
import vm from "node:vm";

parentPort.on("message", (msg) => {
  const result = vm.runInContext(
    `(${msg.code})(...args)`,
    vm.createContext({ args: msg.args }),
  );
  parentPort.postMessage(result);
});
