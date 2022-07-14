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

  return {
    name:       getState("m.room.name")?.name ?? "unknown room...",
    topic:      getState("m.room.topic")?.topic ?? null,
    avatar:     getState("m.room.avatar"),
    type:       getType(),
    roomId:     roomId,
    power:      getPower(),
    tombstone:  getState("m.room.tombstone") ?? null,

    getMembers(membership) {
      return []; // TODO: fix
      return room[membership ? "getMembersWithMembership" : "getMembers"](membership)
        .sort((a, b) => a.displayName > b.displayName ? -1 : 1)
        .sort((a, b) => a.powerLevel > b.powerLevel ? -1 : 1);
    },
    
    // compat for now
    // hasUserReadEvent: (user, ev) => room.hasUserReadEvent(user, ev), // TODO: fix
    hasUserReadEvent: () => false,
  }
}

export function save() {
  for (let [id, data] of rooms) {
    state.store.rooms.set(id, data);
  }
}

function load() {
  console.log(state.store.rooms.all(id));
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
  
  globalThis.arst = roomState;
}

export function handleInvite(roomId, event) {
  
}

export function handleLeave(roomId) {
  rooms.delete(roomId);
}

setTimeout(update, 3000);

export function update() {
  // const dms = [];
  // const dmData = state.client.getAccountData("m.direct")?.getContent();

  // if (dmData) {
  //   for (let userId in dmData) {
  //     for (let roomId in dmData[userId]) dms.push({ userId, roomId });
  //   }
  //   state.dms.set(dms);
  // }

  state.rooms.set([...rooms.entries()].map(([id, room]) => formatRoom(id, room)));
}
