export class LoggerMiddlewareManager {
  #middlewares;
  #logger;
  constructor(logger) {
    this.#middlewares = [];
    this.#logger = logger;
  }

  use(middleware) {
    this.#middlewares.push(middleware);
    return this;
  }

  async log(initialMessage) {
    const message = await this.#executeMiddlewares(initialMessage);
    this.#logger.log(message);
  }

  async #executeMiddlewares(initialMessage) {
    let message = initialMessage;
    for (const middleware of this.#middlewares) {
      message = await middleware.call(this, message);
    }
    return message;
  }
}
