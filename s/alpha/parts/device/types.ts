
export type Sample = [code: string, value: number]

export type Device = {
	samples(): Iterable<Sample>
}

