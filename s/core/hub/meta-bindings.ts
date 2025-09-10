
import {MetaBindings, metaMode} from "./types.js"

export const makeMetaBindings = (): MetaBindings => ({
	[metaMode]: {
		shimmyNext: ["or",
			"BracketRight",
			["and", "gamepad.gamma", "gamepad.right"],
			["and", "gamepad.gamma", "gamepad.bumper.right"],
		],
		shimmyPrevious: ["or",
			"BracketLeft",
			["and", "gamepad.gamma", "gamepad.left"],
			["and", "gamepad.gamma", "gamepad.bumper.left"],
		],
	},
})

