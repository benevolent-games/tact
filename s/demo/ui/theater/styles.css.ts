
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

canvas {
	image-rendering: crisp-edges;

	display: block;
	width: 100%;
	height: auto;
	aspect-ratio: 2 / 1;
	background: #000;
	border: 0.5em solid #fff4;
	border-radius: 2em;
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

	> * {
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
	}
}

`

