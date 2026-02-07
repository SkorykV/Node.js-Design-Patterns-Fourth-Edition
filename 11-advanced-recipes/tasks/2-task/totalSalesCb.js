import { Level } from "level";

const db = new Level("sales", { valueEncoding: "json" });

export function totalSales(product, cb) {
  const now = Date.now();
  let sum = 0;
  function consumeIterator(iterator) {
    iterator
      .next()
      .then((value) => {
        if (!value) {
          console.log(`totalSales() took: ${Date.now() - now}ms`);
          cb(null, sum);
          return;
        }
        const [_transactionId, transaction] = value;
        if (!product || transaction.product === product) {
          sum += transaction.amount;
        }
        consumeIterator(iterator);
      })
      .catch((err) => {
        cb(err);
      });
  }
  consumeIterator(db.iterator());
}
