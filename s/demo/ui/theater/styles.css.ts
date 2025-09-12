
import {css} from "lit"
export const styles = css`

:host {
	display: flex;
	flex-direction: column;
	align-items: center;

	gap: 1em;
}

.surface {
	position: relative;
	width: 100%;
	height: auto;
	aspect-ratio: 2 / 1;
	overflow: hidden;

	background: #000;
	border: 0.5em solid #fff4;
	border-radius: 2em;

	canvas {
		display: block;
		position: absolute;
		inset: 0;

		width: 100%;
		height: 100%;

		image-rendering: pixelated;
		outline: 1px solid red;
	}

	[deck="overlay"] {
		position: absolute;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.dlist {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 0.5em;
}

`

