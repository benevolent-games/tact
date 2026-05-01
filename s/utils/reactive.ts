
import {GMap} from "@e280/stz"
import {tracker} from "@e280/strata"

export class ReactiveSet<V> {
	#set

	constructor(values: V[] = []) {
		this.#set = new Set<V>(values)
	}

	async add(...values: V[]) {
		for (const value of values)
			this.#set.add(value)
		await tracker.notifyWrite(this)
	}

	async delete(...values: V[]) {
		for (const value of values)
			this.#set.delete(value)
		await tracker.notifyWrite(this)
	}

	async clear() {
		this.#set.clear()
		await tracker.notifyWrite(this)
	}

	get size() {
		tracker.notifyRead(this)
		return this.#set.size
	}

	has(value: V) {
		tracker.notifyRead(this)
		return this.#set.has(value)
	}

	values() {
		return this.#set.values()
	}

	array() {
		return [...this.#set.values()]
	}

	*[Symbol.iterator]() {
		yield* this.values()
	}
}

export class ReactiveMap<K, V> {
	#map

	static fromObject<Obj extends object>(obj: Obj) {
		return new this<keyof Obj, Obj[keyof Obj]>(
			Object.entries(obj) as any
		)
	}

	constructor(entries: [K, V][] = []) {
		this.#map = new Map<K, V>(entries)
	}

	async set(key: K, value: V) {
		this.#map.set(key, value)
		await tracker.notifyWrite(this)
	}

	async setEntries(entries: [K, V][]) {
		for (const [key, value] of entries)
			this.#map.set(key, value)
		await tracker.notifyWrite(this)
	}

	async absorbObject(obj: object) {
		await this.setEntries(Object.entries(obj) as any)
	}

	async delete(...keys: K[]) {
		for (const key of keys)
			this.#map.delete(key)
		await tracker.notifyWrite(this)
	}

	async clear() {
		this.#map.clear()
		await tracker.notifyWrite(this)
	}

	async guarantee(key: K, make: () => V) {
		tracker.notifyRead(this)
		const value = GMap.guarantee(this.#map, key, make)
		await tracker.notifyWrite(this)
		return value
	}

	get size() {
		tracker.notifyRead(this)
		return this.#map.size
	}

	get(key: K) {
		tracker.notifyRead(this)
		return this.#map.get(key)
	}

	need(key: K) {
		tracker.notifyRead(this)
		return GMap.need(this.#map, key)
	}

	has(key: K) {
		tracker.notifyRead(this)
		return this.#map.has(key)
	}

	keys() {
		tracker.notifyRead(this)
		return this.#map.keys()
	}

	values() {
		tracker.notifyRead(this)
		return this.#map.values()
	}

	entries() {
		tracker.notifyRead(this)
		return this.#map.entries()
	}

	array() {
		tracker.notifyRead(this)
		return [...this.#map.entries()]
	}

	*[Symbol.iterator]() {
		yield* this.entries()
	}
}

