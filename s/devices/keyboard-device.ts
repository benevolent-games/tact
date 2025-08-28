
import {ev} from "@e280/stz"
import {Device} from "./device.js"
import {modprefix} from "../utils/modprefix.js"

export class KeyboardDevice extends Device {
	dispose: () => void

	constructor(target: EventTarget, fn = (_event: KeyboardEvent) => {}) {
		super()

		const dispatch = (event: KeyboardEvent, value: number) => {
			const {code} = event
			fn(event)
			this.onInput.pub(code, value)
			this.onInput.pub(`${modprefix(event)}-${code}`, value)
		}

		this.dispose = ev(target, {
			keydown: (event: KeyboardEvent) => dispatch(event, 1),
			keyup: (event: KeyboardEvent) => dispatch(event, 0),
		})
	}
}

