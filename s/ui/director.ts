
import {deep, GMap} from "@e280/stz"
import {Cubby, LocalStore, Prism, Vault, Versioned} from "@e280/strata"
import {mappy} from "./utils/mappy.js"
import {mappify} from "./utils/mappify.js"
import {Controller} from "../hub/controller.js"
import {GamepadSettings, Preferences, Profile} from "./types.js"

export async function setupDirector({stockProfiles}: {
		stockProfiles: Profile[]
	}) {
	const store = new LocalStore("tactConfigurator")
	const director = new Director({
		store,
		stockProfiles,
		preferences: {
			customProfiles: [],
			controllerSettings: [],
		},
	})
	const dispose = store.onStorageEvent(() => director.load())
	await director.load()
	return {director, dispose}
}

export class Director {
	readonly stockProfiles

	#vault
	#prism
	#lens
	#controllers = new GMap<string, Controller<any>>()

	constructor(options: {
			stockProfiles: Profile[]
			preferences: Preferences
			store: Cubby<Versioned<Preferences>>
		}) {
		this.#prism = new Prism(options.preferences)
		this.#lens = this.#prism.lens(p => p)
		this.#vault = new Vault<Preferences>({
			version: 1,
			prism: this.#prism,
			store: options.store,
		})
		this.stockProfiles = deep.freeze(deep.clone(options.stockProfiles))
	}

	get mainProfile() {
		return this.stockProfiles[0]
	}

	get state() {
		return this.#lens.state
	}

	registerController(id: string, controller: Controller<any>) {
		this.#controllers.set(id, controller)
		const profile = this.#getProfileForInput(id) ?? this.mainProfile
		controller.bindings = profile.bindings
		return () => { this.#controllers.delete(id) }
	}

	async load() {
		await this.#vault.load()
		this.#updateAllControllers()
	}

	async upsertProfile(profile: Profile) {
		await this.#mutate(s => {
			s.customProfiles = mappy(s.customProfiles, map => map.set(profile.id, profile))
		})
	}

	async deleteProfile(id: string) {
		await this.#mutate(s => {
			s.customProfiles = mappy(s.customProfiles, map => map.delete(id))
			s.controllerSettings = s.controllerSettings.filter(x => x.profileId !== id)
		})
	}

	async upsertInputSettings(settings: GamepadSettings) {
		await this.#mutate(s => {
			s.controllerSettings = mappy(s.controllerSettings, map => map.set(settings.id, settings))
		})
	}

	async deleteInputSettings(id: string) {
		await this.#mutate(s => {
			s.controllerSettings = mappy(s.controllerSettings, map => map.delete(id))
		})
	}

	async #mutate(fn: (s: typeof this.state) => void) {
		await this.#lens.mutate(s => fn(s))
		this.#updateAllControllers()
		await this.#vault.save()
	}

	#updateAllControllers() {
		for (const id of this.#controllers.keys()) {
			const profile = this.#getProfileForInput(id) ?? this.mainProfile
			const controller = this.#controllers.get(id)
			if (controller)
				controller.bindings = profile.bindings
		}
	}

	#getProfileForInput(id: string) {
		const profiles = mappify([...this.stockProfiles, ...this.state.customProfiles])
		const inputSettings = mappify(this.state.controllerSettings)
		const input = inputSettings.get(id)
		if (!input) return undefined
		return profiles.get(input.profileId)
	}
}

