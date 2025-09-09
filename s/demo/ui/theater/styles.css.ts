

import {css} from "lit"
import {cssReset} from "@e280/sly"
export const styles = css`

${cssReset}

canvas {
	image-rendering: crisp-edges;

	display: block;
	width: 100%;
	height: auto;
	aspect-ratio: 2 / 1;
	background: #000;
	border: 2px solid #fff2;
}

`

