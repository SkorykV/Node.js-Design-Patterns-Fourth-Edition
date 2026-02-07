import { CancelError } from "./cancelError.js";

export function createAsyncCancelable(generatorFunction) {
  return function asyncCancelable(...args) {
    const generatorObject = generatorFunction(...args);
    let cancelRequested = false;
    const nestedCancelables = [];

    function cancel() {
      console.log("cancel requested");
      cancelRequested = true;
      for (const nestedCancel of nestedCancelables) {
        nestedCancel();
      }
    }

    const promise = new Promise((resolve, reject) => {
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
      async function nextStep(prevResult) {
        if (cancelRequested) {
          return reject(new CancelError());
        }

        if (prevResult.done) {
          return resolve(prevResult.value);
        }

        const stepResult = prevResult.value;

        try {
          let valueToAwait = stepResult;

          if (
            stepResult &&
            typeof stepResult === "object" &&
            "promise" in stepResult &&
            "cancel" in stepResult
          ) {
            nestedCancelables.push(stepResult.cancel);
            valueToAwait = stepResult.promise;
          }

          const result = await valueToAwait;
          if (cancelRequested) {
            return reject(new CancelError());
          }
          console.log("go to next step", cancelRequested);
          nextStep(generatorObject.next(result));
        } catch (err) {
          try {
            nextStep(generatorObject.throw(err));
          } catch (err2) {
            reject(err2);
          }
        }
      }

      nextStep({});
    });

    return { promise, cancel };
  };
}
