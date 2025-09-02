
import {Action} from "./action.js"

export type Bindings = {[mode: string]: Bracket}
export type Bracket = {[action: string]: Atom}

export type Code = ["code", string, settings?: Partial<CodeSettings>]
export type And = ["and", ...Atom[]]
export type Or = ["or", ...Atom[]]
export type Not = ["not", Atom]
export type Cond = ["cond", Atom, guard: Atom]
export type Mods = ["mods", Atom, modifiers: Partial<Modifiers>]

export type Atom = string | (
	| Code
	| And
	| Or
	| Not
	| Cond
	| Mods
)

export type CodeSettings = {
	scale: number
	invert: boolean
	deadzone: number
	timing: (
		| ["direct"]
		| ["tap", holdTime?: number]
		| ["hold", holdTime?: number]
	)
}

export type CodeState = {
	settings: CodeSettings
	lastValue: number
	holdStart: number
}

export type Modifiers = {
	ctrl: boolean
	alt: boolean
	shift: boolean
	meta: boolean
}

export type AsBindings<B extends Bindings> = B

export function asBindings<B extends Bindings>(bindings: B) {
	return bindings
}

export type Actions<B extends Bindings> = {
	[Mode in keyof B]: {
		[K in keyof B[Mode]]: Action
	}
}

export const hubMode = "hub" as const

export type HubBindings = AsBindings<{
	[hubMode]: {
		shimmyNext: Atom
		shimmyPrevious: Atom
	}
}>

export type HubFriendlyBindings = Bindings & HubBindings

