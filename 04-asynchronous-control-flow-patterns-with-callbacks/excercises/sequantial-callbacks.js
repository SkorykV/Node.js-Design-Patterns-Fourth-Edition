function executeSequentially(args, func, cb) {
  const tasks = args.map((arg, i) => {
    return (prevData) => {
      func(arg, prevData, (err, data) => {
        if (err) {
          return cb(err);
        }
        if (i === args.length - 1) {
          return cb(data);
        }
        tasks[i + 1](data);
      });
    };
  });
  tasks[0]();
}

executeSequentially(
  [100, 1000, 2000, 500],
  (time, acc, cb) => {
    setTimeout(() => cb(null, acc ? acc + time : time), time);
  },
  (err, data) => {
    if (err) {
      console.log("finished with error", err);
      return;
    }
    console.log("Total timeout", data);
  }
);
