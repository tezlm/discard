import { openDB, deleteDB } from "idb";

export class Store {
  async get(store, key) {
    return JSON.parse(await this._db.get(store, key));
  }
  
  async all(store) {
    const [keys, vals] = await Promise.all([
      this._db.getAll(store),
      this._db.getAllKeys(store),
    ]);
    
    const map = new Map();
    for (let i = 0; i < keys.length; i++) {
      map.set(keys[i], JSON.parse(vals[i]));
    }
    
    return map;
  }
  
  async set(store, key, val) {
    await this._db.put(store, key, JSON.stringify(val));
  }
    
  async open() {
    this._db = await openDB("discard", 1, {
      upgrade(db) {
        db.createObjectStore("account");
        db.createObjectStore("sync");
        db.createObjectStore("rooms");
        db.createObjectStore("users");
      },
    });
  }
  
  async purge() {
    this._db.close();
    await deleteDB("discard");
  }
}
