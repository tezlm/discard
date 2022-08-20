export default class Event {
  constructor(room, raw) {
    this.room = room;
    this.raw = raw;   
    
    this.flags = new Set();
    this.reactions = null; // move to getter?
    this.relations = [];
    
    this._content = null;
    this._contentDirty = true;
  }

  // use this to parse edits/reactions?
  parseRelation(event) {
    this.relations.unshift(event);
    this.flags.add("edited");
    this._contentDirty = true;
  }
  
  // should handle edits, e2ee, and legacy events
  get content() {
    if (!this._contentDirty) return this._content;
    let content;
    
    const edit = this.relations.find(i => i.content["m.relates_to"]?.rel_type === "m.replace");
    if (edit) {
      content = {
        ...edit?.content["m.new_content"],
        "m.relates_to": this.raw.content["m.relates_to"],
      };
    } else {
      content = this.raw.content;
    }
    
    this._content = content;
    this._contentDirty = false;
    return content;
  }
  
  get roomId()   { return this.room.roomId }
  get eventId()  { return this.raw.event_id }
  get type()     { return this.raw.type }
  get sender()   { return this.room.members.get(this.raw.sender) ?? { userId: this.raw.sender } }
  get stateKey() { return this.raw.state_key }
  get date()     { return new Date(this.raw.origin_server_ts) }
  get unsigned() { return this.raw.unsigned }
}

// TODO: a way to get relations
// have to parse/handle multiple ways of relations
/*
{
  "m.relates_to": {
    "rel_type": "m.type",
    "event_id": "$eventid"
  }
}

{
  "m.relates_to": {
    "m.type": {
      "event_id": "$eventid"
    }
  }
}

{
  "m.relations": [
    { "rel_type": "m.type", "event_id": "$eventid" }
  ]
}
*/
