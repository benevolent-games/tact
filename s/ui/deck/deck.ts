
import {Cubby} from "@e280/strata"
import {Controller} from "./controller.js"
import {Profiles} from "./parts/profiles.js"
import {Settings} from "./parts/settings.js"
import {DeckState, Id, Profile} from "./types.js"
import {ReactiveMap, ReactiveSet} from "../../utils/reactive.js"

export class Deck {
	profiles
	settings
	ports = new ReactiveSet<Id>()
	controllers = new ReactiveMap<Id, Controller>()
	portAssignments = new ReactiveMap<Id, Id | undefined>()
	#nextPortId = 1

	constructor(options: {
			store: Cubby<DeckState>
			stockProfiles: Record<Id, Profile>
		}) {
		this.settings = new Settings(options.store)
		this.profiles = new Profiles(options.stockProfiles, this.settings.customProfiles)
	}

	async load() {
		await this.settings.load()
		for (const id of this.controllers.keys())
			this.#applyControllerProfile(id)
	}

	async createPort() {
		const id = (this.#nextPortId++).toString(16)
		await this.ports.add(id)
		return id
	}

	async connectController(id: Id, controller: Controller) {
		await this.controllers.set(id, controller)
		this.#applyControllerProfile(id)
	}

	async disconnectController(id: Id) {
		await this.controllers.delete(id)
		await this.portAssignments.delete(id)
	}

	async plug(controllerId: string, port: string) {
		await this.portAssignments.set(controllerId, port)
	}

	async unplug(controllerId: string) {
		await this.portAssignments.delete(controllerId)
	}

	async assignControllerProfile(controllerId: Id, profileId: Id) {
		await this.settings.profileAssignments.set(controllerId, profileId)
		this.#applyControllerProfile(controllerId)
		await this.settings.save()
	}

	getAllControllersOnPort(id: Id) {
		return [...this.portAssignments]
			.filter(([,portId]) => portId === id)
			.map(([controllerId]) => controllerId)
	}

	queryController(id: Id) {
		const controller = this.controllers.need(id)
		const port = this.portAssignments.get(id)
		const profileId = this.settings.profileAssignments.get(id)
		const profile = this.profiles.get(profileId)
		return {id, controller, port, profileId, profile}
	}

	resolvePort(port: Id, now: number) {
		return this
			.getAllControllersOnPort(port)
			.map(id => this.controllers.need(id))
			.flatMap(controller => controller.resolveIntents(now))
	}

	#applyControllerProfile(controllerId: Id) {
		const controller = this.controllers.need(controllerId)
		const profileId = this.settings.profileAssignments.get(controllerId)
		controller.bindings = this.profiles.get(profileId).bindings
	}
}

