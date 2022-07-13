class MembersCache extends Map {
	async fetch(id) {
		
	}
}

export default class Room {
	constructor(client, id) {
		this._client = client;
		this.id = id;
		// this.members = new MembersCache();
	}
	
	_state(type) {
		return this._client._roomData.get(this.id).find(i => i.type === type);
	}

	get name() { return this._state("m.room.name")?.content.name ?? null }
	get topic() { return this._state("m.room.topic")?.content.topic ?? null }
	get avatar() { return this._state("m.room.avatar_url")?.content.avatar_url ?? null }
	get type() { return this._state("m.room.create")?.content.type ?? null }
	
	send(type, content) {
		if (!type) throw new Error("missing type");
		if (!content) throw new Error("missing content");
    this._bot._sendEvent(this.id, type, content);
	}

	// TODO: clean up/DRY membership code
	async join() {
		await this._bot._fetch(`rooms/${this.id}/join`, { method: "POST" });
	}

	async leave() {
		await this._bot._fetch(`rooms/${this.id}/leave`, { method: "POST" });
	}

	async invite(who, reason = "") {
		const body = { user_id: who instanceof Member ? who.id : who };
		if (reason) body.reason = reason;
		await this._bot._fetch(`rooms/${this.id}/invite`, { method: "POST", body });
	}

	async kick(who, reason) {
		const body = { user_id: who instanceof Member ? who.id : who };
		if (reason) body.reason = reason;
		await this._bot._fetch(`rooms/${this.room.id}/kick`, { method: "POST", body });
	}

	async ban(who, reason) {
		const body = { user_id: who instanceof Member ? who.id : who };
		if (reason) body.reason = reason;
		await this._bot._fetch(`rooms/${this.room.id}/ban`, { method: "POST", body });
	}

	async unban(who, reason) {
		const body = { user_id: who instanceof Member ? who.id : who };
		if (reason) body.reason = reason;
		await this._bot._fetch(`rooms/${this.room.id}/unban`, { method: "POST", body });
	}
	
	members(who) {
		return new Member(this._bot, who instanceof Member ? who.id : who, this.id);
	}

	setName(name) {
		if (!name) throw new Error("missing name");
    this._bot._sendStateEvent(this.id, "m.room.name", { name });
	}

	setTopic(topic) {
		if (!topic) throw new Error("missing topic");
    this._bot._sendStateEvent(this.id, "m.room.topic", { topic });
	}
}
