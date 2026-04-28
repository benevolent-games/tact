
import {Activity} from "../types.js"
import {mergeActivity} from "./merge.js"
import {littleEndian, size} from "./consts.js"

export function encodeActivity(activity: Activity[]) {
	activity = mergeActivity(activity)
	const length = activity.length * size
	const buffer = new ArrayBuffer(length)
	const view = new DataView(buffer)

	for (let i = 0; i < activity.length; i++) {
		const [index, value] = activity[i]
		const offset = i * size
		view.setUint16(offset, index, littleEndian)
		view.setFloat32(offset + 2, value, littleEndian)
	}

	return new Uint8Array(buffer)
}

