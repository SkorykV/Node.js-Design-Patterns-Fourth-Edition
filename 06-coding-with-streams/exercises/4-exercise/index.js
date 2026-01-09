import { createReadStream } from "node:fs";
import * as http from "node:http";
import { join } from "node:path";
import { Transform, compose } from "node:stream";
import { pipeline } from "node:stream/promises";
import { setTimeout } from "node:timers/promises";

// ANSI color codes
const red = "\x1b[31m";
const yellow = "\x1b[33m";
const green = "\x1b[32m";
const reset = "\x1b[0m";
const clear = "\x1Bc\x1B[3J";

const framesDir = join(import.meta.dirname, "frames");

class ColorfulFramePrinter extends Transform {
  #firstChunk = true;
  #color;
  constructor(options) {
    const { color, ...rest } = options;
    super({ ...rest, encoding: "ascii" });
    this.#color = color;
  }
  _transform(chunk, enc, cb) {
    if (this.#firstChunk) {
      this.push(`${clear}${this.#color}`);
      this.#firstChunk = false;
    }
    this.push(chunk, enc);
    cb();
  }
  _flush(done) {
    this.push(reset);
    done();
  }
}

async function drawFrame(index, color, destinationStream) {
  const framePath = join(framesDir, `frame-${index}.txt`);
  const frameStream = createReadStream(framePath, { encoding: "ascii" });
  const colorfulFrameStream = new ColorfulFramePrinter({ color });
  const sourceStream = compose(frameStream, colorfulFrameStream);

  try {
    await pipeline(sourceStream, destinationStream, {
      end: false,
    });
  } catch (err) {
    if (
      err.code === "ERR_STREAM_PREMATURE_CLOSE" ||
      err.code === "ERR_STREAM_DESTROYED" ||
      err.code === "ERR_STREAM_UNABLE_TO_PIPE"
    ) {
      throw Object.assign(new Error("Connection closed"), {
        isConnectionClose: true,
      });
    }
    throw err;
  }
}

function getColorPicker(colors) {
  let currentColor = 0;
  return function () {
    const color = colors[currentColor];
    currentColor = (currentColor + 1) % colors.length;
    return color;
  };
}

async function drawAnimation(frameTime, destinationStream) {
  const getColor = getColorPicker([red, yellow, green]);
  try {
    while (true) {
      for (let i = 0; i < 6; i++) {
        const color = getColor();
        await drawFrame(i, color, destinationStream);
        await setTimeout(frameTime);
      }
    }
  } catch (err) {
    if (err.isConnectionClose) {
      console.log("Client disconnected gracefully");
      return;
    }
    throw err;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url !== "/animation" || req.method !== "GET") {
    console.log("stranger came");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("wrong endpoint");
    return;
  }
  console.log("One more client connected to get animation");
  res.writeHead(200, { "Content-Type": "text/plain" });

  try {
    await drawAnimation(1000, res);
  } catch (err) {
    // Only log if it's an actual error, not a connection close
    if (!err.isConnectionClose) {
      console.error("Unexpected error:", err);
    }
  }
});

server.listen(3000, "0.0.0.0", async () => {
  console.log("Listening on 0.0.0.0");
});
