export default class Events extends Map {
  async fetch(roomId, eventId) {
    if (this.has(eventId)) return this.get(eventId);
    const event = Events.format(state.client.getEventMapper()(await state.client.fetchRoomEvent(roomId, eventId)));
    this.set(eventId, event);
    return event;
  }
  
  // TODO: use raw event
  static format(ev) {
    return {
      sender:     ev.getSender(),
      type:       ev.getType(),
      roomId:     ev.getRoomId(),
      eventId:    ev.getId(),
      date:       ev.getDate(),
      isSending:  ev.isSending(),
      isPing:     state.client.getPushActionsForEvent(ev).tweaks?.highlight || false,
      isRedacted: ev.isRedacted(),
      content:    { ...ev.getContent() },
      reactions:  new Map(),
    };  
  }
}
