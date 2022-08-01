export function format(roomId, raw) {
  const room = state.rooms.get(roomId);
  if (!room) throw "theoretically unreachable?";
  if (!room.members.get(raw.sender)) console.warn("couldn't find user " + raw.sender);
  const event = {
    roomId:     roomId,
    eventId:    raw.event_id,
    sender:     room.members.get(raw.sender) ?? {},
    stateKey:   raw.state_key,
    content:    raw.content,
    type:       raw.type,
    date:       new Date(raw.origin_server_ts),
    special:    null,
    // isPing:     state.client.getPushActionsForEvent(ev).tweaks?.highlight || false, // TODO: fix
    reactions:  null,
  };
  return event;
}
