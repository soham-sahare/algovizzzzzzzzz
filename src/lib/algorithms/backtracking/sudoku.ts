
export type SudokuStep = {
    grid: number[][];
    activeCell?: { r: number, c: number };
    val?: number;
    isValid?: boolean;
    message: string;
    lineNumber?: number;
}

export function* generateSudokuSteps(initialGrid: number[][]): Generator<SudokuStep> {
    const grid = initialGrid.map(row => [...row]); // Deep copy outer

    function isSafe(row: number, col: number, num: number): boolean {
        // Check Row
        for (let x = 0; x <= 8; x++) if (grid[row][x] === num) return false;
        // Check Col
        for (let x = 0; x <= 8; x++) if (grid[x][col] === num) return false;
        // Check 3x3
        const startRow = row - (row % 3);
        const startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    function* solve(): Generator<SudokuStep, boolean, unknown> {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) {
                    // Try 1-9
                    for (let num = 1; num <= 9; num++) {
                        yield { 
                            grid: JSON.parse(JSON.stringify(grid)), 
                            activeCell: { r, c },
                            val: num,
                            message: `Trying ${num} at (${r}, ${c})`, 
                            lineNumber: 3 
                        };

                        if (isSafe(r, c, num)) {
                            grid[r][c] = num;
                            yield { 
                                grid: JSON.parse(JSON.stringify(grid)), 
                                activeCell: { r, c },
                                val: num,
                                isValid: true,
                                message: `Valid! Recurse.`, 
                                lineNumber: 4 
                            };

                            if (yield* solve()) return true;

                            grid[r][c] = 0;
                            yield { 
                                grid: JSON.parse(JSON.stringify(grid)), 
                                activeCell: { r, c },
                                val: 0,
                                message: `Backtrack. Resetting (${r}, ${c})`, 
                                lineNumber: 6 
                            };
                        } else {
                             yield { 
                                grid: JSON.parse(JSON.stringify(grid)), 
                                activeCell: { r, c },
                                val: num,
                                isValid: false,
                                message: `Invalid! ${num} conflicts.`, 
                                lineNumber: 3 
                            };
                        }
                    }
                    return false; // Tried 1-9, none worked
                }
            }
        }
        return true;
    }

    yield { 
        grid: JSON.parse(JSON.stringify(grid)), 
        message: "Start Sudoku Solver", 
        lineNumber: 1 
    };

    yield* solve();
}
