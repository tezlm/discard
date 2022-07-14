export default class Syncer {
  constructor(api) {
    this.api = api;
    this.status = "stopped";
    this._controller = new AbortController();
    this._rooms = new Set();
  }
  
  _error() {
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
      
      for (let event of room.timeline?.events ?? []) actions.timeline.handleEvent(roomId, event);
      for (let event of room.ephermeral?.events ?? []) actions.timeline.handleEphermeral(roomId, event);
      for (let event of room.state?.events ?? []) actions.timeline.handleState(roomId, event, room.timeline.prev_batch);
    }
    
    // TODO: invited rooms
    // for (let room in rooms?.invite ?? {}) {
    //   console.log(rooms.invite[room])
    // }
    
    for (let { type, content } of account_data?.events ?? []) {
      // this.account.set(type, content);
    }
    
    if (this.status === "starting") {
      this.status = "syncing";
      state.scene.set("chat");
      // this.emit("ready");
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
