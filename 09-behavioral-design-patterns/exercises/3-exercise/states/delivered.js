export class DeliveredState {
  #item;
  constructor(item) {
    this.#item = item;
  }
  activate(address) {
    this.#item.address = address;
  }
  store() {
    throw new Error(
      `Item can't be put back to store while it is already delivered`,
    );
  }
  deliver() {
    throw new Error(`Item is already delivered to ${this.#item.address}`);
  }
  describe() {
    return `Item ${this.#item.id} was delivered to ${this.#item.address}`;
  }
}
