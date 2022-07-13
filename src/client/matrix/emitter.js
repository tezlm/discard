export default class Emitter {
	constructor() {
		this._listeners = new Map();
	}
	
	on(event, call) {
		this._listeners.set(call, event);
	}
	
	off(call) {
		this._listeners.delete(call);
	}

	once(event, call) {
		const wrapped = (...params) => { call(...params); this.off(wrapped) }
		this._listeners.set(wrapped, event);
	}
	
	emit(event, ...params) {
		for (let listener of this._listeners) {
			if (listener[1] === event) {
				listener[0](...params);
			}
		}
	}
}
