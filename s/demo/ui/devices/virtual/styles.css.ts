
import {css} from "lit"
import {cssReset} from "@e280/sly"
export const styles = css`

${cssReset}

:host {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.row {
	display: flex;
	align-items: center;
	justify-content: center;
}

.column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

[view="nub-stick"] {
	width: 3em;
}

button {
	font-size: 1em;
}

`

