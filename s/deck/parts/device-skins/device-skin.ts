
import {Content} from "@e280/sly"
import {Hex, WeakMapG} from "@e280/stz"
import {DeviceIcons} from "./device-icons.js"
import {Device} from "../../../core/devices/device.js"
import {ColorDispenser} from "../../../utils/dispensers.js"

export class DeviceSkin {
	constructor(
		public icon: Content,
		public label: string,
		public color: string,
	) {}
}

export class DeviceSkins {
	icons = new DeviceIcons()
	#map = new WeakMapG<Device, DeviceSkin>()
	#colors = new ColorDispenser()

	get(device: Device) {
		return this.#map.guarantee(device, () => new DeviceSkin(
			this.icons.get(device.constructor as any),
			Hex.random(4),
			this.#colors.takeFirst(),
		))
	}
}

