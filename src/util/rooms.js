import MemberCache from "../client/matrix/members.js";

// export function formatRoom(roomId, stateEvents, accountData, isInvite = false) {
export function formatRoom(roomId, stateEvents, accountData) {
  const memberCache = new MemberCache(roomId, getPower);
  const getState = (event) => stateEvents.find(i => i.type === event)?.content;
  
  function getType() {
    // if (isInvite) return "invite";
    // if (room.getMyMembership() === "invite") return "invite";
    if (getState("m.room.create")?.type === "m.space") return "space";
    // TODO: dm room
    return "room";
  }
  
  function getPower() {
    const power = getState("m.room.power_levels") ?? {};
    return {
      ...power,
      me: power.users?.[state.userId] ?? power.users_default ?? 0,
      getBase:  (name) => power?.[name]  ?? power.state_default  ?? 50,
      getEvent: (name) => power.events?.[name] ?? power.events_default ?? 0,
      getState: (name) => power.state?.[name]  ?? power.state_default  ?? 50,
      getUser:  (id)   => power.users?.[id]    ?? power.users_default  ?? 0,
    }
  }
  
  for (let event of stateEvents.filter(i => i.type === "m.room.member")) memberCache.add(event);
  
  return {
    roomId:     roomId,
    name:       getState("m.room.name")?.name ?? "unknown room",
    topic:      getState("m.room.topic")?.topic ?? null,
    avatar:     getState("m.room.avatar")?.url,
    tombstone:  getState("m.room.tombstone") ?? null,
    joinRule:   getState("m.room.join_rules")?.join_rule,
    type:       getType(),
    power:      getPower(),
    members:    memberCache,
    pings:      0,
    readEvent:  accountData?.get("m.fully_read")?.event_id ?? null,
    state:      stateEvents,
  }
}

// this is just a 1:1 mapping of createRoom for now
class Room {
  roomId = null;
  state = [];
  members = null;
  pings = 0;
  
  constructor(roomId, state, accountData) {
    this.roomId = roomId;
    this.members = new MemberCache(roomId, getPower);
    for (let event of state) this._handleState(event);
    this.readEvent = accountData?.get("m.fully_read")?.event_id ?? null;
  }
  
  _handleState(event) {
    const oldIdx = this.state.findIndex(i => i.type === event.type && i.state_key === event.state_key);
    if (oldIdx !== -1) this.state.splice(oldIdx, 1);
    this.state.push(event);
  }
  
  // NO
  state(type, key = "") {
    return this.state.find(i => i.type === type && i.state_key === key);
  }
  
  get name()      { return this.state("m.room.name")?.name ?? "unknown room" }
  get topic()     { return this.state("m.room.topic")?.topic }
  get avatar()    { return this.state("m.room.avatar")?.url }
  get tombstone() { return this.state("m.room.tombstone") }
  get joinRule()  { return this.state("m.room.join_rules")?.join_rule }
  get type()      { return this.state("m.room.create")?.type === "m.space" ? "space" : "room" }
  
  get power() {
    const power = this.state("m.room.power_levels") ?? { state_default: 50, users_default: 50 };
    power.me = power.users?.[state.userId] ?? power.users_default ?? 0;
    return {
      ...power,
      getBase:  (name) => power[name]  ?? power.state_default  ?? 50,
      getEvent: (name) => power.events?.[name] ?? power.events_default ?? 0,
      getState: (name) => power.state?.[name]  ?? power.state_default  ?? 50,
      getUser:  (id)   => power.users?.[id]    ?? power.users_default  ?? 0,
    }
  }
}
