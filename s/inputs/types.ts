
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

export type AsBindings<B extends Bindings> = B

export function asBindings<B extends Bindings>(bindings: B) {
	return bindings
}

export type AsSeatedBindings<B extends Bindings> = {
	meta: {
		playerNext: SpoonBind[],
		playerPrevious: SpoonBind[],
	}
} & B

export type SeatedBindings = AsSeatedBindings<Bindings>

