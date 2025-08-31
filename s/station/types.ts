
import {Action} from "./parts/action.js"

export type Actions<B extends Bindings> = {
	[Mode in keyof B]: {
		[K in keyof B[Mode]]: Action
	}
}

export type Sample = [code: string, value: number]
export type SampleMap = Map<string, number>

export type Timing = (
	| DirectTiming
	| TapTiming
	| HoldTiming
)

export type DirectTiming = {style: "direct"}
export type TapTiming = {style: "tap", holdTime?: number}
export type HoldTiming = {style: "hold", holdTime?: number}

export type LensSettings = {
	scale: number
	invert: boolean
	deadzone: number
	timing: Timing
}

export type Lens = {
	code: string
	settings?: Partial<LensSettings>
}

export type LensState = {
	lastValue: number
	holdStart: number
}

export type Spoon = {
	lenses: Lens[]
	required?: Lens[]
	forbidden?: Lens[]
}

export type Fork = Spoon[]

export type Bracket = {
	[action: string]: Spoon[]
}

export type Bindings = {
	[mode: string]: Bracket
}

export type AsBindings<B extends Bindings> = B

export function asBindings<B extends Bindings>(bindings: B) {
	return bindings
}

export const switchboardMode = "switchboard" as const

export type AsSwitchboardBindings<B extends Bindings> = {
	[switchboardMode]: {
		shimmyNext: Spoon[],
		shimmyPrevious: Spoon[],
	}
} & B

export type SwitchboardBindings = AsSwitchboardBindings<Bindings>

