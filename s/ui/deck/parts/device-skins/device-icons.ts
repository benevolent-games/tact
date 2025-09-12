
import {Content} from "@e280/sly"
import {Constructor} from "@e280/stz"
import {Device} from "../../../../core/devices/device.js"
import {VpadDevice} from "../../../../core/devices/standard/vpad.js"
import {PrimaryDevice} from "../../../../core/devices/standard/primary.js"
import {GamepadDevice} from "../../../../core/devices/standard/gamepad.js"

export type DeviceIconEntry = [DeviceClass: Constructor<Device>, icon: Content]

export class DeviceIcons {
	fallback: Content = "❔"
	#map = new Map<Constructor<Device>, Content>()

	constructor(entries: DeviceIconEntry[] = [
			[PrimaryDevice, "💻"],
			[GamepadDevice, "🎮"],
			[VpadDevice, "📱"],
		]) {
		this.add(...entries)
	}

	get(DeviceClass: Constructor<Device>) {
		return this.#map.get(DeviceClass) ?? this.fallback
	}

	add(...entries: DeviceIconEntry[]) {
		for (const [dc, icon] of entries)
			this.#map.set(dc, icon)
		return this
	}

	clear() {
		this.#map.clear()
		return this
	}
}

