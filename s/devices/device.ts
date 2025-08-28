
import {sub} from "@e280/stz"

export abstract class Device {
	abstract dispose: () => void
	onInput = sub<[string, number]>()
	poll() {}
}

