import MemberCache from "../client/matrix/members.js";

// this is just a 1:1 mapping of createRoom for now
export class Room {
  name = null;
  topic = null;
  avatar = null;
  type = "space";
  
  constructor(roomId, state) {
    this.roomId = roomId;
    this.state = [];
    this.accountData = new Map();
    this.members = new MemberCache(this);    
    this.notifications = { pings: 0, unread: 0 }; // i would love to use the notification count more, but need both private read receipts to work and to be able to move read marker backwards
    // this.timelineSet = ...; // TODO: maybe?
        
    for (let event of state) this.handleState(event);
    
    this._powerCache = null;
  }
  
  handleState(event, skipCheck = false) {
    if (!skipCheck || true) {
      const oldIdx = this.state.findIndex(i => i.type === event.type && i.stateKey === event.stateKey);
      if (oldIdx !== -1) this.state.splice(oldIdx, 1);
    }
    
    switch (event.type) {
      case "m.room.name":   this.name = event.content.name   ?? null; break;
      case "m.room.topic":  this.topic = event.content.topic ?? null; break;
      case "m.room.avatar": this.avatar= event.content.url   ?? null; break;
      case "m.room.create": this.type = event.content.type === "m.space" ? "space" : "room"; break; // TODO: replace space/room with matrix types
      case "m.room.member": this.members.handle(event); break;
      case "m.room.power_levels": this._powerCache = null;
    }
    
    this.state.push(event);
  }
  
  getState(type, key = "") {
    return this.state.find(i => i.type === type && i.stateKey === key);
  }
  
  getAllState(type) {
    return this.state.filter(i => i.type === type);
  }
  
  // TODO
  // async sendState(type, key, content) {}
  // async sendEvent(type, content, txnid) {}
  
  get tombstone() { return this.getState("m.room.tombstone")?.content }
  get joinRule()  { return this.getState("m.room.join_rules")?.content?.join_rule }
  
  get power() {
    if (this._powerCache) return this._powerCache;
    const power = this.getState("m.room.power_levels")?.content ?? { state_default: 50, users_default: 50 };
    power.me = power.users?.[state.userId] ?? power.users_default ?? 0;
    this._powerCache = {
      ...power,
      getBase:  (name) => power[name]  ?? power.state_default  ?? 50,
      getEvent: (name) => power.events?.[name] ?? power.events_default ?? 0,
      getState: (name) => power.state?.[name]  ?? power.state_default  ?? 50,
      getUser:  (id)   => power.users?.[id]    ?? power.users_default  ?? 0,
    }
    return this._powerCache;
  }
  
  get readEvent() {
    return this.accountData?.get("m.fully_read")?.event_id ?? null;
  }
  
  // use this instead?
  get id() {
    return this.roomId;
  }
}
