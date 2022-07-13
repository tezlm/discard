import { openDB } from  "idb"; // TODO: save sync

class Emitter {
	constructor() {
		this._listeners = new Map();
	}
	
	on(event, call) {
		this._listeners.set(call, event);
	}
	
	off(call) {
		this._listeners.delete(call);
	}

	once(event, call) {
		const wrapped = (...params) => { call(...params); this.off(wrapped) }
		this._listeners.set(wrapped, event);
	}
	
	emit(event, ...params) {
		for (let listener of this._listeners) {
			if (listener[1] === event) {
				listener[0](...params);
			}
		}
	}
}

class RoomData {
  
}

export default class Syncer extends Emitter {
  constructor(api) {
    super();
    
    this.api = api;
    this.status = "stopped";
    this._controller = new AbortController();
    
    // TODO: persist state
    this._db = openDB("discard", 1, {
      upgrade(db) {
        db.createObjectStore("rooms");
        db.createObjectStore("members");
        db.createObjectStore("account");
      }
    });
    
    this.rooms = new Map();
    this.members = new Map();
    this.account = new Map();
  }
  
  _error() {
    this.status = "stopped";
    return null;
  }
  
  async _loop(since) {
    const sync = await this.api.sync(since, this._controller.signal).catch((err) => this._error(err));
    if (!sync) return;
    if (sync.error) return this._error();
    console.log(sync)
    const { account_data, rooms } = sync;
    
    for (let roomId in rooms?.join ?? {}) {
      if (!this.rooms.has(roomId)) this.rooms.set(roomId, { state: [], accountData: new Map() });
      const room = rooms.join[roomId];
      for (let event of room.timeline?.events ?? []) this.emit("timeline", event);
      for (let event of room.ephermeral?.events ?? []) this.emit("ephermeral", event);
      for (let event of room.state?.events ?? []) this.emit("state", event);
    }
    
    // TODO: invited rooms
    // for (let room in rooms?.invite ?? {}) {
    //   console.log(rooms.invite[room])
    // }
    
    for (let { type, content } of account_data?.events ?? []) {
      this.account.set(type, content);
    }
    
    if (this.status === "starting") {
      this.status = "syncing";
      this.emit("ready");
    }
    this._loop(sync.next_batch);
  }
  
  start(since) {
    this.status = "starting";
    this._loop(since);    
  }
  
  stop() {
    this._controller.abort();
    throw "TODO";
  }
}
