import { asyncRoutine } from "./asyncRoutine.js";
import { CancelError } from "./cancelError.js";
import { createAsyncCancelable } from "./createAsyncCancelable.js";

const innerCancelable = createAsyncCancelable(function* () {
  const resA = yield asyncRoutine("B1");
  console.log(resA);
  const resB = yield asyncRoutine("B2");
  console.log(resB);
  const resC = yield asyncRoutine("B3");
  console.log(resC);
});

const cancelable = createAsyncCancelable(function* () {
  const resA = yield asyncRoutine("A");
  console.log(resA);
  const innerCancelableObj = innerCancelable();
  // setTimeout(innerCancelableObj.cancel, 100);
  yield innerCancelableObj;
  // try {
  //   yield innerCancelableObj;
  // } catch (error) {
  //   if (error instanceof CancelError) {
  //     console.log("Inner Function canceled");
  //     yield;
  //   } else {
  //     console.error(error);
  //     throw error;
  //   }
  // }
  const resC = yield asyncRoutine("C");
  console.log(resC);
});

const { promise, cancel } = cancelable();
setTimeout(cancel, 2050);

try {
  await promise;
} catch (err) {
  if (err instanceof CancelError) {
    console.log("Function canceled");
  } else {
    console.error(err);
  }
}
