import { createReadStream } from "node:fs";
import { createConnection } from "node:net";
import { compose } from "node:stream";
import { createCipheriv, randomBytes } from "node:crypto";
import { basename, join } from "node:path";

const secret = Buffer.from(process.argv[2], "hex");
const filesToSend = process.argv.slice(3).map((file) => basename(file));
function sendFile(fileName, destinationStream) {
  const { promise, resolve, reject } = Promise.withResolvers();
  const filePath = join(import.meta.dirname, "client-data", fileName);
  const sourceStream = createReadStream(filePath);
  const fileNameBuffer = Buffer.from(fileName, "utf-8");
  sourceStream
    .on("readable", () => {
      let chunk;
      while ((chunk = sourceStream.read()) !== null) {
        const packageBuffer = Buffer.alloc(
          4 + fileNameBuffer.length + 4 + chunk.length
        );
        packageBuffer.writeUInt32BE(fileNameBuffer.length, 0);
        fileNameBuffer.copy(packageBuffer, 4);
        packageBuffer.writeUInt32BE(chunk.length, 4 + fileNameBuffer.length);
        chunk.copy(packageBuffer, 4 + fileNameBuffer.length + 4);
        destinationStream.write(packageBuffer);
      }
    })
    .on("error", (error) => reject(error))
    .on("end", () => {
      resolve();
    });
  return promise;
}

async function transferFiles(socket) {
  const iv = randomBytes(16);
  console.log("iv", iv.toString("hex"));
  socket.write(iv);
  const cipherStream = createCipheriv("aes192", secret, iv);
  const destinationStream = compose(cipherStream, socket);
  try {
    await Promise.all(
      filesToSend.map((fileName) => sendFile(fileName, destinationStream))
    );
    destinationStream.end();
    console.log("Files were sent successfully");
    socket.end();
  } catch (error) {
    console.error("Error happened on data transmission", error);
    socket.end();
  }
}

const client = createConnection({ port: 3000, host: "localhost" }, () => {
  transferFiles(client);
});
