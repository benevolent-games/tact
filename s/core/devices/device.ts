
import {Sample} from "./types.js"

export abstract class Device {
	abstract samples(): Iterable<Sample>

	;*[Symbol.iterator]() {
		for (const sample of this.samples())
			yield sample
	}
}

