
export type FloydWarshallStep = {
    matrix: (number | null)[][]; // null represents Infinity
    k: number;
    i: number | null;
    j: number | null;
    message: string;
    description: string;
    highlightedCells: [number, number][]; // [row, col]
    comparison: { 
        current: number | null, 
        viaK: number | null 
    } | null;
    lineNumber?: number;
};

export function* generateFloydWarshallSteps(adjacencyMatrix: (number | null)[][]): Generator<FloydWarshallStep> {
    const n = adjacencyMatrix.length;
    // Deep copy matrix to avoid mutating input
    const dist = adjacencyMatrix.map(row => [...row]);

    // Initial State
    yield {
        matrix: dist.map(r => [...r]),
        k: -1, i: null, j: null,
        message: "Initialized Distance Matrix",
        description: "Direct edge weights are loaded. Infinity (null) means no direct edge.",
        highlightedCells: [],
        comparison: null
    };

    for (let k = 0; k < n; k++) {
        yield {
            matrix: dist.map(r => [...r]),
            k, i: null, j: null,
            message: `Iteration k=${k}: Using node ${k} as intermediate`,
            description: `Checking if paths via node ${k} are shorter.`,
            highlightedCells: [[k, k]], // Just highlighting the pivot node vaguely
            comparison: null
        };

        for (let i = 0; i < n; i++) {
             // Optimization: If dist[i][k] is infinity, we can't route through k
            if (dist[i][k] === null) continue;

            for (let j = 0; j < n; j++) {
                if (dist[k][j] === null) continue;
                if (i === j) continue; // dist to self is always 0

                const currentDist = dist[i][j];
                const newDist = (dist[i][k] as number) + (dist[k][j] as number);

                // Check update
                const improves = currentDist === null || newDist < currentDist;
                
                yield {
                    matrix: dist.map(r => [...r]),
                    k, i, j,
                    message: `Checking path ${i} -> ${j} via ${k}`,
                    description: `Compare direct ${i}->${j} (${currentDist ?? '∞'}) vs ${i}->${k}->${j} (${dist[i][k]} + ${dist[k][j]} = ${newDist})`,
                    highlightedCells: [[i, j], [i, k], [k, j]],
                    comparison: {
                         current: currentDist,
                         viaK: newDist
                    }
                };

                if (improves) {
                    dist[i][j] = newDist;
                    yield {
                        matrix: dist.map(r => [...r]),
                        k, i, j,
                        message: `Update! New shortest path ${i} -> ${j} is ${newDist}`,
                        description: `Found shorter path via ${k}.`,
                        highlightedCells: [[i, j]], // Highlight the updated cell
                         comparison: {
                            current: currentDist,
                            viaK: newDist
                       }
                    };
                }
            }
        }
    }

    yield {
        matrix: dist,
        k: n, i: null, j: null,
        message: "Algorithm Complete",
        description: "All-Pairs Shortest Paths computed.",
        highlightedCells: [],
        comparison: null
    };
}
