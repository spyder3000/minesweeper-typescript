import React from "react";
// import { MAX_COLS, MAX_ROWS, NUM_OF_BOMBS } from "../constants";
import { Cell, CellValue, CellState, Difficulty } from "../types";
import {
	MAX_ROWS_EASY,
	MAX_COLS_EASY,
	NUM_OF_BOMBS_EASY,
	MAX_ROWS_INT,
	MAX_COLS_INT,
	NUM_OF_BOMBS_INT,
} from "../constants";

const grabAllAdjacentCells = (
	cells: Cell[][],
	rowParam: number,
	colParam: number,
	gridParams: GameParams
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
		rowParam > 0 && colParam < gridParams.totCols - 1
			? cells[rowParam - 1][colParam + 1]
			: null;
	const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
	const rightCell =
		colParam < gridParams.totCols - 1 ? cells[rowParam][colParam + 1] : null;
	const bottomLeftCell =
		rowParam < gridParams.totRows - 1 && colParam > 0
			? cells[rowParam + 1][colParam - 1]
			: null;
	const bottomCell =
		rowParam < gridParams.totRows - 1 ? cells[rowParam + 1][colParam] : null;
	const bottomRightCell =
		rowParam < gridParams.totRows - 1 && colParam < gridParams.totCols - 1
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

interface GameParams {
	totRows: number;
	totCols: number;
	totBombs: number;
}

const getParams = (diff: Difficulty): GameParams => {
	if (diff == Difficulty.easy) {
		return {
			totRows: MAX_ROWS_EASY,
			totCols: MAX_COLS_EASY,
			totBombs: NUM_OF_BOMBS_EASY,
		};
	} else if (diff === Difficulty.intermediate) {
		return {
			totRows: MAX_ROWS_INT,
			totCols: MAX_COLS_INT,
			totBombs: NUM_OF_BOMBS_INT,
		};
	}
	return {
		totRows: MAX_ROWS_EASY,
		totCols: MAX_COLS_EASY,
		totBombs: NUM_OF_BOMBS_EASY,
	};
};
// type the output of this fn -- an array of an array of Cell elements
export const generateCells = (diff: Difficulty): Cell[][] => {
	// array of another array that contains this object
	// const cells: { value: CellValue; state: CellState }[][] = [];
	let cells: Cell[][] = [];
	let gridParams: GameParams = getParams(diff);
	// Note:  Enum will have this info -- value = -1 is a bomb;  0 is empty; 1-8 for 1-8 bombs

	// Generating all the cells
	for (let row = 0; row < gridParams.totRows; row++) {
		cells.push([]);
		for (let col = 0; col < gridParams.totCols; col++) {
			cells[row].push({
				value: CellValue.none,
				state: CellState.open,
			});
		}
	}

	// Randomly add bombs;
	let bombsPlaced = 0;
	while (bombsPlaced < gridParams.totBombs) {
		const randomRow = Math.floor(Math.random() * gridParams.totRows);
		const randomCol = Math.floor(Math.random() * gridParams.totCols);
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
	for (let rowIndex = 0; rowIndex < gridParams.totRows; rowIndex++) {
		for (let colIndex = 0; colIndex < gridParams.totCols; colIndex++) {
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
			} = grabAllAdjacentCells(cells, rowIndex, colIndex, gridParams);

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
	colParam: number,
	diff: Difficulty
): Cell[][] => {
	let gridParams: GameParams = getParams(diff);
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
	} = grabAllAdjacentCells(cells, rowParam, colParam, gridParams);

	// for Top Left Cell, check if a value of 'None' exists.  If so, check for neighbors of that cell also.
	//   If a non-zero number, then just show that value.
	if (
		topLeftCell?.state === CellState.open &&
		topLeftCell.value !== CellValue.bomb
	) {
		if (topLeftCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1, diff);
		} else {
			newCells[rowParam - 1][colParam - 1].state = CellState.visible;
		}
	}

	// Condition 2
	if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
		if (topCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam - 1, colParam, diff);
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
			newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1, diff);
		} else {
			newCells[rowParam - 1][colParam + 1].state = CellState.visible;
		}
	}

	// Condition 4
	if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
		if (leftCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam, colParam - 1, diff);
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
			newCells = openMultipleCells(newCells, rowParam, colParam + 1, diff);
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
			newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1, diff);
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
			newCells = openMultipleCells(newCells, rowParam + 1, colParam, diff);
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
			newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1, diff);
		} else {
			newCells[rowParam + 1][colParam + 1].state = CellState.visible;
		}
	}

	// return updated cells
	return newCells;
};
