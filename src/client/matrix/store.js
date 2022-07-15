import { openDB, deleteDB } from "idb";
import { format } from "./events.js";

// TODO: persist?
class Events extends Map {
  async fetch(roomId, eventId) {
    if (this.has(eventId)) return this.get(eventId);
    const event = format(roomId, await state.api.fetchEvent(roomId, eventId));
    this.set(eventId, event);
    return event;
  }
}

class PersistentMap extends Map {
  constructor(name, db) {
    super();
    this.name = name;
    this._db = db;
  }
  
  async get(key) {
    return super.get(key) ?? JSON.parse(await this._db.get(this.name, key));
  }
  
  async all() {
    return (await this._db.all(this.name)).map(i => JSON.parse(i));
  }
  
  async set(key, val) {
    super.set(key, val);
    await this._db.put(this.name, JSON.stringify(val), key);
  }
}

export default class Store {
  async init() {
    const db = await openDB("discard", 1, {
      upgrade(db) {
        db.createObjectStore("account");
        db.createObjectStore("events");
        db.createObjectStore("rooms");
        db.createObjectStore("users");
        db.createObjectStore("sync");
      },
    });
    
    this._db = db;
    this.events = new Events();
    this.account = new PersistentMap("account", db);
    this.rooms = new PersistentMap("rooms", db);
    this.sync = new PersistentMap("sync", db);
    this.users= new PersistentMap("users", db);
  }
  
  async purge() {
    this._db.close();
    await deleteDB("discard");
  }
}
