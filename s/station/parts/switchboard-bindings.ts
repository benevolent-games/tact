
import {Switchboard} from "../switchboard.js"
import {AsSwitchboardBindings, Bindings} from "../types.js"

export function switchboardBindings<B extends Bindings>(b: B): AsSwitchboardBindings<B> {
	return {
		...b,
		[Switchboard.mode]: {
			shimmyNext: [
				{lenses: [{code: "BracketRight"}]},
				{lenses: [{code: "gamepad.right"}], required: [{code: "gamepad.gamma"}]},
				{lenses: [{code: "gamepad.bumper.right"}], required: [{code: "gamepad.gamma"}]},
			],
			shimmyPrevious: [
				{lenses: [{code: "BracketLeft"}]},
				{lenses: [{code: "gamepad.left"}], required: [{code: "gamepad.gamma"}]},
				{lenses: [{code: "gamepad.bumper.left"}], required: [{code: "gamepad.gamma"}]},
			],
		},
	}
}
