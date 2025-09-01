
import {Sample} from "../../types.js"

export abstract class Controller {
	abstract takeSamples(): Sample[]
}

