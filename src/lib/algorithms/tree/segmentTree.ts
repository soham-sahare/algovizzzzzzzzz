
export type SegmentTreeStep = {
    tree: (number | null)[];
    array: number[];
    message: string;
    description: string;
    highlightedNodes: number[]; // Tree indices (1-based or 0-based, let's use 0-based array for tree)
    activeRange?: [number, number]; // [start, end] coverage of current node
    queryRange?: [number, number]; // [L, R] query
    updateIndex?: number;
    highlightedArrIndices: number[];
    lineNumber?: number;
};

// 0-based indexing for tree array: 
// Node i: Left child 2*i + 1, Right child 2*i + 2
export function* generateSegmentTreeSteps(initialArray: number[]): Generator<SegmentTreeStep> {
    const n = initialArray.length;
    // Tree size: 4*n is safe upper bound
    const tree: (number | null)[] = new Array(4 * n).fill(null);
    const array = [...initialArray];

    yield {
        tree: [...tree],
        array: [...array],
        message: "Initializing Segment Tree",
        description: "Empty tree. Ready to build.",
        highlightedNodes: [],
        highlightedArrIndices: []
    };

    // --- BUILD ---
    function* build(node: number, start: number, end: number): Generator<SegmentTreeStep> {
        yield {
            tree: [...tree],
            array: [...array],
            message: `Build(${node}, ${start}, ${end})`,
            description: `Computing sum for range [${start}, ${end}]`,
            highlightedNodes: [node],
            activeRange: [start, end],
            highlightedArrIndices: start === end ? [start] : []
        };

        if (start === end) {
            tree[node] = array[start];
            yield {
                tree: [...tree],
                array: [...array],
                message: `Leaf Node ${node} = ${array[start]}`,
                description: `Range [${start}, ${start}] sum is ${array[start]}`,
                highlightedNodes: [node],
                activeRange: [start, end],
                highlightedArrIndices: [start]
            };
            return;
        }

        const mid = Math.floor((start + end) / 2);
        yield* build(2 * node + 1, start, mid);
        yield* build(2 * node + 2, mid + 1, end);

        tree[node] = (tree[2 * node + 1] || 0) + (tree[2 * node + 2] || 0);
        yield {
            tree: [...tree],
            array: [...array],
            message: `Node ${node} Sum = ${tree[node]}`,
            description: `Sum = Left Child (${tree[2 * node + 1]}) + Right Child (${tree[2 * node + 2]})`,
            highlightedNodes: [node, 2 * node + 1, 2 * node + 2],
            activeRange: [start, end],
            highlightedArrIndices: []
        };
    }

    yield* build(0, 0, n - 1);
    
    yield {
        tree: [...tree],
        array: [...array],
        message: "Build Complete",
        description: "Tree structure ready for queries.",
        highlightedNodes: [],
        highlightedArrIndices: []
    };
}

export function* generateSegmentTreeQuerySteps(
    currentTree: (number | null)[], 
    currentArray: number[], 
    L: number, 
    R: number
): Generator<SegmentTreeStep> {
    const n = currentArray.length;
    const tree = [...currentTree]; // Read-only mostly

    function* query(node: number, start: number, end: number, l: number, r: number): Generator<SegmentTreeStep, number, void> {
        // Range out of bounds
        if (r < start || end < l) {
            return 0;
        }

        yield {
            tree: [...tree],
            array: [...currentArray],
            message: `Query(${node}, [${start}, ${end}])`,
            description: `Checking overlap with query range [${l}, ${r}]`,
            highlightedNodes: [node],
            activeRange: [start, end],
            queryRange: [l, r],
            highlightedArrIndices: []
        };

        // Range fully inside query
        if (l <= start && end <= r) {
            yield {
                tree: [...tree],
                array: [...currentArray],
                message: `Full Overlap at Node ${node}`,
                description: `Range [${start}, ${end}] is inside [${l}, ${r}]. Return ${tree[node]}.`,
                highlightedNodes: [node],
                activeRange: [start, end],
                queryRange: [l, r],
                highlightedArrIndices: [] // Maybe highlight array range?
            };
            return tree[node] || 0;
        }

        // Partial overlap
        const mid = Math.floor((start + end) / 2);
        const p1 = yield* query(2 * node + 1, start, mid, l, r);
        const p2 = yield* query(2 * node + 2, mid + 1, end, l, r);

        yield {
            tree: [...tree],
            array: [...currentArray],
            message: `Merging results at Node ${node}`,
            description: `Left: ${p1}, Right: ${p2}. Total: ${p1 + p2}`,
            highlightedNodes: [node],
            activeRange: [start, end],
            queryRange: [l, r],
            highlightedArrIndices: []
        };

        return p1 + p2;
    }

    yield* query(0, 0, n - 1, L, R);
}

export function* generateSegmentTreeUpdateSteps(
    currentTree: (number | null)[], 
    currentArray: number[], 
    idx: number, 
    val: number
): Generator<SegmentTreeStep> {
    const n = currentArray.length;
    const tree = [...currentTree]; 
    const array = [...currentArray];
    
    // Update array first for consistency
    array[idx] = val;

    function* update(node: number, start: number, end: number): Generator<SegmentTreeStep> {
        if (start === end) {
            tree[node] = val;
            yield {
                tree: [...tree],
                array: [...array],
                message: `Updating Leaf Node ${node}`,
                description: `Index ${idx} changed to ${val}.`,
                highlightedNodes: [node],
                activeRange: [start, end],
                updateIndex: idx,
                highlightedArrIndices: [idx]
            };
            return;
        }

        const mid = Math.floor((start + end) / 2);
        
        yield {
            tree: [...tree],
            array: [...array],
            message: `Visiting Node ${node}`,
            description: `Looking for index ${idx} in [${start}, ${end}].`,
            highlightedNodes: [node],
            activeRange: [start, end],
            updateIndex: idx,
            highlightedArrIndices: [idx]
        };

        if (start <= idx && idx <= mid) {
            yield* update(2 * node + 1, start, mid);
        } else {
            yield* update(2 * node + 2, mid + 1, end);
        }

        tree[node] = (tree[2 * node + 1] || 0) + (tree[2 * node + 2] || 0);
        
        yield {
            tree: [...tree],
            array: [...array],
            message: `Updating Node ${node} Sum`,
            description: `Recalculating sum: ${tree[2 * node + 1]} + ${tree[2 * node + 2]} = ${tree[node]}`,
            highlightedNodes: [node, 2 * node + 1, 2 * node + 2],
            activeRange: [start, end],
            updateIndex: idx,
            highlightedArrIndices: []
        };
    }

    yield* update(0, 0, n - 1);
}
