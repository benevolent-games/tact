
import {AsSeatedBindings, Bindings} from "../types.js"

export function seatedBindings<B extends Bindings>(b: B): AsSeatedBindings<B> {
	return {
		...b,
		meta: {
			playerNext: [
				{lenses: [{code: "BracketRight"}]},
				{lenses: [{code: "pad.right"}], required: [{code: "pad.gamma"}]},
				{lenses: [{code: "pad.bumper.right"}], required: [{code: "pad.gamma"}]},
			],
			playerPrevious: [
				{lenses: [{code: "BracketLeft"}]},
				{lenses: [{code: "pad.left"}], required: [{code: "pad.gamma"}]},
				{lenses: [{code: "pad.bumper.left"}], required: [{code: "pad.gamma"}]},
			],
		},
	}
}
