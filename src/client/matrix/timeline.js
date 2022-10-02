import { handle } from "../actions/timeline.js";
import { StateEvent } from "discount";

class Timeline extends Array {
  constructor(roomId, start, end) {
    super();
    this.roomId = roomId;
    this.batchStart = start;
    this.batchEnd = end;
  }
  
  async backwards() {
    if (!this.batchEnd) return false;
    const res = await state.api.fetchMessages(this.roomId, this.batchEnd, "b");
    
    for (let ev of res.state ?? []) {
      const room = state.rooms.get(this.roomId);
      room?.handleState(new StateEvent(room.client, room, ev));
    }
    
    for (let i of res.chunk ?? []) handle(this.roomId, i, true);
    
    this.batchEnd = res.end;
    return true;
  }
  
  async forwards() {
    if (!this.batchStart) return false;
    const res = await state.api.fetchMessages(this.roomId, this.batchEnd, "f");
    for (let i of res.chunk ?? []) handle(this.roomId, i);
    for (let i of res.state ?? []) {
      if (i.type === "m.room.member") state.rooms.get(this.roomId)?.members.add(i);
    }
    
    this.batchStart = res.start;
    return true;
  }
  
  merge(other) {
    const index = this.lastIndexOf(other[0]);
    if (index >= 0) {
        this.push(...other.slice(index));
        return true;
    } else {
      const index = this.indexOf(other[other.length - 1]);
      if (index >= 0) {
        this.unshift(...other.slice(-index));
        return true;
      } else {
        return false;
      }
    }
  }
}

export default class TimelineSet {
  constructor(roomId, batch) {
    state.log.debug("create new timelineset for " + roomId)
    this.roomId = roomId;
    this.live = new Timeline(roomId, null, batch);
    this.current = this.live;
    this._timelines = new Set();
    this._timelines.add(this.live);
  }
  
  async backwards() {
    if (!this.current.backwards()) return false;
    for (let timeline of this._timelines) {
      if (this.current !== timeline && this.current.merge(other)) {
        this._timelines.delete(other);
        return true;
      }
    }
    return true;
  }
  
  async forwards() {
    if (!this.current.forwards()) return false;
    for (let timeline of this._timelines) {
      if (this.current !== timeline && this.current.merge(other)) {
        this._timelines.delete(other);
        return true;
      }
    }
    return true;
  }
  
  for(eventId) {
    for (let timeline of this._timelines) {
      const index = timeline.indexOf(eventId);
      if (index !== -1) return [timeline, index];
    }
    return [null, null];
  }
  
  async jump(eventId) {
    if (!eventId) this.current = this.live;

    for (let timeline of this._timelines) {
      if (timeline.includes(eventId)) {
        this.current = timeline;
        return;
      }
    }
    
    // couldn't find any timeline for that event, get the event's context
    const [event, { start, end, events_before, events_after }] = await Promise.all([
      await state.api.fetchEvent(this.roomId, eventId),
      await state.api.fetchContext(this.roomId, eventId),
    ]);
    const events = events_before.reverse().concat([event, ...events_after]);

    for (let timeline of this._timelines) {
      if (timeline.merge(events)) return timeline;
    }
    
    // no timeline, make a new one    
    const timeline = new Timeline(start, end);
    for (let i of events_before.reverse().concat([event, ...events_after])) {
      // FIXME: make `handle` modify the timeline we want
      // this blocks anything that relies on "jump to xyz" (unread, reply)
      // handleEvent(i, timeline);
      handle(this.roomId, i);
    }
    this._timelines.add(timeline);
    this.current = timeline;
  }
}
