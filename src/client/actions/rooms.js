import { get } from "svelte/store";
import TimelineSet from "../matrix/timeline.js";

const rooms = new Map(); // TODO: store object instead of just Array<stateEvent>
const accountData = new Map();

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

function formatRoom(roomId, room) {
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
    typing:     [],
    pings:      0,
    readEvent:  accountData.get(roomId)?.get("m.fully_read")?.event_id ?? null,
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

// TODO: cleanup, set directly on room
export function handleAccount(roomId, type, content) {
  state.log.debug(`set ${type} to ${JSON.stringify(content)} in ${roomId}`);
  if (!accountData.has(roomId)) accountData.set(roomId, new Map());
  accountData.get(roomId).set(type, content);

  if (type === "m.fully_read") {
    const room = state.rooms.get(roomId);
    if (room) {
      room.readEvent === content.event_id;
      
      // TODO: optimize instead of recalculating everything?
      update();
      const space = get(state.focusedSpace)?.roomId ?? "orphanRooms";
      state.navRooms.set(state.spaces.get(space));
      state.slice.set(state.roomSlices.get(roomId));
    }
  }
}

export function handleJoin(roomId, event, batch) {
  const isNew = !rooms.has(roomId);
  if (isNew) rooms.set(roomId, []);
  if (!state.roomTimelines.has(roomId)) state.roomTimelines.set(roomId, new TimelineSet(roomId, batch));
  const roomState = rooms.get(roomId);
  const index = roomState.findIndex(i => i.type === event.type && i.state_key === event.state_key);
  if (index >= 0) {
    roomState[index] = event;
  } else {
    roomState.push(event);
  }
  update();
}

export function handleInvite(roomId, event) {
  // TODO: invited rooms
}

export function handleLeave(roomId) {
  const space = get(state.focusedSpace)?.roomId;
  if (roomId === space) {
    state.focusedSpace.set(null);
    state.focusedRoomId = null;
    state.focusedRoom.set(null);
  }
  if (roomId === state.focusedRoomId) {
    state.focusedRoomId = null;
    state.focusedRoom.set(null);
  }
  rooms.delete(roomId);
  state.rooms.delete(roomId);
  update();
  state.navRooms.set(state.spaces.get(space ?? "orphanRooms"));
}

export function update() {
  if (state.syncer.status === "starting") return;
  
  for (let [id, data] of rooms.entries()) {
    state.rooms.set(id, formatRoom(id, data));
  }

  // TODO: dms

  const inSpaces = new Set();
  for (let [id, room] of state.rooms) {
    if (room.type !== "space") continue;
    const children = rooms.get(room.roomId)
      .filter(i => i.type === "m.space.child")
      .filter(i => state.rooms.has(i.state_key))
      .map(i => state.rooms.get(i.state_key));
    children.forEach(i => inSpaces.add(i.roomId));
    state.spaces.set(id, children);
  }
  
  const orphans = [...state.rooms.values()].filter(i => !inSpaces.has(i.roomId));
  state.spaces.set("orphanRooms",  orphans.filter(i => i.type !== "space"));
  state.spaces.set("orphanSpaces", orphans.filter(i => i.type === "space"));
  
  state.navRooms.set(state.spaces.get("orphanRooms"));
  state.navSpaces.set(state.spaces.get("orphanSpaces"));
}
