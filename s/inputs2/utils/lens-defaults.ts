
import {LensSettings, LensState} from "../types.js"

export const defaultHoldTime = 250

export function defaultLensState(): LensState {
	return {
		lastValue: 0,
		holdStart: 0,
	}
}

export function defaultLensSettings(): LensSettings {
	return {
		scale: 1,
		invert: false,
		deadzone: 0.2,
		timing: {style: "direct"},
	}
}

export function defaultifyLensSettings(partial: Partial<LensSettings> = {}): LensSettings {
	return {
		...defaultLensSettings(),
		...partial,
	}
}

