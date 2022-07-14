const encode = encodeURIComponent;

export default class Api {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.filter = null;
  }
  
  // utility methods for fetching
  async fetchUnauth(method, path, body) {
    const url = `${this.baseUrl}/_matrix/client/v3${path}`;
  	const opts = { method };
  	if (body) opts.body = JSON.stringify(body);
  	return fetch(url, opts).then(res => res.json());
  }
  
  async fetch(method, path, body, extraOpts = {}) {
    if (!this.token) throw "token required";
    const url = `${this.baseUrl}/_matrix/client/v3${path}`;
  	const opts = { ...extraOpts, method, headers: { authorization: "Bearer " + this.token } };
  	if (body) opts.body = JSON.stringify(body);
  	return fetch(url, opts).then(res => res.json());
  }
  
  // filters and syncing
  async postFilter(userId, filter) {
    const res = await this.fetch("POST", `/user/${encode(userId)}/filter`, filter);
    return res.filter_id;
  }
  
  useFilter(filterId) {
    this.filter = encode(filterId);
  }
  
  sync(since, signal) {
    return this.fetch("GET", `/sync?timeout=30000${since ? "&since=" + since : ""}${this.filter ? "&filter=" + this.filter : ""}`, null, { signal });
  }
  
  // login/logout
  async login(userId, password, deviceName = "discard") {
    const { access_token: token } = await this.fetchUnauth("POST", "/login", {
      type: "m.login.password",
      identifier: {
        type: "m.id.user",
        user: userId,
      },
      password: password,
      initial_device_display_name: deviceName,
    });
    this.token = token;
    return token;
  }
  
  logout() {
    return this.fetch("POST", "/logout");
  }
  
  // fetching content
  fetchMessages(roomId, startId, direction) {
    return this.fetch("GET", `/rooms/${encode(roomId)}/messages?from=${encode(startId)}&dir=${direction}&limit=200`);
  }

  fetchContext(roomId, eventId) {
    return this.fetch("GET", `/rooms/${encode(roomId)}/context/${encode(eventId)}?limit=200`);
  }
  
  fetchEvent(roomId, eventId) {
    return this.fetch("GET", `/rooms/${encode(roomId)}/event/${encode(eventId)}`);
  }
  
  fetchMembers(roomId) {
    return this.fetch("GET", `/rooms/${encode(roomId)}/members`);
  }
  
  // sending content
  sendEvent(roomId, type, content, txnId) {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/send/${encode(type)}/${encode(txnId)}`, content);
  }
  
  sendState(roomId, type, stateKey, content) {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/state/${encode(type)}/${encode(stateKey)}`, content);
  }

  sendReceipt(roomId, eventId, type = "m.read") {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/receipt/${encode(type)}/${encode(eventId)}`, content);
  }
  
  sendTyping() {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/typing/${encode(eventId)}`, content);
  }

  // redact events
  redactEvent(roomId, eventId, content, txnId) {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/redact/${encode(eventId)}/${encode(txnId)}`, content);
  }
  
  // rooms
  createRoom() { throw "TODO" }
  joinRoom() { throw "TODO" }
  leaveRoom() { throw "TODO" }
  
  // memers
  inviteMember() { throw "TODO" }
  kickMember() { throw "TODO" }
  banMember() { throw "TODO" }
}
