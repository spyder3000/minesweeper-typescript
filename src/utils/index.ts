import { MAX_COLS, MAX_ROWS } from "../constants";
import { Cell, CellValue, CellState } from "../types";

// type the output of this fn -- an array of an array of Cell elements
export const generateCells = (): Cell[][] => {
	// array of another array that contains this object
	// const cells: { value: CellValue; state: CellState }[][] = [];
	const cells: Cell[][] = [];

	// value = -1 is a bomb;  0 is empty; 1-8 for 1-8 bombs
	for (let row = 0; row < MAX_ROWS; row++) {
		cells.push([]);
		for (let col = 0; col < MAX_COLS; col++) {
			cells[row].push({
				value: CellValue.none,
				state: CellState.open,
			});
		}
	}
	return cells;
};
