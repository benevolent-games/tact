
import {Content} from "@e280/sly"
import {Constructor} from "@e280/stz"
import {Device} from "../../../../core/devices/device.js"
import {VpadDevice} from "../../../../core/devices/standard/vpad.js"
import {PrimaryDevice} from "../../../../core/devices/standard/primary.js"
import {GamepadDevice} from "../../../../core/devices/standard/gamepad.js"

export type DeviceIcon = [DeviceClass: Constructor<Device>, icon: Content]

export type DeviceIcons = {
	fallback: Content
	kinds: DeviceIcon[]
}

export function standardDeviceIcons(more: DeviceIcon[] = []): DeviceIcons {
	return {
		fallback: "❔",
		kinds: [
			[PrimaryDevice, "💻"],
			[GamepadDevice, "🎮"],
			[VpadDevice, "📱"],
			...more,
		],
	}
}

export function renderDeviceIcon(device: Device, icons: DeviceIcons) {
	for (const [D, icon] of icons.kinds) {
		if (device instanceof D)
			return icon
	}
	return icons.fallback
}

