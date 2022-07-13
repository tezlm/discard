import Emitter from "./emitter.js";
import Room from "./rooms.js";
import Event from "./events.js";

// creates a custom `fetch()` function with homeserver and token prefilled
const makeFetcher = (homeserver, token) => async (path, { method = "GET", body = null, query = "" } = {}) => {
	const url = `${homeserver}/_matrix/client/v3/${path}${query ? "?" + query : ""}`;
	const opts = { method, headers: { authorization: "Bearer " + token } };
	if (body) opts.body = JSON.stringify(body);
	return fetch(url, opts).then(res => res.json());
}

export class Client extends Emitter {
	constructor(config) {
		if (!config.timeout) config.timeout = 30000;
		if (!config.homeserver) {
			config.homeserver = "https://matrix.org";
		} else {
			config.homeserver = config.homeserver.replace(/^http:/, "https:").replace(/\/$/, "");
		}

		super();
		
		this.config = config;
		this.userId = config.userid;
		this.ready = false;
		this._state = "stop";
		this._store = config.store;
		this._fetch = makeFetcher(config.homeserver, config.token);
		this._roomData = new Map();
		this._accountData = new Map();
	}
	
	// restore the last sync
	async _restore() {
		if (!this._store) return;
		this._accountData = await this._store.all("account");
		this._roomData = await this._store.all("rooms");
	}
	
	// the main sync loop
	async _sync(since) {
		const query = `timeout=${this.config.timeout}${since ? "&since=" + since : ""}`;
		const sync = await this._fetch("sync", { query });
		if (this._state === "stop") return;
		if (sync.error) throw new Error(sync.error);
		const { rooms, account_data: account } = sync;
		
		if (rooms) {
			const data = this._roomData;
			for (let roomId in rooms.join ?? {}) {
				const room = rooms.join[roomId];
				if (data.has(roomId)) {
					data.get(roomId).unshift(...room.state?.events ?? []);
				} else {
					data.set(roomId, room.state?.events ?? []);
				}

				if (this.ready) {
					for (let event of room.timeline?.events || []) {
						this.emit("event", new Event(this, room, event));
					}
				}
			}

			for (let room in rooms.invite ?? {}) {
				console.log(room); // TODO
			}
		}
		
		if (account) {
			for (let data of account.events) {
				this._accountData.set(data.type, data.content);
			}
		}
				
		if (!this.ready) {
			this.emit("ready");
			this.ready = true;
		}
		
		this._sync(sync.next_batch);
	}

	async start() {
		if (!this.config.token) throw new Error("missing token");
		if (!this.userId) {
			this.userId = await this._fetch("account/whoami").then(r => r.user_id);
		}
		await this._restore();
		this._state = "sync";
		this._sync();
	}
	
	async login(userId, password) {
	  const body = {
			type: "m.login.password",
			identifier: { type: "m.id.user", user: userId },
			password,
		};
    const { access_token } = await this._fetch("login", { method: "POST", body });
		this._fetch = makeFetcher(this.config.homeserver, access_token);
		this.config.token = access_token;
		return access_token;
	}
	
	async logout() {
		this._state = "stop";
    console.log(await this._fetch("logout", { method: "POST" }));
		this._store.purge();
	}
	
	getRooms() {
		return [...this._roomData.keys()].map(i => new Room(this, i));
	}
}
