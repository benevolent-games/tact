
import {disposer, Hex} from "@e280/stz"
import {signal, SignalFn} from "@e280/strata"
import {StorageDriver, Store} from "@e280/kv"

import {Bindings} from "../../core/bindings/types.js"
import {Catalog, CatalogData, Profile} from "./catalog.js"

export class Db {
	static async load(store: Store<CatalogData>) {
		const $catalog = signal(new Catalog(await store.get()))
		return new this(store, $catalog)
	}

	dispose = disposer()

	constructor(
			private store: Store<CatalogData>,
			public $catalog: SignalFn<Catalog>,
		) {

		this.dispose.schedule(
			StorageDriver.onStorageEvent(async() => this.reload())
		)
	}

	async reload() {
		const fresh = new Catalog(await this.store.get())
		await this.$catalog.set(fresh)
	}

	async save(catalog: Catalog) {
		await this.store.set(catalog.toJSON())
		await this.$catalog(catalog)
	}

	async #mutateAndSave<R>(fn: (catalog: Catalog) => R) {
		const catalog = this.$catalog().clone()
		const result = fn(catalog)
		await this.store.set(catalog.toJSON())
		await this.$catalog(catalog)
		return result
	}

	async createProfile(label: string, bindings: Bindings) {
		return this.#mutateAndSave(catalog => {
			const id = Hex.random()
			const profile: Profile = {id, label, bindings}
			catalog.profiles.set(id, profile)
			return profile
		})
	}

	async deleteProfile(id: string) {
		return this.#mutateAndSave(catalog => {
			catalog.profiles.delete(id)
		})
	}

	async assignPortToProfile(index: number, profileId: string | null) {
		return this.#mutateAndSave(catalog => {
			catalog.portProfiles[index] = profileId
		})
	}
}

