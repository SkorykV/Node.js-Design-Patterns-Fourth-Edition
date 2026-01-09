import { Transform } from "node:stream";

export class BoroughsAnalyzingStream extends Transform {
  #aggregatedData = {};
  constructor(options) {
    super({ ...options, objectMode: true });
  }
  _transform(row, _enc, cb) {
    if (!this.#aggregatedData[row.borough]) {
      this.#aggregatedData[row.borough] = 0;
    }
    this.#aggregatedData[row.borough] += parseInt(row.value);
    cb();
  }
  _flush(done) {
    const boroughs = Object.entries(this.#aggregatedData).sort(
      ([_a, crimesCountA], [_b, crimesCountB]) => crimesCountA - crimesCountB
    );
    this.push(
      boroughs
        .reverse()
        .slice(0, 10)
        .map((d) => d[0])
    );
    done();
  }
}
