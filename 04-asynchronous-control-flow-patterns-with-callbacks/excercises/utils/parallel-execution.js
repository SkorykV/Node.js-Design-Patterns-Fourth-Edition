export function parallelExecution(tasks, finishCb) {
  let finishedTasksCount = 0;
  let hasFailed = false;
  const results = Array.from({ length: tasks.length });
  if (!tasks.length) {
    return finishCb(null, []);
  }
  for (let i = 0; i < tasks.length; i++) {
    tasks[i]((err, result) => {
      if (hasFailed) {
        return;
      }
      if (err) {
        hasFailed = true;
        return finishCb(err);
      }
      results[i] = result;
      if (++finishedTasksCount === tasks.length) {
        finishCb(null, results);
      }
    });
  }
}
