
import {Intent} from "../types.js"
import {littleEndian, size} from "./consts.js"
import {dataViewFrom} from "../../utils/data-view.js"

export function decodeIntents(bytes: Uint8Array) {
	const n = bytes.byteLength / size
	if (!Number.isInteger(n)) throw new Error("invalid bytes length")

	const data = dataViewFrom(bytes)
	const intents: Intent[] = new Array<Intent>(n)

	for (let i = 0; i < n; i++) {
		const offset = i * size
		const index = data.getUint16(offset, littleEndian)
		const value = data.getFloat32(offset + 2, littleEndian)
		intents.push([index, value])
	}

	return intents
}

