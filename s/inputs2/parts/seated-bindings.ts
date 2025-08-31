
import {AsSeatedBindings, Bindings} from "../types.js"

export function seatedBindings<B extends Bindings>(b: B): AsSeatedBindings<B> {
	return {
		...b,
		meta: {
			playerNext: [
				{lenses: [{code: "BracketRight"}]},
				{lenses: [{code: "gamepad.right"}], required: [{code: "gamepad.gamma"}]},
				{lenses: [{code: "gamepad.bumper.right"}], required: [{code: "gamepad.gamma"}]},
			],
			playerPrevious: [
				{lenses: [{code: "BracketLeft"}]},
				{lenses: [{code: "gamepad.left"}], required: [{code: "gamepad.gamma"}]},
				{lenses: [{code: "gamepad.bumper.left"}], required: [{code: "gamepad.gamma"}]},
			],
		},
	}
}
