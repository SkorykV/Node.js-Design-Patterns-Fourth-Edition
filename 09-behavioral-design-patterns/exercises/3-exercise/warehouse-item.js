import { ArrivingState, DeliveredState, StoredState } from "./states/index.js";

export class WarehouseItem {
  id;
  #currentState;
  constructor(...args) {
    const [id, state, ...stateParams] = args;
    this.id = id;
    this.states = {
      arriving: new ArrivingState(this),
      stored: new StoredState(this),
      delivered: new DeliveredState(this),
    };
    this.changeState(state, ...stateParams);
  }
  changeState(...args) {
    const [stateName, ...stateParams] = args;
    const state = this.states[stateName];
    this.#currentState = state;
    state.activate(...stateParams);
  }
  store(locationId) {
    this.#currentState.store(locationId);
  }
  deliver(address) {
    this.#currentState.deliver(address);
  }
  describe() {
    return this.#currentState.describe();
  }
}
