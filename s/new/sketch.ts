
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

export function isPressed(value: number) {
	return value > 0
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

export class Cause {
	value = 0
}

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

export class Lens {
	settings: LensSettings
	#lastValue = 0
	#holdStartTime = 0

	constructor(public cause: Cause, settings: Partial<LensSettings> = {}) {
		this.settings = {
			scale: 1,
			invert: false,
			deadzone: 0.1,
			timing: {style: "direct"},
			...settings,
		}
	}

	poll(now: number) {
		const {settings} = this
		let {value} = this.cause
		value = applyDeadzone(value, settings.deadzone)
		if (settings.invert) value = value * -1
		value *= settings.scale
		return this.#timingConsiderations(value, now)
	}

	#timingConsiderations(value: number, now: number) {
		const {timing} = this.settings
		const threshold = (
			timing.style === "direct"
				? undefined
				: timing.time
		) ?? 50
		const isFreshlyPressed = !isPressed(this.#lastValue) && isPressed(value)
		const isFreshlyReleased = isPressed(this.#lastValue) && !isPressed(value)
		const isHolding = (now - this.#holdStartTime) >= threshold
		if (isFreshlyPressed) this.#holdStartTime = now
		this.#lastValue = value

		switch (timing.style) {
			case "direct":
				return value

			case "tap":
				return (isFreshlyReleased && !isHolding)
					? 1
					: 0

			case "hold":
				return (isFreshlyPressed && isHolding)
					? value
					: 0
		}
	}
}

export class Report {
	constructor(
		public code: string,
		public value: number,
	) {}
}

export class Spoon {
	constructor(public lenses: Lens[]) {}

	poll(now: number) {
		const values = this.lenses.map(c => c.poll(now))
		const unanimous = values.every(v => v > 0)
		return unanimous
			? tmax(values)
			: 0
	}
}

export class Fork {
	constructor(public spoons: Spoon[]) {}

	poll(now: number) {
		const values = this.spoons.map(c => c.poll(now))
		return tmax(values)
	}
}

export class Action {
	value = 0
	previous = 0
	on = sub<[Action]>()

	constructor(public fork: Fork) {}

	get isChanged() {
		return this.value !== this.previous
	}

	poll(now: number) {
		this.previous = this.value
		this.value = this.fork.poll(now)
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

	poll(now: number) {
		this.#reset_causes_to_zero()
		this.#update_causes_with_reports_from_devices()
		this.#update_actions(now)
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

	#update_actions(now: number) {
		for (const action of this.#actions)
			action.poll(now)
	}
}

