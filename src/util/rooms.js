import MemberCache from "../client/matrix/members.js";

// this is just a 1:1 mapping of createRoom for now
export class Room {  
  constructor(roomId, state) {
    this.roomId = roomId;
    this.state = [];
    this.accountData = new Map();
    this.members = new MemberCache(this);    
    this.notifications = { pings: 0, unread: 0 }; // i would love to use the notification count more, but need both private read receipts to work and to be able to move read marker backwards
    // this.timelineSet = ...; // TODO: maybe?
    
    for (let event of state) this.handleState(event);    
  }
  
  handleState(event, skipCheck = false) {
    if (!skipCheck) {
      const oldIdx = this.state.findIndex(i => i.type === event.type && i.state_key === event.state_key);
      if (oldIdx !== -1) this.state.splice(oldIdx, 1);      
    }
    if (event.type === "m.room.member") this.members.handle(event);
    this.state.push(event);
  }
  
  getState(type, key = "") {
    return this.state.find(i => i.type === type && i.state_key === key);
  }
  
  // TODO
  // async sendState(type, key, content) {}
  // async sendEvent(type, content, txnid) {}
  
  get name()      { return this.getState("m.room.name")?.content?.name ?? "unknown room" }
  get topic()     { return this.getState("m.room.topic")?.content?.topic }
  get avatar()    { return this.getState("m.room.avatar")?.content?.url }
  get tombstone() { return this.getState("m.room.tombstone")?.content }
  get joinRule()  { return this.getState("m.room.join_rules")?.content?.join_rule }
  get type()      { return this.getState("m.room.create")?.content?.type === "m.space" ? "space" : "room" }
  
  get power() {
    const power = this.getState("m.room.power_levels")?.content ?? { state_default: 50, users_default: 50 };
    power.me = power.users?.[state.userId] ?? power.users_default ?? 0;
    return {
      ...power,
      getBase:  (name) => power[name]  ?? power.state_default  ?? 50,
      getEvent: (name) => power.events?.[name] ?? power.events_default ?? 0,
      getState: (name) => power.state?.[name]  ?? power.state_default  ?? 50,
      getUser:  (id)   => power.users?.[id]    ?? power.users_default  ?? 0,
    }
  }
  
  get readEvent() {
    return this.accountData?.get("m.fully_read")?.event_id ?? null;
  }
  
  // use this instead?
  get id() {
    return this.roomId;
  }
}
