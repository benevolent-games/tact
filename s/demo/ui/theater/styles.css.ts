

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

	width: 100%;
	gap: 1em;
	padding: 0 2em;

	> * {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 1em;
		min-height: 4em;
		padding: 0.5em;

		color: var(--color);
		background: color-mix(in lch, transparent, var(--color) 10%);
		border-radius: 0.5em;

		span { font-size: 3em; }
		[view="nub-stick"] { width: 3em; }
	}

}

`

