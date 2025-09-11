
import {css} from "lit"
import {cssReset} from "@e280/sly"

export const style = css`
${cssReset}

:host {
	--nub-size: 60%;
	--nub-color: #fff8;

	position: relative;
	display: block;

	cursor: default;
	user-select: none;

	width: 6em;
	height: auto;
	aspect-ratio: 1 / 1;

	background: #0008;
	border-radius: 100%;
	outline: 1px solid color-mix(in srgb, transparent, var(--nub-color) 10%);
}

:host * {
	pointer-events: none;
}

.frame {
	position: absolute;
	inset: 0;
	margin: auto;

	width: 100%;
	height: auto;
	aspect-ratio: 1 / 1;

	> div {
		position: absolute;
		inset: 0;
		margin: auto;
		width: var(--nub-size);
		height: auto;
		aspect-ratio: 1 / 1;
		border-radius: 100%;
	}
}

.inner {
	outline: 1px solid color-mix(in srgb, transparent, var(--nub-color) 10%);
}

.outer {
	outline: 1px solid color-mix(in srgb, transparent, var(--nub-color) 10%);
}

.stickbase {
	display: none;
	background: color-mix(in srgb, transparent, var(--nub-color) 25%);
}

.stickunder {
	background: color-mix(in srgb, transparent, var(--nub-color) 50%);
}

.stick {
	background: #fff8;
}

`

