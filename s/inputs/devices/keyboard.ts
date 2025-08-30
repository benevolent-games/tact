
import {ev} from "@e280/stz"
import {modprefix} from "../utils/modprefix.js"
import {SamplerDevice} from "../parts/device.js"

export class KeyboardDevice extends SamplerDevice {
	dispose: () => void

	constructor(target: EventTarget) {
		super()

		const dispatch = (event: KeyboardEvent, value: number) => {
			const {code} = event
			this.setSample(code, value)
			this.setSample(modprefix(event, code), value)
		}

		this.dispose = ev(target, {
			keydown: (event: KeyboardEvent) => dispatch(event, 1),
			keyup: (event: KeyboardEvent) => dispatch(event, 0),
		})
	}
}

