
import {Sample} from "../../types.js"

export abstract class Device {
	abstract takeSamples(): Sample[]
}

