
import {obMap} from "@e280/stz"
import {BindingsData, Shape} from "./types.js"
import {makeCodebook} from "./parts/codebook.js"

export class Bindings<B extends BindingsData> {
	#data
	#codebook

	constructor(data: B) {
		this.#data = data
		this.#codebook = makeCodebook(data)
	}

	get shape() {
		const shape = obMap(this.#data, bracket => obMap(bracket, () => 0)) as any
		for (const [index, [mode, action]] of this.#codebook)
			shape[mode][action] = index
		return shape as Shape<B>
	}

	getBind(index: number) {
		const [mode, action] = this.#codebook.require(index)
		return {mode, action}
	}

	getAtom(index: number) {
		const [mode, action] = this.#codebook.require(index)
		return this.#data[mode][action]
	}
}

