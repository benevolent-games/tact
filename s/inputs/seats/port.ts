
import {Device} from "../parts/device.js"

export class Port {
	constructor(
		public seatId: number,
		public devices: Device[],
	) {}
}

