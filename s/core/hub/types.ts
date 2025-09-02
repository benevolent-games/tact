
import {AsBindings, Atom, Bindings} from "../bindings/types.js"

export const hubMode = "hub" as const

export type HubBindings = AsBindings<{
	[hubMode]: {
		shimmyNext: Atom
		shimmyPrevious: Atom
	}
}>

export type HubFriendlyBindings = Bindings & HubBindings

