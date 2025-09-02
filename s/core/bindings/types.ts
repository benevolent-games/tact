
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

export const hubMode = "hub" as const

export type HubBindings = AsBindings<{
	[hubMode]: {
		shimmyNext: Spoon[],
		shimmyPrevious: Spoon[],
	}
}>

export type HubFriendlyBindings = Bindings & HubBindings

