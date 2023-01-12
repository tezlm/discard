type Listeners<E, T extends keyof E> = Map<E[T], T>;

export default class Emitter<Events extends { [name: string]: (...args: any[]) => void }> {
  private listeners: Listeners<Events, keyof Events> = new Map();
	
	public on<T extends keyof Events>(event: T, call: Events[T]): this {
		this.listeners.set(call, event);
    return this;
	}
	
	public off<T extends keyof Events>(_event: T, call: Events[T]): this {
		this.listeners.delete(call);
    return this;
	}

	public once<T extends keyof Events>(event: T, call: Events[T]): this {
		const wrapped = ((...params: Parameters<Events[T]>): void => {
			call(...params);
			this.listeners.delete(wrapped);
		}) as any as Events[T];
		
		this.listeners.set(wrapped, event);
    return this;
	}

	public emit<T extends keyof Events>(event: T, ...params: Parameters<Events[T]>): this {
		for (let [listener, which] of this.listeners) {
			if (which === event) listener(...params);
		}
    return this;
	}
}
