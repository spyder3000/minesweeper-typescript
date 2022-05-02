import React from "react";
import { CellState, CellValue } from "../../types";

import "./Button.scss";

interface ButtonProps {
	row: number;
	col: number;
	state: CellState;
	value: CellValue;
}

// Immediately de-structure props into row, col (as specified in our Interface)
const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => {
	const renderContent = (): React.ReactNode => {
		if (state === CellState.visible) {
			if (value === CellValue.bomb) {
				return (
					<span role="img" aria-label="bomb">
						💣
					</span>
				);
			} else if (value === CellValue.none) {
				return null;
			}
			return value; // will return number (representing # of bombs in vicinity )
		} else if (state == CellState.flagged) {
			return (
				<span role="img" aria-label="flag">
					🚩
				</span>
			);
		}
		return null;
	};
	return (
		<div
			className={`Button ${
				state === CellState.visible ? "visible" : ""
			} value-${value}`}
		>
			{renderContent()}
		</div>
	);
};

export default Button;
