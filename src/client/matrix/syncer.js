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
    this._controller = new AbortController();
    this._rooms = new Set();
  }
  
  // TODO: retry requests handler
  _error(err) {
    if (err === "M_UNKNOWN_TOKEN") {
      actions.client.logout();
    } else {    
      console.error(err);
    }
    this.status = "stopped";
    return null;
  }
  
  async _loop(since) {
    const sync = await this.api.sync(since, this._controller.signal).catch((err) => this._error(err));
    if (!sync) return;
    if (sync.error) return this._error(sync.errcode);
    const { account_data, rooms } = sync;
    
    for (let roomId in rooms?.join ?? {}) {
      const room = rooms.join[roomId];      

      for (let event of room.ephemeral?.events ?? []) actions.parser.handleEphermeral(roomId, event.type, event.content);
      for (let event of room.account_data?.events ?? []) actions.parser.handleRoomAccount(roomId, event.type, event.content);
      if  (room.unread_notifications) actions.parser.handleNotis(roomId, room.unread_notifications?.highlight_count);
    
      if (this._rooms.has(roomId)) {
        for (let event of room.state?.events ?? []) this.emit("state", roomId, event);
      } else {
        this._rooms.add(roomId);
        this.emit("join", roomId, room.state?.events ?? [], room.timeline.prev_batch);
      }
      
      for (let event of room.timeline?.events ?? []) this.emit("timeline", roomId, event);
      for (let event of room.ephemeral?.events ?? []) this.emit("ephermeral", roomId, event);
      for (let event of room.account_data?.events ?? []) this.emit("roomAccountData", roomId, event);
      if  (room.unread_notifications) this.emit("unread", roomId, room.unread_notifications);
    }
    
    // TODO: invited rooms
    for (let room in rooms?.invite ?? {}) {
      this._rooms.add(room);
      this.emit("invite", room, rooms.invite[room].invite_state.events);
    }
    
    for (let room in rooms?.leave ?? {}) {
      actions.parser.handleLeave(room);
      this.emit("leave", room);
      this._rooms.delete(room);
    }
    
    for (let event of account_data?.events ?? []) {
      actions.parser.handleAccount(event.type, event.content);
    }
    
    if (this.status === "starting") {
      this.status = "syncing";
      state.log.matrix("ready");
      actions.rooms.update();
      actions.spaces.update();
      state.scene.set("chat");
    }
    this._loop(sync.next_batch);
  }
  
  start(since) {
    this.status = "starting";
    this._loop(since);
  }
  
  stop() {
    this._controller.abort();
  }
}
