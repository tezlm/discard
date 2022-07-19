export function update() {
  // TODO: dms
	
  const inSpaces = new Set();
  for (let [id, room] of state.rooms) {
    if (room.type !== "space") continue;
    const children = room.state
      .filter(i => i.type === "m.space.child")
      .filter(i => state.rooms.has(i.state_key))
      .map(i => state.rooms.get(i.state_key));
    children.forEach(i => inSpaces.add(i.roomId));
    state.spaces.set(id, children);
  }
  
  const orphans = [...state.rooms.values()].filter(i => !inSpaces.has(i.roomId));
  state.spaces.set("orphanRooms",  orphans.filter(i => i.type !== "space"));
  state.spaces.set("orphanSpaces", orphans.filter(i => i.type === "space"));
	
  state.navRooms.set(state.spaces.get(state.focusedSpaceId ?? "orphanRooms"));
  state.navSpaces.set(state.spaces.get("orphanSpaces"));
}

export function focus(space) {
	state.focusedSpaceId = space?.roomId;
	state.focusedSpace.set(space);
	state.navRooms.set(state.spaces.get(space?.roomId ?? "orphanRooms"));
}
