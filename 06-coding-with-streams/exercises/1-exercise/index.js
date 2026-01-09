// Data compression efficiency: Write a command-line script that takes a file as input
// and compresses it using the different algorithms available in the zlib module (Brotli, Deflate, Gzip).
// You want to produce a summary table that compares the algorithm’s compression time and compression
// efficiency on the given file.
// Hint: This could be a good use case for the fork pattern, but remember that we made some important performance
// considerations when we discussed it earlier in this chapter.

import { createReadStream } from "node:fs";
import { PassThrough } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createGzip, createDeflate } from "node:zlib";

async function measureCompression(filePath, compressingStream) {
  const fileStream = createReadStream(filePath);
  let start;
  let fileSize = 0;
  let compressedFileSize = 0;
  fileStream.on("data", (chunk) => {
    if (!start) {
      start = Date.now();
    }
    fileSize += chunk.length;
  });
  const sizeCounter = new PassThrough();
  sizeCounter.on("data", (chunk) => {
    compressedFileSize += chunk.length;
  });
  await pipeline(fileStream, compressingStream, sizeCounter);
  return {
    time: Date.now() - start,
    originalSize: fileSize,
    compressedSize: compressedFileSize,
    sizeRatio: compressedFileSize / fileSize,
  };
}

async function compareCompression(filePath) {
  const [brotli, deflate, gzip] = await Promise.all([
    measureCompression(filePath, createBrotliCompress()),
    measureCompression(filePath, createDeflate()),
    measureCompression(filePath, createGzip()),
  ]);
  console.table([
    { algorithm: "Brotli", ...brotli },
    { algorithm: "Deflate", ...deflate },
    { algorithm: "Gzip", ...gzip },
  ]);
}
await compareCompression(process.argv[2]);
