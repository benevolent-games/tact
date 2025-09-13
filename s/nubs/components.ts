
import {dom} from "@e280/sly"
import {NubLookpad} from "./lookpad/component.js"
import {NubStick} from "./stick/component.js"
import {NubVpad} from "./vpad/component.js"

export const nubs = () => ({
	NubLookpad,
	NubStick,
	NubVpad,
})

export const registerNubs = () => dom.register(nubs())

