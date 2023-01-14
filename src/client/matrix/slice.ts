export default class Slice {
  private foundStart = false;
  private foundEnd = false;

  constructor(timeline) {
    this.timeline = timeline;
    this.reset();

    if (timeline === timeline.room.events.live) {
      this.foundEnd = true;
    }
  }
  
  atEnd() {
    if (this.timeline !== this.timeline.room.events.live) return false;
    return this.end === this.timeline.at(-1)
      || this.end === this.timeline.at(-2);
  }
  
  reset(count = 50) {
    const { timeline } = this;
    const startIdx = Math.max(timeline.length - (count * 2) - 1, 0);
    const endIdx = timeline.length - 1;
    this.start = timeline[startIdx];
    this.end = timeline[endIdx];
    this.events = timeline.slice(startIdx, endIdx + 1)
      .filter((ev) => !ev.content["m.new_content"] && ev.type !== "m.reaction");
  }
    
  reslice() {
    const { timeline, start, end } = this;
    const startIdx = timeline.lastIndexOf(start);
    const endIdx = timeline.lastIndexOf(end);
    this.events = timeline.slice(startIdx, endIdx + 1)
      .filter((ev) => !ev.content["m.new_content"] && ev.type !== "m.reaction");
  }
  
  async backwards(count = 50) {
    const { timeline, start, end } = this;
    const oldStart = timeline.indexOf(start);
    if (oldStart - count < 0 && !this.foundStart) {
      state.log.matrix(`fetching backwards in ${timeline.room.id}`);
      if (!await timeline.fetch("backwards")) this.foundStart = true;
    }
    
    const startIdx = start ? timeline.indexOf(start) : Math.max(timeline.length - count, 0);
    if (startIdx === -1) this.reset();
    
    const eventCount = count * 2;
    const newStart = Math.max(startIdx - count, 0);
    const newEnd = Math.min(newStart + eventCount, timeline.length - 1);
     
    state.log.ui(`now viewing [${newStart}..${newEnd}] of ${timeline.length}`);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1)
      .filter((ev) => !ev.content["m.new_content"] && ev.type !== "m.reaction");
    if (this.events.indexOf(undefined) >= 0) state.log.error("missing event!")
  }
  
  async forwards(count = 50) {
    const { timeline, start, end } = this;
    const oldEnd = timeline.indexOf(end);
    if (oldEnd + count > timeline.length && !this.foundEnd) {
      state.log.matrix(`fetching forwards in ${timeline.room.id}`);
      if (!await timeline.fetch("forwards")) this.foundEnd = true;
    }
    
    const startIdx = timeline.lastIndexOf(start);
    if (startIdx === -1) this.reset();
    
    const eventCount = count * 2;
    const newStart = Math.max(Math.min(startIdx + count, timeline.length - count - 1), 0);
    const newEnd = Math.min(newStart + eventCount, timeline.length - 1);
     
    state.log.ui(`now viewing [${newStart}..${newEnd}] of ${timeline.length}`);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1)
      .filter((ev) => !ev.content["m.new_content"] && ev.type !== "m.reaction");
  }
  
  async jump(eventId, count = 50) {
    // await this.timelineSet.jump(eventId); // TODO
    const timeline = this.timeline;
    const evIdx = timeline.findLast(i => i.id === eventId);
    
    const newStart = Math.max(evIdx - count, 0);
    const newEnd = Math.min(evIdx + count - 1, timeline.length - 1);
    // const newStart = Math.min(Math.max(startIdx + count, 0), timeline.length - count - 1);
    // const newEnd = Math.min(newStart + eventCount, timeline.length - 1);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1)
      .filter((ev) => !ev.content["m.new_content"] && ev.type !== "m.reaction");
  }
}
