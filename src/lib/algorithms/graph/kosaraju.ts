
export type KosarajuStep = {
    adj: number[][]; // Adjacency list representation 0..N-1
    message: string;
    description: string;
    visited: boolean[];
    stack: number[]; // Stack for first pass
    sccList: number[][]; // Resulting SCCs
    currentSCC: number[]; // SCC currently being built
    currentNode?: number;
    highlightedNodes: number[];
    isTransposePhase: boolean;
    lineNumber?: number;
};

export function* generateKosarajuSteps(adj: number[][]): Generator<KosarajuStep> {
    const N = adj.length;
    const visited = new Array(N).fill(false);
    const stack: number[] = [];

    // --- Pass 1: DFS to fill Stack ---
    yield {
        adj,
        message: "Phase 1: Fill Stack by Finish Time",
        description: "Perform DFS. When a node finishes, push to stack.",
        visited: [...visited],
        stack: [...stack],
        sccList: [],
        currentSCC: [],
        highlightedNodes: [],
        isTransposePhase: false
    };

    function* dfs1(u: number): Generator<KosarajuStep> {
        visited[u] = true;
        yield {
            adj,
            message: `DFS1: Visiting ${u}`,
            description: "Traversing neighbors...",
            visited: [...visited],
            stack: [...stack],
            sccList: [],
            currentSCC: [],
            currentNode: u,
            highlightedNodes: [u],
            isTransposePhase: false
        };

        for (const v of adj[u]) {
            if (!visited[v]) {
                yield* dfs1(v);
            }
        }
        
        stack.push(u);
        yield {
            adj,
            message: `DFS1: Finished ${u}`,
            description: "All neighbors visited. Push to Stack.",
            visited: [...visited],
            stack: [...stack],
            sccList: [],
            currentSCC: [],
            currentNode: u,
            highlightedNodes: [u],
            isTransposePhase: false
        };
    }

    for (let i = 0; i < N; i++) {
        if (!visited[i]) {
            yield* dfs1(i);
        }
    }

    // --- Transpose Graph ---
    // We can simulate this on the fly or build explicit transpose
    const transp: number[][] = Array.from({length:N}, () => []);
    for(let u=0; u<N; u++) {
        for(let v of adj[u]) {
            transp[v].push(u);
        }
    }

    yield {
        adj: transp, // Visualizing TRANSPOSE graph now? Or sticking to original? usually better to switch view.
        // Let's visualize transpose logic conceptually but maybe keep original visual or swap? 
        // Swapping is clearer for "why" we traverse.
        message: "Phase 2: Transpose Graph",
        description: "Reversed all edges. Reset visited array.",
        visited: new Array(N).fill(false),
        stack: [...stack],
        sccList: [],
        currentSCC: [],
        highlightedNodes: [],
        isTransposePhase: true
    };
    
    // Reset visited for pass 2
    visited.fill(false);
    const sccList: number[][] = [];
    
    function* dfs2(u: number, current: number[]): Generator<KosarajuStep> {
        visited[u] = true;
        current.push(u);
        
        yield {
            adj: transp,
            message: `DFS2: Visiting ${u}`,
            description: "Adding to current SCC.",
            visited: [...visited],
            stack: [...stack],
            sccList: [...sccList],
            currentSCC: [...current],
            currentNode: u,
            highlightedNodes: [u],
            isTransposePhase: true
        };

        for(const v of transp[u]) {
            if(!visited[v]) {
                yield* dfs2(v, current);
            }
        }
    }

    // Process nodes in stack order
    while(stack.length > 0) {
        const u = stack.pop()!;
        
        if (!visited[u]) {
            const currentSCCComponent: number[] = [];
            
            yield {
                adj: transp,
                message: `DFS2 Start: Popped ${u}`,
                description: "Starting new SCC traversal.",
                visited: [...visited],
                stack: [...stack],
                sccList: [...sccList],
                currentSCC: [],
                currentNode: u,
                highlightedNodes: [u],
                isTransposePhase: true
            };

            yield* dfs2(u, currentSCCComponent);
            sccList.push(currentSCCComponent);
            
            yield {
                adj: transp,
                message: "SCC Found!",
                description: `Component: [${currentSCCComponent.join(", ")}]`,
                visited: [...visited],
                stack: [...stack],
                sccList: [...sccList],
                currentSCC: [],
                highlightedNodes: currentSCCComponent,
                isTransposePhase: true
            };
        } else {
             yield {
                adj: transp,
                message: `Popped ${u} (Visited)`,
                description: "Already part of an SCC. Skip.",
                visited: [...visited],
                stack: [...stack],
                sccList: [...sccList],
                currentSCC: [],
                currentNode: u,
                highlightedNodes: [],
                isTransposePhase: true
            };
        }
    }

    yield {
        adj: transp, // Keep showing transpose or switch back?
        message: "Algorithm Complete",
        description: `Found ${sccList.length} Strongly Connected Components.`,
        visited: [...visited],
        stack: [],
        sccList: [...sccList],
        currentSCC: [],
        highlightedNodes: [],
        isTransposePhase: true
    };
}
