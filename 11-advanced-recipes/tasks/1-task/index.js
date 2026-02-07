import { setTimeout } from "node:timers/promises";
import { withInitHandling } from "./wrapper.js";
import { db } from "./db.js";

export const dbProxy = withInitHandling(db, ["query"]);
dbProxy.connect();
async function updateLastAccess() {
  await dbProxy.query(`INSERT (${Date.now()}) INTO "LastAccesses"`);
}

updateLastAccess();
await setTimeout(600);
updateLastAccess();
