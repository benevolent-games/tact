
import {Hex} from "@e280/stz"
import {Sample} from "./types.js"

export abstract class Controller {
	id = Hex.random()

	abstract takeSamples(): Sample[]
}

