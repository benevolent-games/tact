
export type Timing = (
	| {style: "direct"}
	| {style: "tap", time?: number}
	| {style: "hold", time?: number}
)

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

export type ModeBinds = {
	[action: string]: SpoonBind[]
}

export type Bindings = {
	[mode: string]: ModeBinds
}

