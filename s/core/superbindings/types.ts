
export type Bindings = {[mode: string]: Bracket}
export type Bracket = {[action: string]: Atom}

export type Code = ["code", string, settings?: Partial<Settings>]
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

export type Settings = {
	scale: number
	invert: boolean
	deadzone: number
	timing: (
		| ["direct"]
		| ["tap", holdTime?: number]
		| ["hold", holdTime?: number]
	)
}

export type Modifiers = {
	ctrl: boolean
	alt: boolean
	shift: boolean
	meta: boolean
}

export function asBindings<B extends Bindings>(bindings: B) {
	return bindings
}

asBindings({
	normal: {
		forward: "KeyW",
		jump: ["or", "Space", "gamepad.a"],

		// ctrl+q
		menu: ["cond", "KeyQ", ["and",
			["or", "ControlLeft", "ControlRight"],
			["not", ["or", "ShiftLeft", "ShiftRight"]],
			["not", ["or", "MetaLeft", "MetaRight"]],
			["not", ["or", "AltLeft", "AltRight"]],
		]],

		// ctrl+e
		inventory: ["mods", "KeyE", {ctrl: true}],
	},
})

