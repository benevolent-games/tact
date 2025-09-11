
import {Dispenser} from "@e280/stz"

export class ColorDispenser extends Dispenser<string> {
	constructor() {
		super(() => [
			"#0fa",
			"#0af",
			"#a0f",
			"#fa0",
			"#af0",
			"#f0a",
		])
	}
}

export class LetterDispenser extends Dispenser<string> {
	constructor() {
		super(() => [..."abcdefghijklmnopqrstuvwxyz"])
	}
}

