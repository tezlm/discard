export default class Syncer {
  constructor(api) {
    this.api = api;
    this.status = "stopped";
    this._controller = new AbortController();
    this._rooms = new Set();
  }
  
  // TODO: retry requests handler
  _error(err) {
    state.log.error(err);
    this.status = "stopped";
    return null;
  }
  
  async _loop(since) {
    const sync = await this.api.sync(since, this._controller.signal).catch((err) => this._error(err));
    if (!sync) return;
    if (sync.error) return this._error();
    const { account_data, rooms } = sync;
    
    for (let roomId in rooms?.join ?? {}) {
      const room = rooms.join[roomId];
      
      // if (!this.rooms.has(roomId)) {
      //   this.rooms.set(roomId, { state: [], accountData: new Map() });
      // }

      for (let event of room.state?.events ?? []) actions.parser.handleState(roomId, event, room.timeline.prev_batch);
      for (let event of room.timeline?.events ?? []) actions.parser.handleEvent(roomId, event);
      for (let event of room.ephemeral?.events ?? []) actions.parser.handleEphermeral(roomId, event.type, event.content);
      for (let event of room.account_data?.events ?? []) actions.parser.handleRoomAccount(roomId, event.type, event.content);
      if  (room.unread_notifications) actions.parser.handleNotis(roomId, room.unread_notifications?.highlight_count);
    }
    
    // TODO: invited rooms
    // for (let room in rooms?.invite ?? {}) {
    //   console.log(rooms.invite[room])
    // }
    
    for (let room in rooms?.leave ?? {}) {
      actions.parser.handleLeave(room);
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
