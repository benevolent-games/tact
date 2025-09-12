
import {Sample} from "./types.js"

export abstract class Device {
	abstract getSamples(): Iterable<Sample>

	;[Symbol.iterator]() {
		return this.getSamples()
	}
}

