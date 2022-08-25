export default class MemberCache extends Map {
  constructor(room) {
    super();
    this.room = room;
    this.request = null;
    this._sortCache = new Map();
  }
  
  handle(event) {
    const id = event.state_key;
    const cont = event.content;
    const power = this.room.power;
    this.set(id, {
      userId: id,
      roomId: this.roomId,
      name: cont.displayname ?? id,
      avatar: cont.avatar_url ?? null,
      power: power.getUser(id),
      membership: cont.membership,
      reason: cont.reason ?? null,
      date: new Date(event.origin_server_ts),
    });
    
    // a bit faster than throwing away the whole cache for $membership
    const oldMembership = event.unsigned?.prev_content?.membership;
    if (oldMembership) {
      const sorted = this._sortCache.get(oldMembership);
      if (sorted) {
        const idx = sorted.findIndex(i => i.userId === id);
        if (idx >= 0) sorted.splice(idx, 1);
      }
    }
    
    this._sortCache.delete(cont.membership);
  }
  
  async fetch() {
    if (this.request) return this.request;
    state.log.matrix("fetch members");
    this.request = state.api.fetchMembers(this.room.roomId)
      .then(({ chunk }) => chunk.forEach(i => this.room.handleState(i)));
    return this.request;
  }
  
  with(membership) {
    if (this._sortCache.has(membership)) return this._sortCache.get(membership);
    const cmp = (a, b) => a > b ? 1 : a < b ? -1 : 0;
    const members = [...this.values()]
        .filter(i => i.membership === membership)
        .sort((a, b) => cmp(b.power, a.power) || cmp(a.name, b.name));
    this._sortCache.set(membership, members);
    return members;
  }
}
