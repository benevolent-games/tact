
import {Bindings} from "../core/types.js"

export type Profile = {
	id: string
	label: string
	bindings: Bindings
}

export type GamepadSettings = {
	id: string
	profileId: string
}

export type Preferences = {
	customProfiles: Profile[]
	controllerSettings: {id: string, profileId: string}[]
}

