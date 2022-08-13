export function format(roomId, raw) {
  const room = state.rooms.get(roomId);
  if (!room) throw `theoretically unreachable? (room id: ${roomId})`;
  if (!room.members.get(raw.sender)) console.warn("couldn't find user " + raw.sender);
  const event = {
    roomId:     roomId,
    eventId:    raw.event_id,
    sender:     room.members.get(raw.sender) ?? { userId: raw.sender, fallback: true },
    stateKey:   raw.state_key,
    content:    raw.content,
    type:       raw.type,
    date:       new Date(raw.origin_server_ts),
    special:    null,
    // flags:    null, // TODO `new Set()` for flags (redacted, sending, errored, ping)
    // isPing:     state.client.getPushActionsForEvent(ev).tweaks?.highlight || false, // TODO: fix
    reactions:  null,
    unsigned:   raw.unsigned,
  };
  dfu(event);
  return event;
}

// data fixer upper
// TODO: convert old messages into new extensible events
function dfu(event) {
  // if (event.type !== "m.room.message") return;
  // event.type = event.content.msgtype;
  // if (event.content.msgtype === "m.notice") {
    
  // }
  // msgtype m.notice -> event type m.notice
  // msgtype * -> event type *
  // m.room.message -> m.message
  // body: m.text
  // formatted_body: m.html
  // { "body" : "arst", "msgtype": "m.text", "formatted_body": "arst" }  
}
