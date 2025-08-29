
import {Sample} from "./sample.js"

export abstract class Device {
	abstract samples(): Sample[]
}

