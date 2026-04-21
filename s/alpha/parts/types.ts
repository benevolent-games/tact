
import {Action} from "./action.js"

export type Actions<S extends Shape<any>> = {
	[M in keyof S]: {
		[A in keyof S[M]]: Action
	}
}

export type BindingsData = {[mode: string]: Bracket}
export type Shape<B extends BindingsData> = {[MK in keyof B]: {[AK in keyof B[MK]]: number}}
export type Bracket = {[action: string]: Atom}

export type AsBindingsData<B extends BindingsData> = B
export const asBindingsData = <B extends BindingsData>(b: B) => b

export type Bind<B extends BindingsData> = {
	id: number
	mode: keyof B
	action: keyof B[keyof B]
	atom: Atom
}

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
	clamp: null | [number, number]
	range: null | [number, number]
	bottom: null | number
	top: null | number
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

