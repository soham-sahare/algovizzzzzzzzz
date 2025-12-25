
export type EditDistanceStep = {
    str1: string;
    str2: string;
    dp: (number | null)[][];
    currentCell?: [number, number]; // [i, j]
    message: string;
    description: string;
    highlightedCells: [number, number][];
    operation?: 'MATCH' | 'INSERT' | 'DELETE' | 'REPLACE';
    lineNumber?: number;
};

export function* generateEditDistanceSteps(s1: string, s2: string): Generator<EditDistanceStep> {
    const m = s1.length;
    const n = s2.length;
    const dp: (number | null)[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(null));

    // Base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i; // Deleting all chars
    for (let j = 0; j <= n; j++) dp[0][j] = j; // Inserting all chars

    yield {
        str1: s1,
        str2: s2,
        dp: dp.map(r => [...r]),
        message: "Initialized DP Table",
        description: "Row 0 = Insertions (0..N). Col 0 = Deletions (0..M).",
        highlightedCells: []
    };

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            
            yield {
                str1: s1,
                str2: s2,
                dp: dp.map(r => [...r]),
                currentCell: [i, j],
                message: `Comparing '${s1[i - 1]}' and '${s2[j - 1]}'`,
                description: "Calculating min operations...",
                highlightedCells: [[i, j]]
            };

            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]; // Match
                yield {
                    str1: s1,
                    str2: s2,
                    dp: dp.map(r => [...r]),
                    currentCell: [i, j],
                    message: "Match!",
                    description: `Characters equal. Take diagonal: ${dp[i-1][j-1]}.`,
                    highlightedCells: [[i, j], [i - 1, j - 1]],
                    operation: 'MATCH'
                };
            } else {
                const insert = (dp[i][j - 1] as number);
                const replace = (dp[i - 1][j - 1] as number);
                const del = (dp[i - 1][j] as number);
                
                const minOp = Math.min(insert, replace, del);
                dp[i][j] = 1 + minOp;

                let opName: 'INSERT' | 'DELETE' | 'REPLACE' = 'REPLACE';
                let sourceCell: [number, number] = [i - 1, j - 1];

                if (minOp === insert) {
                    opName = 'INSERT';
                    sourceCell = [i, j - 1];
                } else if (minOp === del) {
                    opName = 'DELETE';
                    sourceCell = [i - 1, j];
                }

                yield {
                    str1: s1,
                    str2: s2,
                    dp: dp.map(r => [...r]),
                    currentCell: [i, j],
                    message: `Mismatch: ${opName}`,
                    description: `Min(${insert}, ${del}, ${replace}) + 1 = ${dp[i][j]}`,
                    highlightedCells: [[i, j], sourceCell],
                    operation: opName
                };
            }
        }
    }

    yield {
        str1: s1,
        str2: s2,
        dp: dp.map(r => [...r]),
        message: `Analysis Complete. Distance: ${dp[m][n]}`,
        description: "Minimum operations to transform S1 to S2.",
        highlightedCells: [[m, n]]
    };
}
