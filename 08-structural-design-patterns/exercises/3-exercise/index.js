const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const reset = "\x1b[0m";

function patchConsoleWithColors(console) {
  return new Proxy(console, {
    get(target, property) {
      if (property in colors) {
        return (...args) => {
          const color = colors[property];
          target["log"](color, ...args, reset);
        };
      }
      return target[property];
    },
  });
}

const colorfulConsole = patchConsoleWithColors(console);

colorfulConsole.red("Red message");
colorfulConsole.yellow("Yellow message");
colorfulConsole.green("Green message");
colorfulConsole.info("Just usual one");
