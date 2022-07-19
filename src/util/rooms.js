import MemberCache from "../client/matrix/members.js";

export function formatRoom(roomId, stateEvents, accountData) {
  const memberCache = new MemberCache(roomId, getPower);
  const getState = (event) => stateEvents.find(i => i.type === event)?.content;
  
  function getType() {
    // if (room.getMyMembership() === "invite") return "invite";
    if (getState("m.room.create")?.type === "m.space") return "space";
    // TODO: dm room
    return "room";
  }
  
  function getPower() {
    const power = getState("m.room.power_levels") ?? { state_default: 0 };
    power.me = power.users?.[state.userId] ?? power.users_default ?? 0;
    return {
      ...power,
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
    typing:     [],
    pings:      0,
    readEvent:  accountData?.get("m.fully_read")?.event_id ?? null,
    state:      stateEvents,
  }
}
