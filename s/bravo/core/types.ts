
import {GMap} from "@e280/stz"
import {Atom} from "./atom/types.js"

/** json-friendly description of how samples are interpreted */
export type Bindings = {[mode: string]: {[action: string]: Atom}}

/** describes the shape of how bindings relate to the binds index (useful on serverside) */
export type BindingsShape<B extends Bindings> = {[MK in keyof B]: {[AK in keyof B[MK]]: number}}

/** integer-indexed flat map of bindings info (for efficient networking) */
export type BindingsTable<B extends Bindings> = GMap<number, BindingsRow<B>>

/** the binding for a single action */
export type BindingsRow<B extends Bindings> = {
	id: number
	mode: keyof B
	action: keyof B[keyof B]
	atom: Atom
}

/** produces user input samples (eg, a keyboard produces samples) */
export type Device = {samples(): Iterable<Sample>}

/** raw user input, eg, `["KeyW", 1]` */
export type Sample = [code: string, value: number]

/** efficiently express resolved values */
export type Stamp = [id: number, value: number]

export const asBindings = <B extends Bindings>(b: B) => b
export type AsBindings<B extends Bindings> = B

// export type Actions<S extends Shape<any>> = {
// 	[M in keyof S]: {
// 		[A in keyof S[M]]: Action
// 	}
// }

