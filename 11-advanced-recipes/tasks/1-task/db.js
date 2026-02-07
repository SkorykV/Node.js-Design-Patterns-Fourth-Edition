import EventEmitter from "node:events";
import { setTimeout } from "node:timers/promises";

class Database extends EventEmitter {
  connected = false;
  #pendingConnection = null;
  commandsQueue = [];

  async connect() {
    console.log("Attempting to connect to the database...");
    if (!this.connected) {
      if (this.#pendingConnection) {
        return this.#pendingConnection;
      }
      // simulate the delay of the connection
      this.#pendingConnection = setTimeout(500);
      await this.#pendingConnection;
      this.connected = true;
      this.#pendingConnection = null;
      this.emit("initialized");
    }
  }

  async query(queryString) {
    // simulate the delay of the query execution
    await setTimeout(100);
    console.log(`Query executed: ${queryString}`);
  }
}

export const db = new Database();
