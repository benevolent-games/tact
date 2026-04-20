
import {GMap} from "@e280/stz"
import {Bindings} from "./bindings.js"
import {Sample} from "./device/types.js"
import {lensAlgo} from "./parts/lens-algo.js"
import {SampleMap} from "./parts/sample-map.js"
import {tmax, tmin} from "../utils/quick-math.js"
import {ActivityTuple} from "./activity/types.js"
import {encodeActivity} from "./activity/encode.js"
import {defaultCodeState} from "./parts/defaults.js"
import {Atom, BindingsData, CodeSettings, CodeState} from "./types.js"

export class Controller<B extends BindingsData> {
	#now = 0
	#bindings
	#sampleMap = new SampleMap()
	#codeStates = new GMap<string, CodeState>()
	#activityMap = new GMap<number, number>()

	constructor(bindings: Bindings<B>) {
		this.#bindings = bindings
		for (const bind of bindings.list())
			this.#activityMap.set(bind.id, 0)
	}

	update(now: number, samples: Iterable<Sample>) {
		this.#now = now
		const tuples: ActivityTuple[] = []

		for (const sample of samples)
			this.#sampleMap.merge(sample)

		for (const bind of this.#bindings.list()) {
			const value = this.#resolveAtom([])(bind.atom, bind.mode as string)
			const previous = this.#activityMap.get(bind.id)
			if (value !== previous) {
				this.#activityMap.set(bind.id, value)
				tuples.push([bind.id, value])
			}
		}

		return encodeActivity(tuples)
	}

	#resolveCode(path: string[], code: string, settings?: Partial<CodeSettings>) {
		const state = this.#codeStates.guarantee(
			path.join("/"),
			() => defaultCodeState(["code", code, settings], this.#now),
		)
		const value = this.#sampleMap.get(code) ?? 0
		return lensAlgo(this.#now, state, value)
	}

	#resolveAtom = (path: string[]) => (atom: Atom, zone: string | number): number => {
		const nextPath = [
			...path,
			String(zone),
			typeof atom === "string" ? atom : atom[0],
		]

		const resolveAtom = this.#resolveAtom(nextPath)

		if (typeof atom === "string")
			return this.#resolveCode(nextPath, atom)

		else switch (atom[0]) {
			case "code": {
				const [, code, settings] = atom
				return this.#resolveCode(nextPath, code, settings)
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
				const value = resolveAtom(subject, "subject")
				return (value > 0) ? 0 : 1
			}
			case "cond": {
				const [, subject, guard] = atom
				return (resolveAtom(guard, "guard") > 0)
					? resolveAtom(subject, "subject")
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
				]], "guard")
				return (guard > 0)
					? resolveAtom(subject, "subject")
					: 0
			}
		}
	}
}

