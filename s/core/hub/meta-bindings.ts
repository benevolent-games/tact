
import {MetaBindings, metaMode} from "./types.js"

export const makeMetaBindings = (): MetaBindings => ({
	[metaMode]: {
		shimmyNext: ["or",
			"BracketRight",
			["and", ["or", "gamepad.beta", "gamepad.gamma"], "gamepad.right"],
			["and", ["or", "gamepad.beta", "gamepad.gamma"], "gamepad.bumper.right"],
		],
		shimmyPrevious: ["or",
			"BracketLeft",
			["and", ["or", "gamepad.beta", "gamepad.gamma"], "gamepad.left"],
			["and", ["or", "gamepad.beta", "gamepad.gamma"], "gamepad.bumper.left"],
		],
	},
})

