
import {LensSettings} from "../../bindings/types.js"

export type LensState = {
	settings: LensSettings
	lastValue: number
	holdStart: number
}

