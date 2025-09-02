
import {isPressed} from "./utils/is-pressed.js"

export class Action {
	constructor(
		public value: number,
		public previous: number,
	) {}

	get changed() { return this.value !== this.previous }
	get pressed() { return isPressed(this.value) }
	get down() { return !isPressed(this.previous) && isPressed(this.value) }
	get up() { return isPressed(this.previous) && !isPressed(this.value) }
}

