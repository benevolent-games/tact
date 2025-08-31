
import {MapG, SetG, obMap, pipe} from "@e280/stz"
import {tmax} from "../inputs/utils/tmax.js"
import {Device} from "../inputs/parts/device.js"
import {isPressed} from "../inputs/utils/is-pressed.js"
import {normalizeSamples} from "../inputs/utils/normalize-samples.js"
import {Bindings, BracketBinds, LensBind, LensSettings, SpoonBind} from "../inputs/types.js"

export class Player<B extends Bindings> {
	modes = new SetG<keyof B>()
	devices = new SetG<Device>()

	#bindings: B
	#structure: ReturnType<typeof generate_actions_structure>

	constructor(bindings: B) {
		this.#bindings = bindings
		this.#structure = generate_actions_structure(bindings, this.modes)
	}

	get actions() {
		return this.#structure.actions
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(bindings: B) {
		this.#bindings = bindings
		this.#structure = generate_actions_structure(bindings, this.modes)
	}

	poll(now: number) {
		const samples = collect_samples(...this.devices)
		this.#structure.update({now, samples})
	}
}

export function collect_samples(...devices: Device[]) {
	return pipe(devices)
		.to(d => d.flatMap(device => device.takeSamples()))
		.to(normalizeSamples)
		.to(samples => new Map(samples))
		.done()
}

export type Context = {
	now: number
	samples: Map<string, number>
}

export function generate_actions_structure<B extends Bindings>(
		bindings: B,
		modes: Set<keyof B>,
	) {

	let context: Context = {now: 0, samples: new Map()}
	const refreshers: (() => void)[] = []
	const lenses = new MapG<LensBind, {lastValue: number, holdStart: number}>()

	const resolveBracket = (bracket: BracketBinds, mode: any) => {
		const actions = obMap(bracket, (fork, actionKey) => {
			refreshers.push(() => actions[actionKey] = resolveFork(fork, mode))
			return resolveFork(fork, mode)
		})
		return actions
	}

	const resolveFork = (fork: SpoonBind[], mode: any) => {
		const isModeActive = modes.has(mode)
		if (!isModeActive) return 0
		return tmax(fork.map(resolveSpoon))
	}

	const resolveSpoon = ({lenses, required = [], forbidden = []}: SpoonBind) => {
		const satisfiedRequirements = () => {
			if (required.length === 0) return true
			const requiredValues = required.map(resolveLens)
			return !requiredValues.some(value => value <= 0)
		}

		const satisfiedForbiddens = () => {
			if (forbidden.length === 0) return true
			const forbiddenValues = forbidden.map(resolveLens)
			return !forbiddenValues.some(value => value > 0)
		}

		const combineValues = () => {
			const values = lenses.map(resolveLens)
			return tmax(values)
		}

		return (satisfiedRequirements() && satisfiedForbiddens())
			? combineValues()
			: 0
	}

	const resolveLens = (lens: LensBind) => {
		const state = lenses.guarantee(lens, () => ({
			lastValue: 0,
			holdStart: context.now,
		}))

		const {code} = lens
		const value = context.samples.get(code) ?? 0

		const defaultHoldTime = 250
		const settings: LensSettings = {
			scale: 1,
			invert: false,
			deadzone: 0.2,
			timing: {style: "direct"},
			...lens.settings,
		}

		const {timing} = settings

		const holdTime = (
			timing.style === "direct"
				? undefined
				: timing.holdTime
		) ?? defaultHoldTime

		const isFreshlyPressed = !isPressed(state.lastValue) && isPressed(value)
		const isFreshlyReleased = isPressed(state.lastValue) && !isPressed(value)
		const isHolding = (context.now - state.holdStart) >= holdTime

		if (isFreshlyPressed)
			state.holdStart = context.now

		state.lastValue = value

		switch (timing.style) {
			case "direct":
				return value

			case "tap":
				return (isFreshlyReleased && !isHolding)
					? 1
					: 0

			case "hold":
				return (isPressed(value) && isHolding)
					? value
					: 0
		}
	}

	return {
		actions: obMap(bindings, resolveBracket) as ActionSnapshot<B>,
		update: (replacement: Context) => {
			context = replacement
			for (const refresh of refreshers)
				refresh()
		},
	}
}

export type ActionSnapshot<B extends Bindings> = {
	[Mode in keyof B]: {
		[K in keyof B[Mode]]: number
	}
}

