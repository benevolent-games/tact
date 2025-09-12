
import {Dispenser, range} from "@e280/stz"

const palette = (n: number) => range(n).map(i => {
	const d = (i * (360 / n)) + 180
	return `hsl(${d % 360}deg, 100%, 50%)`
})

export class ColorDispenser extends Dispenser<string> {
	constructor() {
		super(() => palette(12))
	}
}

export class LetterDispenser extends Dispenser<string> {
	constructor() {
		super(() => [..."abcdefghijklmnopqrstuvwxyz"])
	}
}

