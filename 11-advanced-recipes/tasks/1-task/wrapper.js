export function withInitHandling(
  target,
  methods,
  initializedEventName = "initialized",
) {
  let isInitialized = false;
  const commandsQueue = [];
  target.once(initializedEventName, () => {
    console.log(
      "Initialization completed. Executing queued commands...",
      commandsQueue.length,
    );
    isInitialized = true;
    while (commandsQueue.length > 0) {
      const command = commandsQueue.shift();
      command();
    }
  });
  const proxy = new Proxy(target, {
    get(target, prop) {
      console.log(`Accessing property: ${String(prop)}`);
      if (methods.includes(prop)) {
        return function (...args) {
          if (!isInitialized) {
            return new Promise((resolve, reject) => {
              const command = () => {
                console.log(
                  `Executing queued command: ${prop}(${args.join(", ")})`,
                );
                target[prop].apply(target, args).then(resolve, reject);
              };
              commandsQueue.push(command);
              console.log(`Command queued: ${prop}(${args.join(", ")})`);
            });
          }
          return target[prop](...args);
        };
      }
      const value = target[prop];
      if (typeof value === "function") {
        return value.bind(target);
      }
      return value;
    },
  });
  return proxy;
}
