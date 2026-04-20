
import {Act} from "./types.js"
import {littleEndian, size} from "./parts/consts.js"

export function encodeActivity(acts: Act[]) {
	const length = acts.length * size
	const buffer = new ArrayBuffer(length)
	const view = new DataView(buffer)

	for (const [i, [index, value]] of acts.entries()) {
		const offset = i * size
		view.setUint16(offset, index, littleEndian)
		view.setFloat32(offset + 2, value, littleEndian)
	}

	return new Uint8Array(buffer)
}

