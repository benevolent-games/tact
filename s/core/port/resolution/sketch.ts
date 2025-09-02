//
// import {obMap} from "@e280/stz"
// import {isPressed} from "../utils/is-pressed.js"
// import {Bindings} from "../../bindings/types.js"
//
// export function precook(bindings: Bindings) {
// 	const values = new Float32Array(countForks(bindings))
// 	const previous = new Float32Array(countForks(bindings))
//
// 	let index = 0
// 	const actions = (
// 		obMap(bindings, bracket =>
// 			obMap(bracket, () => {
// 				const i = index++
// 				const getValue = () => (values.at(i) ?? 0)
// 				const getPrevious = () => (previous.at(i) ?? 0)
// 				return new Action(getValue, getPrevious)
// 			})
// 		)
// 	)
//
// 	return {actions, values, previous}
// }
//
// function countForks(bindings: Bindings) {
// 	let count = 0
// 	for (const bracket of Object.values(bindings)) {
// 		for (const _ of Object.keys(bracket))
// 			count++
// 	}
// 	return count
// }
//
// export class Action {
// 	#getValue: () => number
// 	#getPrevious: () => number
//
// 	constructor(
// 			getValue: () => number,
// 			getPrevious: () => number,
// 		) {
// 		this.#getValue = getValue
// 		this.#getPrevious = getPrevious
// 	}
//
// 	get value() {
// 		return this.#getValue()
// 	}
//
// 	get previous() {
// 		return this.#getPrevious()
// 	}
//
// 	get changed() { return this.value !== this.previous }
// 	get pressed() { return isPressed(this.value) }
// 	get down() { return !isPressed(this.previous) && isPressed(this.value) }
// 	get up() { return isPressed(this.previous) && !isPressed(this.value) }
// }
//
