
import {Scalar} from "@benev/math"
import {MapG, sub} from "@e280/stz"

export function tmin(values: number[]) {
	return values.length > 0
		? Math.min(...values)
		: 0
}

export function tmax(values: number[]) {
	return values.length > 0
		? Math.max(...values)
		: 0
}

export function applyDeadzone(value: number, deadzone: number) {
	if (value < deadzone)
		return 0

	if (value > 1)
		return value

	return Scalar.remap(
		value,
		deadzone, 1,
		0, 1,
	)
}

export type Valuable = {value: number}

export class Cause implements Valuable {
	value = 0
}

export type Timing = (
	| [style: "eager"]
	| [style: "tap", holdMs?: number]
	| [style: "hold", holdMs?: number]
)

export type LensSettings = {
	scale: number
	invert: boolean
	deadzone: number
	timing: Timing
}

export class Lens implements Valuable {
	settings: LensSettings

	constructor(public target: Valuable, settings: Partial<LensSettings> = {}) {
		this.settings = {
			scale: 1,
			invert: false,
			deadzone: 0.1,
			timing: ["eager"],
			...settings,
		}
	}

	get value() {
		const {settings} = this
		let {value} = this.target
		value = applyDeadzone(value, settings.deadzone)
		if (settings.invert) value = value * -1
		return value * settings.scale
	}
}

export class Report {
	constructor(
		public code: string,
		public value: number,
	) {}
}

export abstract class Group implements Valuable {
	constructor(public members: Valuable[]) {}

	abstract combine(values: number[]): number

	get value() {
		const values = this.members.map(c => c.value)
		return this.combine(values)
	}
}

export class Spoon extends Group {
	combine(values: number[]) {
		return tmin(values)
	}
}

export class Fork extends Group {
	combine(values: number[]) {
		return tmax(values)
	}
}

export class Action {
	value = 0
	previous = 0
	on = sub<[Action]>()

	constructor(public fork: Group) {}

	get isChanged() {
		return this.value !== this.previous
	}

	update() {
		this.previous = this.value
		this.value = this.fork.value
		if (this.isChanged)
			this.on.pub(this)
	}
}

export abstract class Device {
	abstract getReports(): Report[]
}

export type CauseBind = {
	code: string
	settings?: Partial<LensSettings>
}

export type Binds = {
	[action: string]: CauseBind[][]
}

export class Inputs<B extends Binds> {
	actions: {[K in keyof B]: Action}
	#actions: Action[] = []
	#causes = new MapG<string, Cause>()

	constructor(binds: B, public devices = new Set<Device>()) {
		this.actions = this.#build_actions(binds)
	}

	poll() {
		this.#reset_causes_to_zero()
		this.#update_causes_with_reports_from_devices()
		this.#update_actions()
	}

	#build_actions(binds: B) {
		const actions = {} as {[K in keyof B]: Action}

		for (const [name, data] of Object.entries(binds)) {
			const spoons = data.map(actionBinds => {
				const lenses = actionBinds.map(({code, settings}) => {
					const cause = this.#causes.guarantee(code, () => new Cause())
					return new Lens(cause, settings)
				})
				return new Spoon(lenses)
			})
			const fork = new Fork(spoons)
			const action = new Action(fork)
			this.#actions.push(action)
			actions[name as keyof B] = action
		}

		return actions
	}

	#reset_causes_to_zero() {
		for (const cause of this.#causes.values())
			cause.value = 0
	}

	#update_causes_with_reports_from_devices() {
		const aggregated = new MapG<string, number[]>()

		for (const device of this.devices) {
			for (const report of device.getReports()) {
				const values = aggregated.guarantee(report.code, () => [])
				values.push(report.value)
			}
		}

		for (const [code, values] of aggregated) {
			const cause = this.#causes.get(code)
			if (cause) cause.value = tmax(values)
		}
	}

	#update_actions() {
		for (const action of this.#actions)
			action.update()
	}
}

