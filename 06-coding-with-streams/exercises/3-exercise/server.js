// File share over TCP: Build a client and a server to transfer files over TCP.
// Extra points if you add a layer of encryption on top of that and if you can transfer multiple files at once.
// Once you have your implementation ready, give the client code and your IP address to a friend or a colleague,
// then ask them to send you some files! Hint: You could use mux/demux to receive multiple files at once.

import { createServer } from "node:net";
import { randomBytes, createDecipheriv } from "node:crypto";
import { createWriteStream } from "node:fs";
import { join, basename } from "node:path";

const secret = randomBytes(24);
console.log(`Generated secret: ${secret.toString("hex")}`);

function getDemultiplexingFilesReader() {
  let fileNameLength = null;
  let fileName = null;
  let chunkLength = null;
  let chunk;
  return function readFiles(source, cb) {
    while (true) {
      if (fileNameLength === null) {
        chunk = source.read(4);
        fileNameLength = chunk && chunk.readUInt32BE(0);
        if (fileNameLength === null) {
          return;
        }
      }
      if (fileName === null) {
        chunk = source.read(fileNameLength);
        fileName = chunk && chunk.toString("utf8");
        if (fileName === null) {
          return;
        }
      }
      if (chunkLength === null) {
        chunk = source.read(4);
        chunkLength = chunk && chunk.readUInt32BE(0);
        if (chunkLength === null) {
          return;
        }
      }
      chunk = source.read(chunkLength);
      if (chunk === null) {
        return;
      }
      cb({ fileName, chunk });
      fileNameLength = null;
      fileName = null;
      chunkLength = null;
    }
  };
}

function handleFiles(source) {
  const { promise, resolve } = Promise.withResolvers();
  const filesDir = join(import.meta.dirname, "server-data");
  const fileStreams = {};
  const readFiles = getDemultiplexingFilesReader();
  const handleChunk = ({ fileName, chunk }) => {
    if (!fileStreams[fileName]) {
      fileStreams[fileName] = createWriteStream(
        join(filesDir, basename(fileName))
      );
    }
    fileStreams[fileName].write(chunk);
  };
  source
    .on("readable", () => {
      readFiles(source, handleChunk);
    })
    .on("end", () => {
      for (const fileName in fileStreams) {
        const stream = fileStreams[fileName];
        stream.end();
      }
      resolve();
    });
  return promise;
}

const server = createServer((socket) => {
  let iv = null;
  socket.once("readable", () => {
    if (iv === null) {
      iv = socket.read(16);
      console.log("iv", iv.toString("hex"));
      if (iv === null) {
        return;
      }
    }
    const decryptedFilesStream = socket.pipe(
      createDecipheriv("aes192", secret, iv)
    );
    socket.on("error", (error) => {
      console.log("Network error occurred", error);
      socket.destroy();
      decryptedFilesStream.destroy();
    });
    decryptedFilesStream.on("error", (error) => {
      console.log("Decrypting error occurred", error);
      socket.destroy();
      decryptedFilesStream.destroy();
    });
    handleFiles(decryptedFilesStream).then(() => {
      console.log("Files received");
    });
  });
});

server.listen(3000);
