
export type FenwickTreeStep = {
    tree: number[];
    array: number[];
    message: string;
    description: string;
    highlightedIndices: number[]; // Tree/Array indices
    activeIdx?: number;
    queryIdx?: number;
    lineNumber?: number;
};

// 1-based indexing internally is common for BIT, but we can map 0-based input.
// We'll store tree as size N+1.
export function* generateFenwickTreeBuildSteps(initialArray: number[]): Generator<FenwickTreeStep> {
    const n = initialArray.length;
    const tree = new Array(n + 1).fill(0);
    const array = [...initialArray];

    yield {
        tree: [...tree],
        array: [...array],
        message: "Initializing Fenwick Tree",
        description: "Tree array of size N+1 initialized to 0.",
        highlightedIndices: []
    };

    // Build O(N) method: Add to immediate parent
    // Or simpler: Just update for each element
    for (let i = 0; i < n; i++) {
        const val = array[i];
        let idx = i + 1;
        
        yield {
            tree: [...tree],
            array: [...array],
            message: `Adding index ${i} (Val: ${val}) to Tree`,
            description: `Starting update at tree index ${idx}`,
            highlightedIndices: [idx],
            activeIdx: idx
        };

        while (idx <= n) {
            tree[idx] += val;
            
            yield {
                tree: [...tree],
                array: [...array],
                message: `Update Tree[${idx}]`,
                description: `Adding ${val} to Tree[${idx}]. New value: ${tree[idx]}. Jump: idx += idx & (-idx)`,
                highlightedIndices: [idx],
                activeIdx: idx
            };

            idx += idx & (-idx);
        }
    }

    yield {
        tree: [...tree],
        array: [...array],
        message: "Build Complete",
        description: "Prefix sums can now be queried efficiently.",
        highlightedIndices: []
    };
}

export function* generateFenwickTreeUpdateSteps(
    currentTree: number[],
    currentArray: number[],
    index: number, // 0-based
    delta: number
): Generator<FenwickTreeStep> {
    const n = currentArray.length;
    const tree = [...currentTree];
    const array = [...currentArray];
    
    // We assume array[index] is *already* updated conceptually or we do it here?
    // Usually BIT update takes a delta.
    // Let's assume the user wants to set array[index] = Val.
    // Then delta = Val - array[index].
    // Here we act as if we are processing the delta.
    
    array[index] += delta; // Reflect in array view

    let idx = index + 1;
    
    yield {
        tree: [...tree],
        array: [...array],
        message: `Update(Index ${index}, Delta ${delta})`,
        description: `Starting traversal from tree index ${idx}`,
        highlightedIndices: [idx],
        activeIdx: idx
    };

    while (idx <= n) {
        tree[idx] += delta;

        yield {
            tree: [...tree],
            array: [...array],
            message: `Update Tree[${idx}] += ${delta}`,
            description: `New Value: ${tree[idx]}. Moving to parent/next range.`,
            highlightedIndices: [idx],
            activeIdx: idx
        };

        idx += idx & (-idx);
    }
}

export function* generateFenwickTreeQuerySteps(
    currentTree: number[],
    currentArray: number[],
    index: number // 0-based, query sum[0...index]
): Generator<FenwickTreeStep> {
    const tree = [...currentTree];
    let sum = 0;
    let idx = index + 1;

    yield {
        tree: [...tree],
        array: [...currentArray],
        message: `Query Sum(0...${index})`,
        description: `Summing segments starting from tree index ${idx}`,
        highlightedIndices: [idx],
        queryIdx: index
    };

    while (idx > 0) {
        sum += tree[idx];

        yield {
            tree: [...tree],
            array: [...currentArray],
            message: `Add Tree[${idx}] (${tree[idx]})`,
            description: `Current Sum: ${sum}. Moving to parent: idx -= idx & (-idx)`,
            highlightedIndices: [idx],
            queryIdx: index
        };

        idx -= idx & (-idx);
    }
    
    yield {
        tree: [...tree],
        array: [...currentArray],
        message: `Result: ${sum}`,
        description: `Total prefix sum calculated.`,
        highlightedIndices: [],
        queryIdx: index
    };
}
