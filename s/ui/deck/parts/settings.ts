
import {Cubby, RMap} from "@e280/strata"
import {DeckState, Id, Profile} from "../types.js"
import {shiftLimit} from "../../../utils/shift-limit.js"

const limit = 256

export class Settings {
	profileAssignments = new RMap<Id, Id>()
	customProfiles = new RMap<Id, Profile>()

	constructor(private store: Cubby<DeckState>) {}

	async save() {
		await this.store.set({
			customProfiles: shiftLimit(limit, this.customProfiles.array()),
			profileAssignments: shiftLimit(limit, this.profileAssignments.array()),
		})
	}

	async load() {
		const state = await this.store.get()
		this.customProfiles.clear()
		this.profileAssignments.clear()
		this.customProfiles.setEntries(state?.customProfiles ?? [])
		this.profileAssignments.setEntries(state?.profileAssignments ?? [])
	}
}

