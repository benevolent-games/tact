
import {LensState} from "./types.js"
import {Lens, LensSettings} from "../../bindings/types.js"

export const defaultHoldTime = 250

export function defaultLensState(lens: Lens): LensState {
	return {
		lastValue: 0,
		holdStart: 0,
		settings: defaultifyLensSettings(lens.settings),
	}
}

function defaultLensSettings(): LensSettings {
	return {
		scale: 1,
		invert: false,
		deadzone: 0.2,
		timing: {style: "direct"},
	}
}

function defaultifyLensSettings(partial: Partial<LensSettings> = {}): LensSettings {
	return {
		...defaultLensSettings(),
		...partial,
	}
}

