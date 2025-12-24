
import { DPStep } from "./fibonacci"; // Use mostly similar structure or define new

export type GridStep = {
    grid: number[][];
    activeCell?: { r: number, c: number };
    highlightedCells?: { r: number, c: number }[];
    comparingCells?: { r: number, c: number }[];
    message: string;
    lineNumber?: number;
}

export function* generateKnapsackSteps(
    weights: number[], 
    values: number[], 
    capacity: number
): Generator<GridStep> {
    const n = weights.length;
    // DP Table: (n+1) x (capacity+1)
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    yield { 
        grid: JSON.parse(JSON.stringify(dp)), 
        message: "Initialize DP table with 0s", 
        lineNumber: 1 
    };

    for (let i = 1; i <= n; i++) {
        const w = weights[i - 1];
        const v = values[i - 1];

        for (let j = 0; j <= capacity; j++) {
            yield { 
                grid: JSON.parse(JSON.stringify(dp)), 
                activeCell: { r: i, c: j },
                highlightedCells: [], // nothing yet
                message: `Checking Item ${i} (W:${w}, V:${v}) for capacity ${j}`, 
                lineNumber: 2 
            };

            if (w <= j) {
                // Determine max of including or excluding
                const valWithout = dp[i - 1][j];
                const valWith = v + dp[i - 1][j - w];

                yield { 
                    grid: JSON.parse(JSON.stringify(dp)), 
                    activeCell: { r: i, c: j },
                    comparingCells: [{ r: i-1, c: j }, { r: i-1, c: j-w }],
                    message: `Compare: Exclude(${valWithout}) vs Include(${v} + ${dp[i-1][j-w]} = ${valWith})`, 
                    lineNumber: 3 
                };

                dp[i][j] = Math.max(valWithout, valWith);
            } else {
                // Cannot include
                dp[i][j] = dp[i - 1][j];
                
                yield { 
                    grid: JSON.parse(JSON.stringify(dp)), 
                    activeCell: { r: i, c: j },
                    comparingCells: [{ r: i-1, c: j }],
                    message: `Item too heavy (${w} > ${j}). Copy value from above: ${dp[i][j]}`, 
                    lineNumber: 4 
                };
            }

            yield { 
                grid: JSON.parse(JSON.stringify(dp)), 
                activeCell: { r: i, c: j },
                highlightedCells: [{ r: i, c: j }], // Updated
                message: `Set DP[${i}][${j}] = ${dp[i][j]}`, 
                lineNumber: 5 
            };
        }
    }

    yield { 
        grid: JSON.parse(JSON.stringify(dp)), 
        message: `Max Value found: ${dp[n][capacity]}`, 
        lineNumber: 6 
    };
}
