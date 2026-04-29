
import {AsBindings, Atom} from "../bindings/types.js"

export const metaMode = "meta" as const

export type MetaBindings = AsBindings<{
	[metaMode]: {
		revealOverlay: Atom
		shimmyNext: Atom
		shimmyPrevious: Atom
	}
}>

