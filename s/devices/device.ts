
import {sub} from "@e280/stz"

export abstract class GripDevice {
	abstract dispose: () => void
	onInput = sub<[string, number]>()
	poll() {}
}

