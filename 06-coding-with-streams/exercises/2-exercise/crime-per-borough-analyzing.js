import { Transform } from "node:stream";

export class TheMostCommonCrimePerBoroughStream extends Transform {
  #crimePerBorough = {};
  constructor(options) {
    super({ ...options, objectMode: true });
  }
  _transform(row, _enc, cb) {
    if (!this.#crimePerBorough[row.borough]) {
      this.#crimePerBorough[row.borough] = {};
    }
    const crime = `${row.major_category}_${row.minor_category}`;
    if (!this.#crimePerBorough[row.borough][crime]) {
      this.#crimePerBorough[row.borough][crime] = 0;
    }
    this.#crimePerBorough[row.borough][crime] += parseInt(row.value);
    cb();
  }
  _flush(done) {
    const crimePerBoroughArray = Object.entries(this.#crimePerBorough);
    const result = {};
    for (const [borough, crimes] of crimePerBoroughArray) {
      const sortedCrimes = Object.entries(crimes).sort(
        ([_a, crimesCountA], [_b, crimesCountB]) =>
          -(crimesCountA - crimesCountB)
      );
      const [category, subcategory] = sortedCrimes[0][0].split("_");
      result[borough] = { category, subcategory, count: sortedCrimes[0][1] };
    }
    this.push(result);
    done();
  }
}
