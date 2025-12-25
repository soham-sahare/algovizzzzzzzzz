
export type UnionFindStep = {
    parents: number[];
    ranks: number[];
    message: string;
    description: string;
    highlightedNodes: number[]; // indices
    highlightedEdges: [number, number][]; // pairs of indices representing conceptual edges being processed
    lineNumber?: number;
};

export class UnionFind {
    parent: number[];
    rank: number[];
    size: number;

    constructor(size: number) {
        this.size = size;
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = new Array(size).fill(0);
    }

    find(i: number): number {
        if (this.parent[i] !== i) {
            this.parent[i] = this.find(this.parent[i]); // Path compression
        }
        return this.parent[i];
    }

    union(i: number, j: number): boolean {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI !== rootJ) {
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                this.parent[rootJ] = rootI;
                this.rank[rootI]++;
            }
            return true;
        }
        return false;
    }
}

export function* generateUnionFindSteps(size: number, operations: { type: 'UNION' | 'FIND', a: number, b?: number }[]): Generator<UnionFindStep> {
    // We maintain our own state for the generator to be pure-ish relative to the visualizer
    let parent = Array.from({ length: size }, (_, i) => i);
    let rank = new Array(size).fill(0);

    const cloneState = () => ({ parents: [...parent], ranks: [...rank] });

    yield {
        ...cloneState(),
        message: `Initialized Union Find with ${size} elements.`,
        description: "Each element is its own parent initially.",
        highlightedNodes: [],
        highlightedEdges: []
    };

    // Helper find with no path compression for visualization steps (or maybe we WNAT path compression visualization?)
    // Let's implement Find with visualization of the traversal
    function* findWithSteps(i: number): Generator<UnionFindStep, number, void> {
        let path: number[] = [i];
        let curr = i;
        
        while (curr !== parent[curr]) {
            yield {
                ...cloneState(),
                message: `Find(${i}): Checking parent of ${curr}... it is ${parent[curr]}`,
                description: "Traversing up the tree...",
                highlightedNodes: [curr, parent[curr]],
                highlightedEdges: [[curr, parent[curr]]]
            };
            curr = parent[curr];
            path.push(curr);
        }

        yield {
            ...cloneState(),
            message: `Find(${i}): Root found at ${curr}`,
            description: "Reached a node that is its own parent.",
            highlightedNodes: [curr],
            highlightedEdges: []
        };

        // Path compression viz
        if (path.length > 2) {
             yield {
                ...cloneState(),
                message: `Path Compression: Pointing all nodes on path directly to root ${curr}`,
                description: "Optimizing future lookups.",
                highlightedNodes: path,
                highlightedEdges: []
            };
            for(let node of path) {
                parent[node] = curr;
            }
             yield {
                ...cloneState(),
                message: `Path Compression Complete`,
                description: "Structure flattened.",
                highlightedNodes: path,
                highlightedEdges: []
            };
        }

        return curr;
    }

    for (const op of operations) {
        if (op.type === 'UNION' && op.b !== undefined) {
            yield {
                ...cloneState(),
                message: `Union(${op.a}, ${op.b}) Started`,
                description: `Finding roots of ${op.a} and ${op.b}...`,
                highlightedNodes: [op.a, op.b],
                highlightedEdges: []
            };

            const rootA: number = yield* findWithSteps(op.a);
            const rootB: number = yield* findWithSteps(op.b);

            if (rootA !== rootB) {
                yield {
                    ...cloneState(),
                    message: `Roots are different (${rootA} != ${rootB}). merging...`,
                    description: `Comparing ranks: Rank[${rootA}]=${rank[rootA]}, Rank[${rootB}]=${rank[rootB]}`,
                    highlightedNodes: [rootA, rootB],
                    highlightedEdges: [[rootA, rootB]]
                };

                if (rank[rootA] < rank[rootB]) {
                    parent[rootA] = rootB;
                    yield {
                        ...cloneState(),
                        message: `Rank[${rootA}] < Rank[${rootB}]. ${rootA} points to ${rootB}.`,
                        description: "Tree A becomes subtree of B.",
                        highlightedNodes: [rootA, rootB],
                        highlightedEdges: [[rootA, rootB]]
                    };
                } else if (rank[rootA] > rank[rootB]) {
                    parent[rootB] = rootA;
                    yield {
                        ...cloneState(),
                        message: `Rank[${rootA}] > Rank[${rootB}]. ${rootB} points to ${rootA}.`,
                        description: "Tree B becomes subtree of A.",
                        highlightedNodes: [rootA, rootB],
                        highlightedEdges: [[rootA, rootB]]
                    };
                } else {
                    parent[rootB] = rootA;
                    rank[rootA]++;
                    yield {
                        ...cloneState(),
                        message: `Ranks equal. ${rootB} points to ${rootA}, and Rank[${rootA}] increases.`,
                        description: "Arbitrary link, rank incremented.",
                        highlightedNodes: [rootA, rootB],
                        highlightedEdges: [[rootA, rootB]]
                    };
                }
            } else {
                yield {
                    ...cloneState(),
                    message: `Roots are same (${rootA}). Already connected.`,
                    description: "No operation needed.",
                    highlightedNodes: [rootA],
                    highlightedEdges: []
                };
            }

        } else if (op.type === 'FIND') {
             yield* findWithSteps(op.a);
        }
    }
}
