
import {obMap, WeakMapG} from "@e280/stz"
import {Action} from "../action.js"
import {Actions} from "../types.js"
import {LensState} from "./types.js"
import {Bindings, Lens} from "../../bindings/types.js"

export function zeroedResolution<B extends Bindings>(bindings: B) {
	return {
		actions: zeroedActions<B>(bindings),
		lensStates: WeakMapG<Lens, LensState>,
	}
}

export function zeroedActions<B extends Bindings>(bindings: B) {
	return obMap(bindings, zeroedBracket) as Actions<B>
}

export function zeroedBracket<B extends Bindings>(bracket: B[keyof B]) {
	return obMap(bracket, () => new Action(0, 0))
}

// export function zeroedLensStates(bindings: Bindings) {
// 	return new WeakMapG<Lens, LensState>(
// 		[...crawlLenses(bindings)]
// 			.map((lens) => [lens, {lastValue: 0, holdStart: 0}])
// 	)
// }
//
// function *crawlLenses(bindings: Bindings) {
// 	for (const bracket of Object.values(bindings)) {
// 		for (const fork of Object.values(bracket)) {
// 			for (const spoon of fork) {
// 				const lenses = [
// 					...spoon.lenses,
// 					...(spoon.required ?? []),
// 					...(spoon.forbidden ?? []),
// 				]
// 				for (const lens of lenses)
// 					yield lens
// 			}
// 		}
// 	}
// }

