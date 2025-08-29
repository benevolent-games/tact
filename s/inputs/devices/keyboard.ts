
import {ev, sub} from "@e280/stz"
import {Sample} from "../types.js"
import {Device} from "../parts/device.js"
import {Sampler} from "../utils/sampler.js"
import {modprefix} from "../utils/modprefix.js"

export class KeyboardDevice extends Device {
	on = sub<Sample>()
	dispose: () => void
	#sampler = new Sampler()

	constructor(target: EventTarget) {
		super()

		const publish = (code: string, value: number) => {
			this.#sampler.set(code, value)
			this.on.pub(code, value)
		}

		const dispatch = (event: KeyboardEvent, value: number) => {
			const {code} = event
			publish(code, value)
			publish(modprefix(event, code), value)
		}

		this.dispose = ev(target, {
			keydown: (event: KeyboardEvent) => dispatch(event, 1),
			keyup: (event: KeyboardEvent) => dispatch(event, 0),
		})
	}

	samples() {
		return this.#sampler.samples()
	}
}

