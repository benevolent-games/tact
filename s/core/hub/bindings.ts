
import {HubBindings, hubMode} from "../bindings/types.js"

export const hubBindings = (): HubBindings => ({
	[hubMode]: {
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
})

