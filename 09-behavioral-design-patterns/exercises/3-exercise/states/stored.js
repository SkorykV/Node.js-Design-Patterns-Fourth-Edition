export class StoredState {
  #item;
  constructor(item) {
    this.#item = item;
  }
  activate(locationId) {
    this.#item.locationId = locationId;
  }
  store() {
    throw new Error(`Item is already stored in ${this.#item.locationId}`);
  }
  deliver(address) {
    this.#item.locationId = undefined;
    this.#item.changeState("delivered", address);
  }
  describe() {
    return `Item ${this.#item.id} is stored in location ${this.#item.locationId}`;
  }
}
