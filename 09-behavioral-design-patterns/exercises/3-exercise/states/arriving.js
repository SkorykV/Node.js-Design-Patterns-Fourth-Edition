export class ArrivingState {
  #item;
  constructor(item) {
    this.#item = item;
  }
  activate() {}
  store(locationId) {
    this.#item.changeState("stored", locationId);
  }
  deliver() {
    throw new Error("Item should be stored before it could be delivered");
  }
  describe() {
    return `Item ${this.#item.id} is on its way to the warehouse`;
  }
}
