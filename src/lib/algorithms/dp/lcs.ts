
import { GridStep } from "./knapsack";

export function* generateLCSSteps(
    str1: string, 
    str2: string
): Generator<GridStep> {
    const m = str1.length;
    const n = str2.length;
    // DP Table: (m+1) x (n+1)
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    yield { 
        grid: JSON.parse(JSON.stringify(dp)), 
        message: "Initialize DP table with 0s", 
        lineNumber: 1 
    };

    for (let i = 1; i <= m; i++) {
        const char1 = str1[i - 1];

        for (let j = 1; j <= n; j++) {
            const char2 = str2[j - 1];

            yield { 
                grid: JSON.parse(JSON.stringify(dp)), 
                activeCell: { r: i, c: j },
                message: `Comparing '${char1}' (Row ${i}) with '${char2}' (Col ${j})`, 
                lineNumber: 2 
            };

            if (char1 === char2) {
                // Match
                const val = 1 + dp[i - 1][j - 1];
                dp[i][j] = val;

                yield { 
                    grid: JSON.parse(JSON.stringify(dp)), 
                    activeCell: { r: i, c: j },
                    comparingCells: [{ r: i-1, c: j-1 }],
                    message: `Match! '${char1}' == '${char2}'. Add 1 to diagonal: ${dp[i-1][j-1]} + 1 = ${val}`, 
                    lineNumber: 3 
                };
            } else {
                // No Match
                const valTop = dp[i - 1][j];
                const valLeft = dp[i][j - 1];
                dp[i][j] = Math.max(valTop, valLeft);
                
                yield { 
                    grid: JSON.parse(JSON.stringify(dp)), 
                    activeCell: { r: i, c: j },
                    comparingCells: [{ r: i-1, c: j }, { r: i, c: j-1 }],
                    message: `Mismatch. Take Max(Top: ${valTop}, Left: ${valLeft}) = ${dp[i][j]}`, 
                    lineNumber: 4 
                };
            }

            yield { 
                grid: JSON.parse(JSON.stringify(dp)), 
                activeCell: { r: i, c: j },
                highlightedCells: [{ r: i, c: j }], 
                message: `Set DP[${i}][${j}] = ${dp[i][j]}`, 
                lineNumber: 5 
            };
        }
    }

    yield { 
        grid: JSON.parse(JSON.stringify(dp)), 
        message: `LCS Length: ${dp[m][n]}`, 
        lineNumber: 6 
    };
}
