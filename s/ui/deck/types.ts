
import {Bindings} from "../../core/types.js"

export type Id = string

export type Profile = {
	label: string
	bindings: Bindings
}

export type DeckState = {
	customProfiles: [profileId: Id, profile: Profile][]
	profileAssignments: [controllerId: Id, profileId: Id][]
}

