import { PassThrough } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function takeAggregationStreamResult(
  crimesStream,
  aggregationStream
) {
  let finalResult;
  const sink = new PassThrough({ objectMode: true });
  sink.on("data", (result) => {
    finalResult = result;
  });
  await pipeline(crimesStream, aggregationStream, sink);
  return finalResult;
}
