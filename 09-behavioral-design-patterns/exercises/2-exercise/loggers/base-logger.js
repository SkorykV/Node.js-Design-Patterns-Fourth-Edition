export class BaseLogger {
  async info(message) {
    const preparedMessage = `[INFO] ${message}`;
    await this.log(preparedMessage);
  }
  async debug(message) {
    const preparedMessage = `[DEBUG] ${message}`;
    await this.log(preparedMessage);
  }
  async warn(message) {
    const preparedMessage = `[WARN] ${message}`;
    await this.log(preparedMessage);
  }
  async error(message) {
    const preparedMessage = `[ERROR] ${message}`;
    await this.log(preparedMessage);
  }
  async log(message) {
    throw new Error("Method 'log()' must be implemented.");
  }
  async destroy() {
    throw new Error("Method 'destroy()' must be implemented.");
  }
}
