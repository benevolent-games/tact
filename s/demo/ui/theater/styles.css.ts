
import {css} from "lit"
import {cssReset} from "@e280/sly"
export const styles = css`

${cssReset}

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

	[tact="ports"] {
		position: absolute;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.ports {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	width: 100%;
	gap: 0.4em;
	padding: 0 1em;

	header {
		text-align: center;
	}

	.port {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;

		gap: 0.4em;
		padding: 0.4em;

		color: var(--color);
		border-radius: 0.5em;
		background: #0004;

		> * {
			overflow: hidden;
			background: color-mix(in lch, transparent, var(--color) 20%);
			border-radius: 0.5em;
			box-shadow: .1em .2em .5em #0007;
			&[device] {
				color: color-mix(in lch, white, var(--color) 50%);
			}
		}

		&:not([data-active]) {
			color: #ccc6;
			> * { background: #5552; }
		}
	}
}

`

