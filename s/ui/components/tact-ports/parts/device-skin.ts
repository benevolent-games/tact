
import {Content} from "@e280/sly"
import {WeakMapG} from "@e280/stz"
import {Device} from "../../../../core/devices/device.js"
import {DeviceIcons, renderDeviceIcon} from "./device-icons.js"
import {ColorDispenser, LetterDispenser} from "../../../../utils/dispensers.js"

export class DeviceSkin {
	constructor(
		public label: Content,
		public icon: Content,
		public color: string,
	) {}
}

export const prepDeviceSkins = (icons: DeviceIcons) => {
	const map = new WeakMapG<Device, DeviceSkin>()
	const colors = new ColorDispenser()
	const letters = new LetterDispenser()

	return () => (device: Device) => {
		return map.guarantee(device, () => new DeviceSkin(
			letters.takeFirst(),
			renderDeviceIcon(device, icons),
			colors.takeFirst(),
		))
	}
}

