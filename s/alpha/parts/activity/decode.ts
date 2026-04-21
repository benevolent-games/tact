
import {count} from "@e280/stz"
import {ActivityTuple} from "./types.js"
import {littleEndian, size} from "./consts.js"

export function* decodeActivity(bytes: Uint8Array) {
	const n = bytes.byteLength / size
	if (!Number.isInteger(n)) throw new Error("invalid activity bytes length")

	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)

	for (const i of count(n)) {
		const offset = i * size
		const index = view.getUint16(offset, littleEndian)
		const value = view.getFloat32(offset + 2, littleEndian)
		yield [index, value] as ActivityTuple
	}
}

