export default class Event {
  constructor(room, raw) {
    this.room = room;
    this.raw = raw;
    
    this.special = null;
    this.flags = new Set(); // TODO `new Set()` for flags (redacted, sending, errored, ping)
    this.reactions = null;
    this.relations = []; // TODO: what am i doing
  }

  // use this to parse edits/reactions?  
  parseRelation(event) {
    this.relations.unshift(event);
    this.flags.add("edited");
  }
  
  get content()  {
    const edit = this.relations.find(i => i.content["m.relates_to"]?.rel_type === "m.replace");
    if (edit) {
      return {
        ...edit?.content["m.new_content"],
        "m.relates_to": this.raw.content["m.relates_to"],
      };
    }
    return this.raw.content;
  }
  
  get roomId()   { return this.room.roomId }
  get eventId()  { return this.raw.event_id }
  get type()     { return this.raw.type }
  get sender()   { return this.room.members.get(this.raw.sender) ?? { userId: this.raw.sender } }
  get stateKey() { return this.raw.state_key }
  get date()     { return new Date(this.raw.origin_server_ts) }
  get unsigned() { return this.raw.unsigned }
}
