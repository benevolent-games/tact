
export function tmax(values: number[]) {
	return values.length > 0
		? Math.max(...values)
		: 0
}

export function tmin(values: number[]) {
	return values.length > 0
		? Math.min(...values)
		: 0
}

