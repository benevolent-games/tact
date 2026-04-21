
import {ActivityTuple} from "./types.js"
import {littleEndian, size} from "./consts.js"

export function encodeActivity(tuples: ActivityTuple[]) {
	const length = tuples.length * size
	const buffer = new ArrayBuffer(length)
	const view = new DataView(buffer)

	for (const [i, [index, value]] of tuples.entries()) {
		const offset = i * size
		view.setUint16(offset, index, littleEndian)
		view.setFloat32(offset + 2, value, littleEndian)
	}

	return new Uint8Array(buffer)
}

