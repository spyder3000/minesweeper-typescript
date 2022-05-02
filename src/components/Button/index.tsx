import React from "react";
import { CellState, CellValue } from "../../types";

import "./Button.scss";

interface ButtonProps {
	row: number;
	col: number;
	red?: boolean;
	state: CellState;
	value: CellValue;
	onClick(rowParam: number, colParam: number): (...args: any[]) => void; // last part is generic fn that takes any # of arguments
	onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

// Immediately de-structure props into row, col (as specified in our Interface)
const Button: React.FC<ButtonProps> = ({
	row,
	col,
	red,
	state,
	value,
	onClick,
	onContext,
}) => {
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
			} value-${value} ${red ? "red" : ""}`}
			onClick={onClick(row, col)}
			onContextMenu={onContext(row, col)}
		>
			{renderContent()}
		</div>
	);
};

export default Button;
