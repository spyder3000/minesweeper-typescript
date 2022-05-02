import React, { useState, useEffect } from "react";
import Button from "../Button";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import { Cell, CellState, CellValue, Face } from "../../types";
import "./App.scss";
import { MAX_ROWS, MAX_COLS } from "../../constants";

// React.FC -- TS of React Functional Component
const App: React.FC = () => {
	const [cells, setCells] = useState<Cell[][]>(generateCells());
	const [face, setFace] = useState<Face>(Face.smile);
	const [time, setTime] = useState<number>(0);
	const [live, setLive] = useState<boolean>(false); // indicates game has begun;
	const [bombCounter, setBombCounter] = useState<number>(10);
	const [hasLost, setHasLost] = useState<boolean>(false);
	const [hasWon, setHasWon] = useState<boolean>(false);
	console.log("cells", cells);

	useEffect(() => {
		const handleMouseDown = (): void => {
			setFace(Face.oh);
		};
		const handleMouseUp = (): void => {
			setFace(Face.smile);
		};
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);

		// Component Did Unmount (save memory)
		return () => {
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mousedup", handleMouseUp);
		};
	}, []);

	// useEffect for Starting the Timer
	useEffect(() => {
		// We aren't allowing timer to go past 999
		if (live && time < 999) {
			const timer = setInterval(() => {
				setTime(time + 1);
			}, 1000);

			// component did UnMount ( to save memory)
			return () => {
				clearInterval(timer);
			};
		}
	}, [live, time]); // will fire when live indicator changes OR time changes

	// useEffect for Losing Game
	useEffect(() => {
		if (hasLost) {
			setLive(false);
			setFace(Face.lost);
		}
	}, [hasLost]); // will fire when hasLost indicator has changed -- Game Over (loss)

	// useEffect for winning Game
	useEffect(() => {
		if (hasWon) {
			setLive(false);
			setFace(Face.won);
		}
	}, [hasWon]); // will fire when hasWin indicator has changed -- Game Over (win)

	// define as a fn that returns a fn
	const handleCellClick = (rowParam: number, colParam: number) => (): void => {
		let newCells = cells.slice(); // shallow copy of cells

		// start the game
		if (!live) {
			let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
			while (isABomb) {
				newCells = generateCells();
				if (newCells[rowParam][colParam].value !== CellValue.bomb) {
					isABomb = false;
					break;
				}
			}
			setLive(true);
		}
		const currentCell = newCells[rowParam][colParam];

		// don't do anything if we click on a space that is a flag (or already visible)
		if (
			currentCell.state === CellState.flagged ||
			currentCell.state === CellState.visible
		)
			return;

		if (currentCell.value === CellValue.bomb) {
			setHasLost(true);
			newCells[rowParam][colParam].red = true;
			newCells = showAllBombs();
			setCells(newCells);
			return;
		} else if (currentCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam, colParam);
		} else {
			newCells[rowParam][colParam].state = CellState.visible;
		}

		// Check to see if user has won (no more available spaces)
		let safeOpenCellsExists = false;
		for (let row = 0; row < MAX_ROWS; row++) {
			for (let col = 0; col < MAX_COLS; col++) {
				const currentCell = newCells[row][col];
				if (
					currentCell.value !== CellValue.bomb &&
					currentCell.state === CellState.open
				) {
					safeOpenCellsExists = true;
					break;
				}
			}
		}

		// Win condition;  Display screen -- show flags for all bombs
		if (!safeOpenCellsExists) {
			newCells = newCells.map((row) =>
				row.map((cell) => {
					if (cell.value === CellValue.bomb) {
						return {
							...cell,
							state: CellState.flagged,
						};
					}
					return cell;
				})
			);
			setHasWon(true);
		}
		setCells(newCells);
	};

	const handleCellContext =
		(rowParam: number, colParam: number) =>
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
			console.log("Right click");
			e.preventDefault(); // prevents menu from opening (usual activity for rt-click)

			// do not allow flags if game hasn't started
			if (!live) return;

			const currentCells = cells.slice(); // make copy of all cells;
			const currentCell = cells[rowParam][colParam]; // copies current cell

			if (currentCell.state === CellState.visible) return;

			if (currentCell.state === CellState.open) {
				currentCells[rowParam][colParam].state = CellState.flagged;
				setCells(currentCells); // update state vars
				setBombCounter(bombCounter - 1); // reduce bomb counter
			}
			// Remove a flag & set to open again
			else if (currentCell.state === CellState.flagged) {
				currentCells[rowParam][colParam].state = CellState.open;
				setCells(currentCells);
				setBombCounter(bombCounter + 1);
			}
		};

	// For clicking on Face (to reset game)
	const handleFaceClick = (): void => {
		// clear game, start over
		setLive(false);
		setTime(0);
		setCells(generateCells());
		setHasLost(false);
		setHasWon(false);
	};

	const renderCells = (): React.ReactNode => {
		return cells.map((row, rowIndex) =>
			row.map((cell, colIndex) => (
				<Button
					key={`${rowIndex}-${colIndex}`}
					state={cell.state}
					value={cell.value}
					onClick={handleCellClick}
					onContext={handleCellContext}
					red={cell.red}
					row={rowIndex}
					col={colIndex}
				/>
			))
		);
	};

	const showAllBombs = (): Cell[][] => {
		const currentCells = cells.slice();
		return currentCells.map((row) =>
			row.map((cell) => {
				if (cell.value === CellValue.bomb) {
					return {
						...cell,
						state: CellState.visible,
					};
				}

				return cell;
			})
		);
	};

	return (
		<div className="App">
			<div className="Header">
				<NumberDisplay value={bombCounter} />
				<div className="Face" onClick={handleFaceClick}>
					<span role="img" aria-label="face">
						{face}
					</span>
				</div>
				<NumberDisplay value={time} />
			</div>
			<div className="Body">{renderCells()}</div>
		</div>
	);
};
function index() {
	return <div>index</div>;
}

export default App;
