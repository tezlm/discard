export function update() {
  const dms = state.accountDataRef.get("m.direct");
  state.dms.clear();
  for (let person in dms) {
    for (let roomId of dms[person]) {
      if (state.rooms.has(roomId)) {
        state.dms.set(roomId, state.rooms.get(roomId).members.get(person) ?? { id: person });
      }
    }
  }
	
  // FIXME: break out loops
  
  const inSpaces = new Set();
  for (let [id, room] of state.rooms) {
    if (room.type !== "m.space") continue;
    const children = room.getAllState("m.space.child")
      .filter(i => i.content.via && state.rooms.has(i.stateKey))
      .map(i => ({ event: i, room: state.rooms.get(i.stateKey) }))
      .sort(orderSpaces)
      .map(i => i.room);
    children.forEach(i => inSpaces.add(i.id));
    state.spaces.set(id, children);
  }
  
  const orphans = [...state.rooms.values()].filter(i => !inSpaces.has(i.id));
  state.spaces.set("orphanRooms",  orphans.filter(i => i.type !== "m.space"));
  state.spaces.set("orphanSpaces", orphans.filter(i => i.type === "m.space"));
	
  refresh();
  
  function orderSpaces(a, b) {
    const cmp = (a, b) => a > b ? 1 : a < b ? -1 : 0;
    if (a.room.type === "m.space" && b.room.type !== "m.space") return 1;
    if (a.room.type !== "m.space" && b.room.type === "m.space") return -1;
    return cmp(a.event.order, b.event.order)
      || cmp(a.room.name, b.room.name)
      || cmp(a.event.date, b.event.date)
      || cmp(a.room.id, b.room.id);
  }
}

export function refresh() {
  state.navRooms.set(state.spaces.get(state.focusedSpaceId ?? "orphanRooms") ?? []);
  state.navSpaces.set(state.spaces.get("orphanSpaces") ?? []);
}

export function focus(space) {
  state.log.ui(`focus space ${space?.id}`);
	state.focusedSpaceId = space?.id;
	state.focusedSpace.set(space);
	state.navRooms.set(state.spaces.get(space?.id ?? "orphanRooms") ?? []);
}
