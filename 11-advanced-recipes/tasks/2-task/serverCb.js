import { createServer } from "node:http";
// import { totalSales } from "./totalSales.js";
import { totalSales } from "./totalSalesCacheCb.js";

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const product = url.searchParams.get("product");
  console.log(`Processing query: ${url.search}`);

  totalSales(product, (err, sum) => {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      res.writeHead(500);
      res.end();
      return;
    }
    res.writeHead(200);
    res.end(
      JSON.stringify({
        product,
        sum,
      }),
    );
  });
}).listen(8000, () => console.log("Server started"));
