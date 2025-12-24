
export type NQueensStep = {
    solution: number[]; // Index = row, Value = col. -1 if empty.
    currentRow: number;
    currentCol?: number;
    message: string;
    lineNumber?: number;
    isValid?: boolean; // For coloring current placement
}

export function* generateNQueensSteps(n: number): Generator<NQueensStep> {
    const board: number[] = new Array(n).fill(-1);

    function isSafe(row: number, col: number): boolean {
        for (let prevRow = 0; prevRow < row; prevRow++) {
            const prevCol = board[prevRow];
            if (prevCol === col || Math.abs(prevCol - col) === Math.abs(prevRow - row)) {
                return false;
            }
        }
        return true;
    }

    // Helper for recursion to yield steps properly
    function* solve(row: number): Generator<NQueensStep, boolean, unknown> {
        if (row === n) {
            yield { 
                solution: [...board], 
                currentRow: -1, 
                message: "Found a valid solution!", 
                lineNumber: 7 
            };
            return true; // Found one solution, return true to stop if we only want one
        }

        for (let col = 0; col < n; col++) {
             yield { 
                solution: [...board, col, ...new Array(n - 1 - row).fill(-1)].slice(0, n), // Provisional placement visual
                currentRow: row,
                currentCol: col,
                message: `Trying Queen at Row ${row}, Col ${col}`, 
                lineNumber: 3 
            };

            // Place temporarily for visual check
            board[row] = col;

            if (isSafe(row, col)) {
                yield { 
                    solution: [...board], 
                    currentRow: row,
                    currentCol: col,
                    isValid: true,
                    message: `Safe! Recurse to next row.`, 
                    lineNumber: 4 
                };

                // Recurse
                if (yield* solve(row + 1)) {
                    return true;
                }
                
                // Backtrack message
                yield { 
                    solution: [...board], 
                    currentRow: row,
                    currentCol: col,
                    message: `Backtracking from Row ${row+1}. Removing Queen at (${row}, ${col})`, 
                    lineNumber: 6 
                };
            } else {
                 yield { 
                    solution: [...board], 
                    currentRow: row,
                    currentCol: col,
                    isValid: false,
                    message: `Unsafe! Attack detected.`, 
                    lineNumber: 3 
                };
            }

            // Remove
            board[row] = -1;
        }

        return false;
    }

    yield { 
        solution: [...board], 
        currentRow: 0, 
        message: "Start N-Queens. Empty Board.", 
        lineNumber: 1 
    };

    yield* solve(0);
}
