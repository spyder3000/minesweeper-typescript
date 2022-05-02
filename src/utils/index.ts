import React from "react";
import { MAX_COLS, MAX_ROWS, NUM_OF_BOMBS } from "../constants";
import { Cell, CellValue, CellState } from "../types";

const grabAllAdjacentCells = (
	cells: Cell[][],
	rowParam: number,
	colParam: number
): {
	topLeftCell: Cell | null;
	topCell: Cell | null;
	topRightCell: Cell | null;
	leftCell: Cell | null;
	rightCell: Cell | null;
	bottomLeftCell: Cell | null;
	bottomCell: Cell | null;
	bottomRightCell: Cell | null;
} => {
	const topLeftCell =
		rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
	const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
	const topRightCell =
		rowParam > 0 && colParam < MAX_COLS - 1
			? cells[rowParam - 1][colParam + 1]
			: null;
	const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
	const rightCell =
		colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
	const bottomLeftCell =
		rowParam < MAX_ROWS - 1 && colParam > 0
			? cells[rowParam + 1][colParam - 1]
			: null;
	const bottomCell =
		rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
	const bottomRightCell =
		rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
			? cells[rowParam + 1][colParam + 1]
			: null;

	return {
		topLeftCell,
		topCell,
		topRightCell,
		leftCell,
		rightCell,
		bottomLeftCell,
		bottomCell,
		bottomRightCell,
	};
};

// type the output of this fn -- an array of an array of Cell elements
export const generateCells = (): Cell[][] => {
	// array of another array that contains this object
	// const cells: { value: CellValue; state: CellState }[][] = [];
	let cells: Cell[][] = [];

	// Note:  Enum will have this info -- value = -1 is a bomb;  0 is empty; 1-8 for 1-8 bombs

	// Generating all the cells
	for (let row = 0; row < MAX_ROWS; row++) {
		cells.push([]);
		for (let col = 0; col < MAX_COLS; col++) {
			cells[row].push({
				value: CellValue.none,
				state: CellState.open,
			});
		}
	}

	// Randomly add bombs;
	let bombsPlaced = 0;
	while (bombsPlaced < NUM_OF_BOMBS) {
		const randomRow = Math.floor(Math.random() * MAX_ROWS);
		const randomCol = Math.floor(Math.random() * MAX_COLS);
		const currentCell = cells[randomRow][randomCol];

		// prevents the same cell from being selected twice
		// console.log("compare: ", currentCell.value, CellValue.bomb);
		if (currentCell.value === CellValue.bomb) continue;
		cells[randomRow][randomCol] = {
			// state: cells[randomRow][randomCol].state,   // rewritten in line below
			...cells[randomRow][randomCol],
			value: CellValue.bomb,
		};
		bombsPlaced++;
	}

	// Calculate the numbers for each cell
	for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
		for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
			const currentCell = cells[rowIndex][colIndex];
			if (currentCell.value === CellValue.bomb) continue;

			let numberOfBombs = 0;
			const {
				topLeftCell,
				topCell,
				topRightCell,
				leftCell,
				rightCell,
				bottomLeftCell,
				bottomCell,
				bottomRightCell,
			} = grabAllAdjacentCells(cells, rowIndex, colIndex);

			// if (topLeftBomb && topLeftBomb.value === CellValue.bomb) numberOfBombs++;    // rewritten in line below
			if (topLeftCell?.value === CellValue.bomb) numberOfBombs++;
			if (topCell?.value === CellValue.bomb) numberOfBombs++;
			if (topRightCell?.value === CellValue.bomb) numberOfBombs++;
			if (leftCell?.value === CellValue.bomb) numberOfBombs++;
			if (rightCell?.value === CellValue.bomb) numberOfBombs++;
			if (bottomLeftCell?.value === CellValue.bomb) numberOfBombs++;
			if (bottomCell?.value === CellValue.bomb) numberOfBombs++;
			if (bottomRightCell?.value === CellValue.bomb) numberOfBombs++;

			if (numberOfBombs > 0) {
				cells[rowIndex][colIndex] = {
					...currentCell,
					value: numberOfBombs,
				};
			}
		}
	}

	return cells;
};

export const openMultipleCells = (
	cells: Cell[][],
	rowParam: number,
	colParam: number
): Cell[][] => {
	const currentCell = cells[rowParam][colParam];

	if (
		currentCell.state === CellState.visible ||
		currentCell.state === CellState.flagged
	) {
		return cells;
	}

	let newCells = cells.slice();
	newCells[rowParam][colParam].state = CellState.visible;

	const {
		topLeftCell,
		topCell,
		topRightCell,
		leftCell,
		rightCell,
		bottomLeftCell,
		bottomCell,
		bottomRightCell,
	} = grabAllAdjacentCells(cells, rowParam, colParam);

	// for Top Left Cell, check if a value of 'None' exists.  If so, check for neighbors of that cell also.
	//   If a non-zero number, then just show that value.
	if (
		topLeftCell?.state === CellState.visible &&
		topLeftCell.value !== CellValue.bomb
	) {
		if (topLeftCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
		} else {
			newCells[rowParam - 1][colParam - 1].state = CellState.visible;
		}
	}

	// Condition 2
	if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
		if (topCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam - 1, colParam);
		} else {
			newCells[rowParam - 1][colParam].state = CellState.visible;
		}
	}

	// Condition 3
	if (
		topRightCell?.state === CellState.open &&
		topRightCell.value !== CellValue.bomb
	) {
		if (topRightCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
		} else {
			newCells[rowParam - 1][colParam + 1].state = CellState.visible;
		}
	}

	// Condition 4
	if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
		if (leftCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam, colParam - 1);
		} else {
			newCells[rowParam][colParam - 1].state = CellState.visible;
		}
	}

	// Condition 5
	if (
		rightCell?.state === CellState.open &&
		rightCell.value !== CellValue.bomb
	) {
		if (rightCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam, colParam + 1);
		} else {
			newCells[rowParam][colParam + 1].state = CellState.visible;
		}
	}

	// Condition 6
	if (
		bottomLeftCell?.state === CellState.open &&
		bottomLeftCell.value !== CellValue.bomb
	) {
		if (bottomLeftCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
		} else {
			newCells[rowParam + 1][colParam - 1].state = CellState.visible;
		}
	}

	// Condition 7
	if (
		bottomCell?.state === CellState.open &&
		bottomCell.value !== CellValue.bomb
	) {
		if (bottomCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam + 1, colParam);
		} else {
			newCells[rowParam + 1][colParam].state = CellState.visible;
		}
	}

	// Condition 8
	if (
		bottomRightCell?.state === CellState.open &&
		bottomRightCell.value !== CellValue.bomb
	) {
		if (bottomRightCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
		} else {
			newCells[rowParam + 1][colParam + 1].state = CellState.visible;
		}
	}

	// return updated cells
	return newCells;
};
