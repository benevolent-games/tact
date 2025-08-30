
import {ev, sub} from "@e280/stz"
import {Sample} from "../types.js"
import {modprefix} from "../utils/modprefix.js"
import {SamplerDevice} from "../parts/device.js"

export class KeyboardDevice extends SamplerDevice {
	on = sub<Sample>()
	dispose: () => void

	constructor(target: EventTarget) {
		super()

		const publish = (code: string, value: number) => {
			this.setSample(code, value)
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
}

