import React, { useState, useEffect } from "react";
import Button from "../Button";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import { Cell, CellState, CellValue, Face } from "../../types";
import "./App.scss";

// React.FC -- TS of React Functional Component
const App: React.FC = () => {
	const [cells, setCells] = useState<Cell[][]>(generateCells());
	const [face, setFace] = useState<Face>(Face.smile);
	const [time, setTime] = useState<number>(0);
	const [live, setLIve] = useState<boolean>(false); // indicates game has begun;
	const [bombCounter, setBombCounter] = useState<number>(10);
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

	// define as a fn that returns a fn
	const handleCellClick = (rowParam: number, colParam: number) => (): void => {
		console.log(rowParam, colParam);
		// Start Game
		if (!live) {
			// TODO;  make sure you don't click on bomb with first move
			setLIve(true);
		}

		const currentCell = cells[rowParam][colParam];
		let newCells = cells.slice(); // shallow copy of cells

		// don't do anything if we click on a space that is a flag (or already visible)
		if (
			currentCell.state === CellState.flagged ||
			currentCell.state === CellState.visible
		)
			return;

		if (currentCell.value === CellValue.bomb) {
			// TODO:  take care of bomb click !
		} else if (currentCell.value === CellValue.none) {
			newCells = openMultipleCells(newCells, rowParam, colParam);
			setCells(newCells);
		} else {
			newCells[rowParam][colParam].state = CellState.visible;
			setCells(newCells);
		}
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
		if (live) {
			setLIve(false);
			setTime(0);
			setCells(generateCells());
		}
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
					row={rowIndex}
					col={colIndex}
				/>
			))
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
