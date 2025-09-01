
import {Hub} from "../hub.js"
import {AsHubBindings, Bindings} from "../types.js"

export function hubBindings<B extends Bindings>(b: B): AsHubBindings<B> {
	return {
		...b,
		[Hub.mode]: {
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
