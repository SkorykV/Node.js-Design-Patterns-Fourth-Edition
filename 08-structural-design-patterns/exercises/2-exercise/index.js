import { setTimeout } from "node:timers/promises";

function patchConsoleWithTimeStamp(console) {
  const patchedMethods = ["log", "info", "debug", "warn", "error"];
  return new Proxy(console, {
    get(target, property) {
      if (patchedMethods.includes(property)) {
        return (...args) => {
          return target[property](new Date().toISOString(), ...args);
        };
      }
      return target[property];
    },
  });
}

const consoleWithTimeStamp = patchConsoleWithTimeStamp(console);

consoleWithTimeStamp.log("Normal log", { data: 1 });
consoleWithTimeStamp.warn("Unusual thing", { data: 2 });
await setTimeout(1000);
consoleWithTimeStamp.error({
  error: "DON'T LOOK UP",
});
