import TimelineSet from "../matrix/timeline.js";

const rooms = new Map();

function formatRoom(roomId, room) {
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
      me: power.users?.[state.userId] ?? power.users_default ?? 0,
      getEvent: (name) => power.events?.[name] ?? power.events_default ?? 0,
      getState: (name) => power.state?.[name] ?? power.state_default ?? 50,
    }
  }
  
  function memberCache() {
    let members = null;
    return {
      ready: false,
      async fetch() {
        const { chunk } = await state.api.fetchMembers(roomId);
        const power = getPower();
        members = chunk.map(i => ({
          userId: i.state_key,
          name: i.content.displayname ?? i.state_key,
          avatar: i.content.avatar_url ?? null,
          power: power.users?.[i.state_key] ?? power.users_default ?? 0,
          membership: i.content.membership,
          reason: i.content.reason ?? null,
          date: new Date(i.origin_server_ts),
        }));
        this.ready = true;
      },
      get(membership) {
        const cmp = (a, b) => a > b ? 1 : a < b ? -1 : 0;
        return members
          .filter(i => i.membership === membership)
          .sort((a, b) => cmp(a.name, b.name))
          .sort((a, b) => cmp(b.power, a.power));
      },
    };
  }
  
  return {
    roomId:     roomId,
    name:       getState("m.room.name")?.name ?? "unknown room...",
    topic:      getState("m.room.topic")?.topic ?? null,
    avatar:     getState("m.room.avatar")?.url,
    tombstone:  getState("m.room.tombstone") ?? null,
    joinRule:   getState("m.room.join_rules")?.join_rule,
    type:       getType(),
    power:      getPower(),
    members:    memberCache(),        
    timelines:  new TimelineSet(),
    
    hasUserReadEvent: (user, ev) => false, // TODO: fix
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

export function handleJoin(roomId, event) {
  if (!rooms.has(roomId)) rooms.set(roomId, []);
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
  const joinedRooms = [...rooms.entries()].map(([id, data]) => formatRoom(id, data))

  // TODO: dms
  // const dms = [];
  // const dmData = state.client.getAccountData("m.direct")?.getContent();
  // if (dmData) {
  //   for (let userId in dmData) {
  //     for (let roomId in dmData[userId]) dms.push({ userId, roomId });
  //   }
  //   state.dms.set(dms);
  // }

  const spaceMap = new Map();
  const inSpaces = [];
  const spaces = joinedRooms.filter(i => i.type === "space");
  for (let space of spaces) {
    const spaceRooms = rooms.get(space.roomId)
      .filter(i => i.type === "m.space.child")
      .filter(i => rooms.has(i.state_key))
      .map(i => formatRoom(i.state_key, rooms.get(i.state_key)));
    inSpaces.push(...spaceRooms);
    spaceMap.set(space.roomId, spaceRooms);
  }
  
  const orphans = joinedRooms.filter(i => !inSpaces.includes(i.roomId));
  spaceMap.set("orphanRooms",  orphans.filter(i => i.type !== "space"));
  spaceMap.set("orphanSpaces", orphans.filter(i => i.type === "space"));
  
  state.rooms.set(joinedRooms);
  state.spaceMap.set(spaceMap);
}
