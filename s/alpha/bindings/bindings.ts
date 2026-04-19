
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
		return obMap(this.#data, bracket => obMap(bracket, () => true)) as Shape<B>
	}

	getBind(id: number) {
		const [mode, action] = this.#codebook.require(id)
		return {mode, action}
	}

	getAtom(id: number) {
		const [mode, action] = this.#codebook.require(id)
		return this.#data[mode][action]
	}
}

