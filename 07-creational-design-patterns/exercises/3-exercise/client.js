const tasks = Array.from({ length: 10 }).map((_, i) => ({ data: i + 1 }));

await fetch("http://localhost:3000", {
  method: "POST",
  body: JSON.stringify({ tasks }),
});
