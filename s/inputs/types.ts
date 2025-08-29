
export type Sample = [code: string, value: number]

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

export type LensBind = {
	code: string
	settings?: Partial<LensSettings>
}

export type SpoonBind = {
	lenses: LensBind[]
	required?: LensBind[]
	forbidden?: LensBind[]
}

export type BracketBinds = {
	[action: string]: SpoonBind[]
}

export type Bindings = {
	[mode: string]: BracketBinds
}

