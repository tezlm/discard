/*
syncer statuses
- "stopped": the syncer isn't doing anything
- "starting": the syncer is doing an initial sync
- "syncing": the syncer is active and polling for events
- "restarting": the syncer is starting again after a stop

events:
- "timeline": a new timeline event
- "ephermeral": a new ephermeral event
- "state": a state change
- "join": when a room is joined
- "leave": when a room is left
- "invite": when room invite is sent
*/

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
    const wrapped = (...params) => { call(...params); this.off(wrapped) };
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

export default class Syncer extends Emitter {
  constructor(api) {
    super();
    this.api = api;
    this.status = "stopped";
    this._backoff = 1;
    this._controller = new AbortController();
    this._rooms = new Set();
  }
  
  _error(err) {
    if (err === "M_UNKNOWN_TOKEN") {
      actions.client.logout();
      this.status = "stopped";
      return null;
    } else {
      console.error(err);
      this.status = "stopped";
      // setTimeout(() => {});
      return null;
    }    
  }  
  
  async _loop(since) {
    const sync = await this.api.sync(since, this._controller.signal).catch((err) => this._error(err));
    if (!sync) return;
    if (sync.error) return this._error(sync.errcode);
    
    this._process(sync);
    
    if (this.status === "starting") {
      this.status = "syncing";
      state.log.matrix("ready");
      actions.rooms.update();
      actions.spaces.update();
      state.scene.set("chat");
    } else if (this.status === "restarting") {
      this.status = "syncing";
      this._backoff = 1;
    }
    
    this._loop(sync.next_batch);
  }
  
  _process(sync) {
    const { account_data, rooms, to_device } = sync;
    
    for (let roomId in rooms?.join ?? {}) {
      const room = rooms.join[roomId];      
    
      if (this._rooms.has(roomId)) {
        for (let event of room.state?.events ?? []) this.emit("state", roomId, event);
      } else {
        this._rooms.add(roomId);
        this.emit("join", roomId, room.state?.events ?? [], room.timeline.prev_batch);
      }

      for (let event of room.timeline?.events ?? []) {
        this.emit("timeline", roomId, event);
        if (typeof event.state_key !== "undefined") this.emit("state", roomId, event);
      }
      
      for (let event of room.account_data?.events ?? []) this.emit("roomAccountData", roomId, event);
      // for (let event of room.ephemeral?.events ?? []) this.emit("ephermeral", roomId, event);
      for (let event of room.ephemeral?.events ?? []) actions.parser.handleEphermeral(roomId, event.type, event.content);
      if  (room.unread_notifications) actions.parser.handleNotis(roomId, room.unread_notifications);
      // if  (room.unread_notifications) this.emit("unread", roomId, room.unread_notifications);
    }
    
    // TODO: invited rooms
    for (let room in rooms?.invite ?? {}) {
      this._rooms.add(room);
      this.emit("invite", room, rooms.invite[room].invite_state.events);
    }
    
    for (let room in rooms?.leave ?? {}) {
      this.emit("leave", room);
      this._rooms.delete(room);
    }
    
    for (let event of account_data?.events ?? []) {
      this.emit("accountData", event);
    }
    
    for (let event of to_device?.events ?? []) {
      this.emit("toDevice", event);
    }
  }
  
  start(since) {
    this.status = "starting";
    this._loop(since);
  }
  
  stop() {
    this._controller.abort();
  }
}
