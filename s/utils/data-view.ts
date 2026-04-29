
export function dataViewFrom(array: ArrayBufferView) {
	return new DataView(array.buffer, array.byteOffset, array.byteLength)
}

