import { openDB, deleteDB } from "idb";
import Event from "../../util/events.js";

class PersistentMap extends Map {
  constructor(name, db) {
    super();
    this.name = name;
    this._db = db;
  }
  
  async fetch(key) {
    return super.get(key) ?? await this._db.get(this.name, key);
  }
  
  async all() {
    return (await this._db.all(this.name)).map(i => i);
  }
  
  async put(key, val) {
    super.set(key, val);
    await this._db.put(this.name, val, key);
  }  
}

class Events extends PersistentMap {
  async fetch(room, eventId) {
    if (this.has(eventId)) return this.get(eventId);
    // const fromDb = await this._db.get(this.name, eventId);
    const event = new Event(room, (await state.api.fetchEvent(room.roomId, eventId)));
    // const event = new Event(room, (await this._db.get(this.name, eventId) ?? await state.api.fetchEvent(room.roomId, eventId)));
    this.set(eventId, event);
    return event;
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
    this.events = new Events("events", db);
    this.account = new PersistentMap("account", db);
    this.rooms = new PersistentMap("rooms", db);
    this.sync = new PersistentMap("sync", db);
    this.users = new PersistentMap("users", db);
  }
  
  async purge() {
    this._db.close();
    await deleteDB("discard");
  }
  
  save(state) {
    for (let [key, val] of state.accountDataRef) this.account.put(key, val);
    for (let [id, room] of state.rooms) this.rooms.put(id, {
      state: room.state,
      roomId: room.roomId,
      accountData: [...room.accountData.entries()],
      notifications: room.notifications,
    });
    // for (let [id, event] of state.events) this.events.put(id, {
    //   roomId: event.roomId,
    //   raw: event.raw,
    //   relations: event.relations,
    // });
    state.log.matrix("persisting state");
  }
  
  load(state) {
    
  }
}
