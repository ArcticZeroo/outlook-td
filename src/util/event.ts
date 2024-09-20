type TListener<TArgs extends unknown[]> = (...args: TArgs) => void;

class ListenerManager<TArgs extends Array<unknown>> {
	readonly #listeners: Array<TListener<TArgs>> = [];

	addListener(listener: TListener<TArgs>) {
		this.#listeners.push(listener);
	}

	removeListener(listener: TListener<TArgs>) {
		const index = this.#listeners.indexOf(listener);
		if (index >= 0) {
			this.#listeners.splice(index, 1);
		}
	}

	notify(...args: TArgs) {
		for (const listener of this.#listeners) {
			listener(...args);
		}
	}
}

export class ValueListener<T> {
	#value: T
	readonly #listeners = new ListenerManager<[T /*value*/, Readonly<T> /*oldValue*/]>();

	constructor(initialValue: T) {
		this.#value = initialValue;
	}

	get value(): Readonly<T> {
		return this.#value;
	}

	set value(value: T) {
		const oldValue = this.#value;
		this.#value = value;
		this.#listeners.notify(value, oldValue);
	}

	addListener(listener: TListener<[T, Readonly<T>]>) {
		this.#listeners.addListener(listener);
	}

	drive(listener: TListener<[T]>) {
		this.addListener(listener);
		listener(this.value);
	}
}

export class ValueListenerSet<T> {
	readonly #value: Set<T> = new Set();

	readonly #entriesAddedListener = new ListenerManager<[Array<T>]>();
	readonly #entriesRemovedListener = new ListenerManager<[Array<T>]>();

	add(...values: T[]) {
		const addedValues: T[] = [];
		for (const value of values) {
			if (!this.#value.has(value)) {
				this.#value.add(value);
				addedValues.push(value);
			}
		}

		if (addedValues.length > 0) {
			this.#entriesAddedListener.notify(addedValues);
		}
	}

	delete(...values: T[]) {
		const removedValues: T[] = [];
		for (const value of values) {
			if (this.#value.delete(value)) {
				removedValues.push(value);
			}
		}

		if (removedValues.length > 0) {
			this.#entriesRemovedListener.notify(removedValues);
		}
	}

	clear() {
		const removedValues = [...this.#value];
		this.#value.clear();
		this.#entriesRemovedListener.notify(removedValues);
	}

	has(value: T) {
		return this.#value.has(value);
	}

	get size() {
		return this.#value.size;
	}

	get values() {
		return this.#value.values();
	}

	addEntriesAddedListener(listener: TListener<[Array<T>]>) {
		this.#entriesAddedListener.addListener(listener);
	}

	addEntriesRemovedListener(listener: TListener<[Array<T>]>) {
		this.#entriesRemovedListener.addListener(listener);
	}
}

export class ValueListenerMap<TKey, TValue> {
	readonly #value: Map<TKey, TValue> = new Map();

	readonly #entryAddedListeners = new ListenerManager<[TKey, TValue]>();
	readonly #entryRemovedListeners = new ListenerManager<[TKey, TValue]>();
	readonly #entryUpdatedListeners = new ListenerManager<[TKey, TValue /*value*/, TValue /*oldValue*/]>();

	constructor(public readonly shouldAlsoSendUpdateForAdd: boolean = true) {
	}

	set(key: TKey, value: TValue) {
		const oldValue = this.#value.get(key);
		this.#value.set(key, value);

		if (oldValue == null) {
			this.#entryAddedListeners.notify(key, value);

			if (this.shouldAlsoSendUpdateForAdd) {
				this.#entryUpdatedListeners.notify(key, value, value);
			}
		} else {
			this.#entryUpdatedListeners.notify(key, value, oldValue);
		}
	}

	delete(key: TKey) {
		const oldValue = this.#value.get(key);
		if (oldValue != null) {
			this.#value.delete(key);
			this.#entryRemovedListeners.notify(key, oldValue);
		}
	}

	clear() {
		const removedEntries = [...this.#value];
		this.#value.clear();
		for (const [key, value] of removedEntries) {
			this.#entryRemovedListeners.notify(key, value);
		}
	}

	get(key: TKey) {
		return this.#value.get(key);
	}

	has(key: TKey) {
		return this.#value.has(key);
	}

	get size() {
		return this.#value.size;
	}

	keys() {
		return this.#value.keys();
	}

	values() {
		return this.#value.values();
	}

	entries() {
		return this.#value.entries();
	}

	addEntryAddedListener(listener: TListener<[TKey, TValue]>) {
		this.#entryAddedListeners.addListener(listener);
	}

	addEntryRemovedListener(listener: TListener<[TKey, TValue]>) {
		this.#entryRemovedListeners.addListener(listener);
	}

	addEntryUpdatedListener(listener: TListener<[TKey, TValue, TValue]>) {
		this.#entryUpdatedListeners.addListener(listener);
	}
}