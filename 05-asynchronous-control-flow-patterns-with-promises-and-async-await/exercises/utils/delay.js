export function delay(value, n) {
  return new Promise((resolve) => setTimeout(() => resolve(value), n));
}
