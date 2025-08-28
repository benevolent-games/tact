
import {Cause} from "./cause.js"
import {CauseSpoon} from "./cause-spoon.js"

/** group of spoons with an OR relationship */
export class CauseFork extends Cause {
	constructor(public spoons: Set<CauseSpoon>, isModeActive: () => boolean) {
		super()

		this.input.intercept = value => (isModeActive() ? value : 0)
		this.pressed.intercept = value => (isModeActive() ? value : false)

		// forward tap events
		for (const spoon of spoons) {
			if (spoon.interpreter.style === "tap") {
				spoon.interpreter.tap.input.on(tapped => this.input.on.pub(tapped))
				spoon.interpreter.tap.pressed.on(tapped => this.pressed.on.pub(tapped))
			}
		}
	}

	update() {
		let input = 0
		let pressed = false

		for (const spoon of this.spoons) {
			spoon.update()
			input += spoon.amalgam.input.value
			pressed ||= spoon.amalgam.pressed.value
		}

		this.input.value = input
		this.pressed.value = pressed
	}
}

