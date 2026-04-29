
import {deep, GMap} from "@e280/stz"
import {Cubby, Prism, Vault, Versioned} from "@e280/strata"
import {mappy} from "./utils/mappy.js"
import {Bindings} from "../core/types.js"
import {mappify} from "./utils/mappify.js"
import {GamepadSettings, Preferences, Profile} from "./types.js"

export class Configurator {
	readonly stockProfiles

	#vault
	#prism
	#lens
	#inputs = new GMap<string, (bindings: Bindings) => void>()

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

	registerInput<B extends Bindings>(id: string, setBindings: (bindings: B) => void) {
		this.#inputs.set(id, setBindings as any)
		const profile = this.#getProfileForInput(id) ?? this.mainProfile
		setBindings(profile.bindings as any)
		return () => { this.#inputs.delete(id) }
	}

	async load() {
		await this.#vault.load()
		this.#updateAllInputs()
	}

	async upsertProfile(profile: Profile) {
		await this.#mutate(s => {
			s.customProfiles = mappy(s.customProfiles, map => map.set(profile.id, profile))
		})
	}

	async deleteProfile(id: string) {
		await this.#mutate(s => {
			s.customProfiles = mappy(s.customProfiles, map => map.delete(id))
			s.inputSettings = s.inputSettings.filter(x => x.profileId !== id)
		})
	}

	async upsertInputSettings(settings: GamepadSettings) {
		await this.#mutate(s => {
			s.inputSettings = mappy(s.inputSettings, map => map.set(settings.id, settings))
		})
	}

	async deleteInputSettings(id: string) {
		await this.#mutate(s => {
			s.inputSettings = mappy(s.inputSettings, map => map.delete(id))
		})
	}

	async #mutate(fn: (s: typeof this.state) => void) {
		await this.#lens.mutate(s => fn(s))
		this.#updateAllInputs()
		await this.#vault.save()
	}

	#updateAllInputs() {
		for (const id of this.#inputs.keys()) {
			const profile = this.#getProfileForInput(id) ?? this.mainProfile
			this.#inputs.get(id)?.(profile.bindings)
		}
	}

	#getProfileForInput(id: string) {
		const profiles = mappify([...this.stockProfiles, ...this.state.customProfiles])
		const inputSettings = mappify(this.state.inputSettings)
		const input = inputSettings.get(id)
		if (!input) return undefined
		return profiles.get(input.profileId)
	}
}

