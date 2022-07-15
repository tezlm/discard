import TimelineSet from "../matrix/timeline.js";

const rooms = new Map();
const batches = new Map();

class MemberCache extends Map {
  constructor(roomId, getPower) {
    super();
    this.roomId = roomId;
    this.fetched = false;
    this._getPower = () => getPower();
  }
  
  add(event) {
    const id = event.state_key;
    const cont = event.content;
    const power = this._getPower();
    this.set(id, {
      userId: id,
      roomId: this.roomId,
      name: cont.displayname ?? id,
      avatar: cont.avatar_url ?? null,
      power: power.users?.[id] ?? power.users_default ?? 0,
      membership: cont.membership,
      reason: cont.reason ?? null,
      date: new Date(event.origin_server_ts),
    });
  }
  
  async fetch() {
    if (this.fetched) return;
    this.fetched = true;
    state.log.matrix("fetch members");
    const { chunk } = await state.api.fetchMembers(this.roomId);
    for (let i of chunk) this.add(i);
  }
  
  with(membership) {
    const cmp = (a, b) => a > b ? 1 : a < b ? -1 : 0;
    return [...this.values()]
      .filter(i => i.membership === membership)
      .sort((a, b) => cmp(a.name, b.name))
      .sort((a, b) => cmp(b.power, a.power));
  }
}

function formatRoom(roomId, room, batch) {
  const memberCache = new MemberCache(roomId, getPower);
  const getState = (event) => room.find(i => i.type === event)?.content;
  
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
  
  for (let event of room.filter(i => i.type === "m.room.member")) memberCache.add(event);
  
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
    timelines:  new TimelineSet(roomId, batch),
    
    hasUserReadEvent: (user, ev) => true, // TODO: fix
  }
}

export function save() {
  for (let [id, data] of rooms) {
    state.store.rooms.set(id, data);
  }
}

export function load() {
  // console.log(state.store.rooms.all(id));
  // .then(state => rooms.set(id, state));
  // state.store
}

export function handleJoin(roomId, event, batch) {
  if (!rooms.has(roomId)) rooms.set(roomId, []);
  if (!batches.has(roomId)) batches.set(roomId, batch);
  const roomState = rooms.get(roomId);
  const index = roomState.findIndex(i => i.type === event.type && i.state_key === event.state_key);
  if (index >= 0) {
    roomState[index] = event;
  } else {
    roomState.push(event);
  }
}

export function handleInvite(roomId, event) {
  
}

export function handleLeave(roomId) {
  rooms.delete(roomId);
}

export function update() {
  const joinedRooms = new Map();

  for (let [id, data] of rooms.entries()) {
    joinedRooms.set(id, formatRoom(id, data, batches.get(id)));
  }

  // TODO: dms

  const spaces = new Map();
  const inSpaces = new Set();
  for (let [id, room] of joinedRooms) {
    if (room.type !== "space") continue;
    const children = rooms.get(room.roomId)
      .filter(i => i.type === "m.space.child")
      .filter(i => joinedRooms.has(i.state_key))
      .map(i => joinedRooms.get(i.state_key));
    children.forEach(i => inSpaces.add(i.roomId));
    spaces.set(id, children);
  }
  
  const orphans = [...joinedRooms.values()].filter(i => !inSpaces.has(i.roomId));
  spaces.set("orphanRooms",  orphans.filter(i => i.type !== "space"));
  spaces.set("orphanSpaces", orphans.filter(i => i.type === "space"));
  
  state.rooms.set(joinedRooms);
  state.spaces.set(spaces);
}
