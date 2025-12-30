import { EventEmitter } from "node:events";

function ticker(n, cb) {
  const emitter = new EventEmitter();
  let ticksCount = 0;
  const interval = setInterval(() => {
    emitter.emit("tick", ++ticksCount);
  }, 50);
  setTimeout(() => {
    clearInterval(interval);
    cb(ticksCount);
  }, n);
  return emitter;
}

function tickerV2(n, cb) {
  const emitter = new EventEmitter();
  let ticksCount = 0;
  let timeLeft = n;
  const simulateError = () => {
    const isError = Date.now() % 5 === 0;
    if (isError) {
      const error = new Error("Timestamp divisible by 5");
      emitter.emit("error", error);
      cb(error);
    }
    return isError;
  };
  const setupNextTick = () => {
    const nextTick = Math.min(timeLeft, 50);
    setTimeout(() => {
      const isError = simulateError();
      if (isError) return;
      timeLeft -= nextTick;
      if (nextTick === 50) {
        emitter.emit("tick", ++ticksCount);
      }
      if (timeLeft) {
        setupNextTick();
      } else {
        cb(null, ticksCount);
      }
    }, nextTick);
  };

  process.nextTick(() => {
    const isError = simulateError();
    if (isError) return;
    emitter.emit("tick", ticksCount);
    setupNextTick();
  });
  return emitter;
}

tickerV2(149, (error, i) => {
  if (error) {
    console.log("Crushed", error);
  }
  console.log("Stopped", i);
})
  .on("tick", (i) => console.log("Another tick happed", i))
  .on("error", (e) => console.log("Event emitter caught error", e));
