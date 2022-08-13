export default class MemberCache extends Map {
  constructor(room) {
    super();
    this.room = room;
    this.request = null;
  }
  
  add(event) {
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
  }
  
  async fetch() {
    if (this.request) return this.request;
    state.log.matrix("fetch members");
    this.request = state.api.fetchMembers(this.room.roomId)
      .then(({ chunk }) => chunk.forEach(i => this.add(i)));
    return this.request;
  }
  
  with(membership, sort = true) {
    const cmp = (a, b) => a > b ? 1 : a < b ? -1 : 0;
    if (sort) {
      return [...this.values()]
        .filter(i => i.membership === membership)
        .sort((a, b) => cmp(a.name, b.name))
        .sort((a, b) => cmp(b.power, a.power));    
    } else {
      return [...this.values()].filter(i => i.membership === membership);
    }
  }
}
