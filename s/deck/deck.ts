
import {debounce} from "@e280/stz"
import {Cubby} from "@e280/strata"
import {Port} from "./port.js"
import {Runtime} from "./parts/runtime.js"
import {Controller} from "./controller.js"
import {Profiles} from "./parts/profiles.js"
import {Settings} from "./parts/settings.js"
import {Bindings, Device} from "../core/types.js"
import {DeckState, Profile, ProfileKey} from "./types.js"

export class Deck {
	profiles
	settings
	#runtime = new Runtime()

	constructor(options: {
			store: Cubby<DeckState>
			stockProfiles: Record<ProfileKey, Profile>
		}) {
		this.settings = new Settings(options.store)
		this.profiles = new Profiles(options.stockProfiles, this.settings.customProfiles)
	}

	async load() {
		await this.settings.load()
		for (const controller of this.#runtime.controllers.keys())
			this.#applyControllerProfile(controller)
	}

	#save = debounce(100, () => this.settings.save())

	get ports() {
		return this.#runtime.ports.array()
	}

	createPort() {
		const port = new Port(this.#runtime)
		this.#runtime.ports.add(port)
		return port
	}

	deletePort(port: Port) {
		this.#runtime.ports.delete(port)
	}

	createController<B extends Bindings = Bindings, D extends Device = Device>(
			handle: string,
			bindings: B,
			device: D,
		) {
		const controller = new Controller(handle, bindings, device)
		this.#runtime.controllers.add(controller)
		return controller
	}

	deleteController(controller: Controller) {
		this.#runtime.controllers.delete(controller)
		this.#runtime.portAssignments.delete(controller)
	}

	async assignControllerProfile(controller: Controller, profileKey: ProfileKey) {
		this.settings.profileAssignments.set(controller.handle, profileKey)
		this.#applyControllerProfile(controller)
		await this.#save()
	}

	queryController(controller: Controller) {
		const port = this.#runtime.portAssignments.get(controller)
		const profileKey = this.settings.profileAssignments.get(controller.handle)
		const profile = this.profiles.get(profileKey)
		return {controller, port, profileKey, profile}
	}

	#applyControllerProfile(controller: Controller) {
		const profileKey = this.settings.profileAssignments.get(controller.handle)
		controller.bindings = this.profiles.get(profileKey).bindings
	}
}

