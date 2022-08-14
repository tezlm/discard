const encode = encodeURIComponent;

export default class Api {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.filter = null;
  }
  
  // utility methods for fetching
  async fetchRaw(method, path, body, opts = {}) {
    const url = `${this.baseUrl}${path}`;
  	opts.method = method;
  	if (body) opts.body = body;
  	return fetch(url, opts).then(res => res.json());
  }
  
  async fetchUnauth(method, path, body) {
  	return this.fetchRaw(method, `/_matrix/client/v3${path}`, JSON.stringify(body));
  }
  
  async fetchAuth(method, path, body, opts = {}) {
    if (!this.token) throw "token required";
  	opts.headers = { authorization: "Bearer " + this.token };
  	return this.fetchRaw(method, path, body && JSON.stringify(body), opts);
  }
  
  async fetch(method, path, body, opts = {}) {
  	return this.fetchAuth(method, `/_matrix/client/v3${path}`, body, opts);
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
    const res = await this.fetchUnauth("POST", "/login", {
      type: "m.login.password",
      identifier: {
        type: "m.id.user",
        user: userId,
      },
      password: password,
      initial_device_display_name: deviceName,
    });
    if (res.error) throw res;
    this.token = res.access_token;
    return res.access_token;;
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
    // TODO: conduit seems to fetch all users anyway?
    return this.fetch("GET", `/rooms/${encode(roomId)}/members?not_membership=leave`);
  }
  
  fetchUser(userId) {
    return this.fetch("GET", `/profile/${encode(userId)}`);
  }  
  
  // sending content
  sendEvent(roomId, type, content, txnId) {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/send/${encode(type)}/${encode(txnId)}`, content);
  }
  
  sendState(roomId, type, stateKey, content) {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/state/${encode(type)}/${encode(stateKey)}`, content);
  }

  sendReceipt(roomId, eventId) {
    return this.fetch("POST", `/rooms/${encode(roomId)}/read_markers`, { "m.fully_read": eventId });
  }
  
  sendTyping(roomId, userId, content) {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/typing/${encode(userId)}`, content);
  }
  
  sendAccountData(userId, type, data) {
    return this.fetch("PUT", `/user/${encode(userId)}/account_data/${encode(type)}`, data);
  }
  
  // redact events
  redactEvent(roomId, eventId, content, txnId) {
    return this.fetch("PUT", `/rooms/${encode(roomId)}/redact/${encode(eventId)}/${encode(txnId)}`, content);
  }
  
  // e2ee
  uploadKeys(keys) {
    return this.fetch("POST", "/keys/upload", keys);
  }
  
  queryKeys(keys) {
    return this.fetch("POST", "/keys/query", keys);
  }
  
  claimKeys(keys) {
    return this.fetch("PUT", "/keys/claim", keys);
  }

  // files
  uploadFile(file, progress) {
    if (!this.token) throw "token required";
    const xhr = new XMLHttpRequest();
    const promise = new Promise((res, rej) => {
      xhr.addEventListener("load", () => {
        if (xhr.status !== 200) rej(JSON.parse(xhr.response));
        res(JSON.parse(xhr.response).content_uri);
      });
      xhr.addEventListener("abort", () => rej(null))
      xhr.addEventListener("error", (err) => rej(err));
    });
    xhr.upload.addEventListener("progress", (e) => {
      progress({ loaded: e.loaded, total: e.total });
    });
    xhr.open("POST", `${this.baseUrl}/_matrix/media/v3/upload?filename=${encode(file.name)}`);
    xhr.setRequestHeader("Authorization", "Bearer " + this.token);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
    return { promise, abort: () => xhr.abort() };
  }
    
  // rooms
  createRoom({ name, topic, creator, type, state, version = 9 }) {
    return this.fetch("POST", `/createRoom`, {
      name,
      topic,
      room_version: version.toString(),
      power_level_content_override: { users: { [creator]: 101 } },
      ...(type && { creation_content: { type } }),
      ...(state && { initial_state: state }),
    });
  }
  
  joinRoom(roomId) {
    return this.fetch("POST", `/rooms/${encode(roomId)}/join`);    
  }
  
  leaveRoom(roomId) {
    return this.fetch("POST", `/rooms/${encode(roomId)}/leave`);    
  }
  
  // memers
  inviteMember(roomId, userId, reason) {
    return this.fetch("POST", `/rooms/${encode(roomId)}/invite`, { user_id: userId, reason });    
  }
  
  kickMember(roomId, userId, reason) {
    return this.fetch("POST", `/rooms/${encode(roomId)}/kick`, { user_id: userId, reason });    
  }
  
  banMember(roomId, userId, reason) {
    return this.fetch("POST", `/rooms/${encode(roomId)}/ban`, { user_id: userId, reason });    
  }
  
  unbanMember(roomId, userId, reason) {
    return this.fetch("POST", `/rooms/${encode(roomId)}/unban`, { user_id: userId, reason });    
  }
  
  fetchUrlPreview(url, ts) {
  	return this.fetch("GET", `preview_url?url=${encode(url)}&ts=${encode(ts)}`);
  }
}
