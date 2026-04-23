
import {GMap} from "@e280/stz"
import {tmax} from "./utils/tmax.js"
import {tmin} from "./utils/tmin.js"
import {Bindings} from "./bindings.js"
import {Sample} from "./device/types.js"
import {lensAlgo} from "./utils/lens-algo.js"
import {SampleMap} from "./utils/sample-map.js"
import {ActivityTuple} from "./activity/types.js"
import {encodeActivity} from "./activity/encode.js"
import {defaultCodeState} from "./utils/defaults.js"
import {Atom, CodeSettings, CodeState} from "./types.js"

export function makeResolver(bindings: Bindings<any>) {
	const sampleMap = new SampleMap()
	const codeStates = new GMap<string, CodeState>()
	const activityMap = new GMap<number, number>()

	for (const bind of bindings.list())
		activityMap.set(bind.id, 0)

	const resolveCode = (now: number, path: string[], code: string, settings?: Partial<CodeSettings>) => {
		const state = codeStates.guarantee(
			path.join("/"),
			() => defaultCodeState(["code", code, settings], now),
		)
		const value = sampleMap.get(code) ?? 0
		return lensAlgo(now, state, value)
	}

	const resolveAtomForPath = (now: number, path: string[]) => (atom: Atom, zone: string | number): number => {
		const nextPath = [
			...path,
			String(zone),
			typeof atom === "string" ? atom : atom[0],
		]

		const resolveAtom = resolveAtomForPath(now, nextPath)

		if (typeof atom === "string")
			return resolveCode(now, nextPath, atom)

		else switch (atom[0]) {
			case "code": {
				const [, code, settings] = atom
				return resolveCode(now, nextPath, code, settings)
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

	return (now: number, samples: Iterable<Sample>) => {
		const tuples: ActivityTuple[] = []

		for (const sample of samples)
			sampleMap.merge(sample)

		for (const bind of bindings.list()) {
			const value = resolveAtomForPath(now, [])(bind.atom, bind.mode as string)
			const previous = activityMap.get(bind.id)
			if (value !== previous) {
				activityMap.set(bind.id, value)
				tuples.push([bind.id, value])
			}
		}

		return encodeActivity(tuples)
	}
}

