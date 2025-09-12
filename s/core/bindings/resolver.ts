
import {MapG, pub, obMap} from "@e280/stz"
import {Action} from "./action.js"
import {SampleMap} from "./sample-map.js"
import {lensAlgo} from "./parts/lens-algo.js"
import {tmax, tmin} from "../../utils/quick-math.js"
import {defaultCodeState} from "./parts/defaults.js"
import {Actions, Atom, Bindings, CodeSettings, CodeState} from "./types.js"

export class Resolver<B extends Bindings> {
	readonly actions: Actions<B>
	#modes = new Set<keyof B>()
	#sampleMap = new SampleMap()
	#now = 0
	#codeStates = new MapG<number, CodeState>()
	#update = pub()

	constructor(public bindings: B) {
		this.actions = obMap(bindings, (bracket, mode) => obMap(bracket, atom => {
			const action = new Action()
			this.#update.subscribe(() => {
				action.value = this.#modes.has(mode)
					? this.#resolveAtom()(atom)
					: 0
			})
			return action
		})) as Actions<B>
	}

	resolve(now: number, modes: Set<keyof B>, sampleMap: SampleMap) {
		this.#now = now
		this.#modes = modes
		this.#sampleMap = sampleMap
		this.#update()
		return this.actions
	}

	#resolveCode(count: number, code: string, settings?: Partial<CodeSettings>) {
		const state = this.#codeStates.guarantee(
			count,
			() => defaultCodeState(["code", code, settings]),
		)
		const value = this.#sampleMap.get(code) ?? 0
		return lensAlgo(this.#now, state, value)
	}

	#resolveAtom = (context: {count: number} = {count: 0}) => (atom: Atom): number => {
		const resolveAtom = this.#resolveAtom(context)
		if (typeof atom === "string") {
			return this.#resolveCode(context.count++, atom)
		}
		else switch (atom[0]) {
			case "code": {
				const [, code, settings] = atom
				return this.#resolveCode(context.count++, code, settings)
			}
			case "and": {
				const [,...atoms] = atom
				const values = atoms.map(resolveAtom)
				return tmin(values)
			}
			case "or": {
				const [,...atoms] = atom
				const values = atoms.map(resolveAtom)
				return tmax(values)
			}
			case "not": {
				const [, subject] = atom
				const value = resolveAtom(subject)
				return (value > 0) ? 0 : 1
			}
			case "cond": {
				const [, subject, guard] = atom
				return (resolveAtom(guard) > 0)
					? resolveAtom(subject)
					: 0
			}
			case "mods": {
				const [, subject, modifiers] = atom
				const maybe = (x: boolean, ...codes: Atom[]): Atom => x
					? ["or", ...codes]
					: ["not", ["or", ...codes]]
				const guard = resolveAtom(["cond", subject, ["and",
					maybe(modifiers.ctrl ?? false, "ControlLeft", "ControlRight"),
					maybe(modifiers.alt ?? false, "AltLeft", "AltRight"),
					maybe(modifiers.meta ?? false, "MetaLeft", "MetaRight"),
					maybe(modifiers.shift ?? false, "ShiftLeft", "ShiftRight"),
				]])
				return (guard > 0)
					? resolveAtom(subject)
					: 0
			}
		}
	}
}

