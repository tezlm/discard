// this module handles the recieved data from sync
// TODO: move into client with syncer listeners

export function handleEphermeral(roomId, type, content) {
  if (type !== "m.typing") return;
  
  const roomState = state.roomStates.get(roomId);
  if (!roomState) return;
  roomState.typing = content.user_ids;
  if (roomId === state.focusedRoomId) {
    state.roomState.typing.set(content.user_ids);
  }
}

export function handleNotis(roomId, content) {
  const room = state.rooms.get(roomId);
  if (room) {
    room.notifications = {
      pings: content.highlight_count,
      unread: content.notification_count,
    };
    const space = state.focusedSpaceId ?? "orphanRooms";
    state.navRooms.set(state.spaces.get(space));
  }
}
