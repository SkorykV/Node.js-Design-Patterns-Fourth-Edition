export function sequentialExecution(tasks, finish) {
  const iterate = (results, index) => {
    if (index === tasks.length) {
      return finish(null, results);
    }
    const task = tasks[index];
    task(results, (error, result) => {
      if (error) {
        return finish(error);
      }
      iterate([...results, result], index + 1);
    });
  };
  iterate([], 0);
}
