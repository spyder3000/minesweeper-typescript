// enum -- a set of named constants;
export enum CellValue {
	none = 0, // with no number specified, this would still default to 0;  e.g. none,
	one = 1,
	two = 2,
	three = 3,
	four = 4,
	five = 5,
	six = 6,
	seven = 7,
	eight = 8,
	bomb = -1,
}
export enum CellState {
	open, // already revealed number
	visible, // visible for selection
	flagged, // flagged as a bomb
}

export type Cell = { value: CellValue; state: CellState; red?: boolean };

export enum Face {
	smile = "🙂",
	oh = "😮",
	lost = "😵",
	won = "😎",
}

export enum Difficulty {
	easy,
	intermediate,
	expert,
}
