export default class MemberCache extends Map {
  constructor(roomId, getPower) {
    super();
    this.roomId = roomId;
    this.request = null;
    this._getPower = () => getPower();
  }
  
  add(event) {
    const id = event.state_key;
    const cont = event.content;
    const power = this._getPower();
    this.set(id, {
      userId: id,
      roomId: this.roomId,
      name: cont.displayname ?? id,
      avatar: cont.avatar_url ?? null,
      power: power.users?.[id] ?? power.users_default ?? 0,
      membership: cont.membership,
      reason: cont.reason ?? null,
      date: new Date(event.origin_server_ts),
    });
  }
  
  async fetch() {
    if (this.request) return this.request;
    state.log.matrix("fetch members");
    // TODO: don't update rooms on every member!
    const req = state.api.fetchMembers(this.roomId)
      .then(({ chunk }) => chunk.forEach(i => actions.rooms.handleState(this.roomId, i)));
    this.request = req;
    return req;
  }
  
  with(membership) {
    const cmp = (a, b) => a > b ? 1 : a < b ? -1 : 0;
    return [...this.values()]
      .filter(i => i.membership === membership)
      .sort((a, b) => cmp(a.name, b.name))
      .sort((a, b) => cmp(b.power, a.power));
  }
}
