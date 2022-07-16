export function format(roomId, raw) {
  const event = {
    roomId:     roomId,
    eventId:    raw.event_id,
    stateKey:   raw.state_key,
    content:    raw.content,
    sender:     raw.sender,
    type:       raw.type,
    date:       new Date(raw.origin_server_ts),
    special:    null,
    // isPing:     state.client.getPushActionsForEvent(ev).tweaks?.highlight || false, // TODO: fix
    reactions:  new Map(),
  };
  return event;
}
