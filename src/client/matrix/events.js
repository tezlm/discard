export default class Event {
	constructor(bot, room, event) {
		this._bot = bot;
		this._room = room;
		this._event = event;
	}

	get id() {
		return this._event.event_id;
	}

	get room() {
		return new Room(this._bot, this._room);
	}

	get type() {
		return this._event.type;
	}

	get author() {
		return new Member(this._bot, this._event.sender, this._room);
	}

	get content() {
		return this._event.content;
	}

	redact(reason) {
		const body = reason ? { reason } : {};
		this._bot._fetch(`rooms/${this._room}/redact/${this.id}/m${Math.random()}`, { method: "PUT", body });
	}
}
