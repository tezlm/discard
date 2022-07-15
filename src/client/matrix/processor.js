// this module handles the recieved data from sync

export function handleEvent(roomId, event, toStart) {
  actions.rooms.handleEvent(roomId, event, toStart);
}

export function handleEphermeral(roomId, event) {
  // TODO
}

export function handleState(roomId, event, batch) {
  actions.rooms.handleJoin(roomId, event, batch);
}

