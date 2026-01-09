import { Transform } from "node:stream";

export class CrimesPerYearStream extends Transform {
  #resultByYear = {};
  constructor(options) {
    super({ ...options, objectMode: true });
  }
  _transform(row, _enc, cb) {
    if (!this.#resultByYear[row.year]) {
      this.#resultByYear[row.year] = 0;
    }
    this.#resultByYear[row.year] += parseInt(row.value);
    cb();
  }
  _flush(done) {
    this.push(this.#resultByYear);
    done();
  }
}
