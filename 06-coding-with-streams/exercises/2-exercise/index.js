// Stream data processing: On Kaggle, you can find a lot of interesting datasets,
// such as London Crime Data (nodejsdp.link/london-crime).
// You can download the data in CSV format and build a stream processing script
// that analyzes the data and tries to answer the following questions:
//      Did the number of crimes go up or down over the years?
//      What are the most dangerous areas of London?
//      What is the most common crime per area? What is the least common crime?

import { createReadStream, writeFileSync } from "node:fs";
import { Parser } from "csv-parse";
import { compose, PassThrough } from "node:stream";
import { takeAggregationStreamResult } from "./take-aggregation-stream-result.js";
import { CrimesPerYearStream } from "./crimes-per-year-analyzing.js";
import { BoroughsAnalyzingStream } from "./boroughs-analyzing.js";
import { TheMostCommonCrimePerBoroughStream } from "./crime-per-borough-analyzing.js";

const csvParser = new Parser({ columns: true });
let rowsCount = 0;
const monitor = new PassThrough({ objectMode: true })
  .on("data", () => {
    rowsCount++;
    if (rowsCount % 1e6 === 0) {
      console.log(`Read ${rowsCount / 1e6}/13 millions of rows`);
    }
  })
  .on("end", () => console.log(`Processed all ${rowsCount} rows`));
const crimesStream = compose(
  createReadStream("./london_crime_by_lsoa.csv"),
  csvParser,
  monitor
);

const [perYear, dangerousBoroughs, commonCrimePerBorough] = await Promise.all([
  takeAggregationStreamResult(crimesStream, new CrimesPerYearStream()),
  takeAggregationStreamResult(crimesStream, new BoroughsAnalyzingStream()),
  takeAggregationStreamResult(
    crimesStream,
    new TheMostCommonCrimePerBoroughStream()
  ),
]);

writeFileSync(
  "statistics.json",
  JSON.stringify(
    { perYear, dangerousBoroughs, commonCrimePerBorough },
    undefined,
    4
  )
);
