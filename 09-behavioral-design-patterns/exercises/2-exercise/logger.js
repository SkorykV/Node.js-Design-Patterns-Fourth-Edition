export class Logger {
  constructor(loggingStrategy) {
    this.loggingStrategy = loggingStrategy;
  }
  async info(message) {
    const preparedMessage = `[INFO] ${message}`;
    await this.loggingStrategy.log(preparedMessage);
  }
  async debug(message) {
    const preparedMessage = `[DEBUG] ${message}`;
    await this.loggingStrategy.log(preparedMessage);
  }
  async warn(message) {
    const preparedMessage = `[WARN] ${message}`;
    await this.loggingStrategy.log(preparedMessage);
  }
  async error(message) {
    const preparedMessage = `[ERROR] ${message}`;
    await this.loggingStrategy.log(preparedMessage);
  }
  async destroy() {
    await this.loggingStrategy.destroy();
  }
}
