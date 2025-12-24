
export interface GraphNode {
    id: string;
    neighbors: string[];
}

export type TopoSortStep = {
    adj: Record<string, string[]>;
    inDegree: Record<string, number>;
    queue: string[];
    sortedOrder: string[];
    activeNodeId?: string;
    description: string;
    highlightedEdges?: {from: string, to: string}[];
    lineNumber?: number;
}

export function* generateTopoSortSteps(
    adj: Record<string, string[]>
): Generator<TopoSortStep> {
    const nodes = Object.keys(adj);
    const inDegree: Record<string, number> = {};
    const sortedOrder: string[] = [];
    const queue: string[] = [];

    // Init in-degrees
    nodes.forEach(node => inDegree[node] = 0);
    
    // Calculate in-degrees
    yield {
        adj: JSON.parse(JSON.stringify(adj)),
        inDegree: { ...inDegree },
        queue: [],
        sortedOrder: [],
        description: "Initialize in-degrees to 0 for all nodes.",
        lineNumber: 1
    };

    for (const node of nodes) {
        for (const neighbor of adj[node]) {
            if (inDegree[neighbor] === undefined) inDegree[neighbor] = 0; // Robustness
            inDegree[neighbor]++;
        }
    }
    
    yield {
        adj: JSON.parse(JSON.stringify(adj)),
        inDegree: { ...inDegree },
        queue: [],
        sortedOrder: [],
        description: "Calculated in-degrees for all nodes.",
        lineNumber: 2
    };

    // Enqueue 0 in-degree nodes
    for (const node of nodes) {
        if (inDegree[node] === 0) {
            queue.push(node);
        }
    }

    yield {
        adj: JSON.parse(JSON.stringify(adj)),
        inDegree: { ...inDegree },
        queue: [...queue],
        sortedOrder: [],
        description: `Enqueued nodes with 0 in-degree: [${queue.join(', ')}]`,
        lineNumber: 3
    };

    // Kahn's Algorithm
    while (queue.length > 0) {
        const u = queue.shift()!;
        sortedOrder.push(u);

        yield {
            adj: JSON.parse(JSON.stringify(adj)),
            inDegree: { ...inDegree },
            queue: [...queue],
            sortedOrder: [...sortedOrder],
            activeNodeId: u,
            description: `Process node ${u}. Add to sorted order.`,
            lineNumber: 4
        };

        if (adj[u]) {
            for (const v of adj[u]) {
                inDegree[v]--;
                
                 yield {
                    adj: JSON.parse(JSON.stringify(adj)),
                    inDegree: { ...inDegree },
                    queue: [...queue],
                    sortedOrder: [...sortedOrder],
                    activeNodeId: u,
                    highlightedEdges: [{from: u, to: v}],
                    description: `Remove edge ${u}->${v}. Verify in-degree of ${v} becomes ${inDegree[v]}.`,
                    lineNumber: 5
                };

                if (inDegree[v] === 0) {
                    queue.push(v);
                    yield {
                        adj: JSON.parse(JSON.stringify(adj)),
                        inDegree: { ...inDegree },
                        queue: [...queue],
                        sortedOrder: [...sortedOrder],
                        activeNodeId: u,
                        description: `Node ${v} has 0 in-degree. Enqueue it.`,
                        lineNumber: 6
                    };
                }
            }
        }
    }

    if (sortedOrder.length !== nodes.length) {
         yield {
            adj: JSON.parse(JSON.stringify(adj)),
            inDegree: { ...inDegree },
            queue: [],
            sortedOrder: [...sortedOrder],
            description: "Cycle Detected! Graph is not a DAG. Sort incomplete.",
            lineNumber: 7
        };
    } else {
        yield {
            adj: JSON.parse(JSON.stringify(adj)),
            inDegree: { ...inDegree },
            queue: [],
            sortedOrder: [...sortedOrder],
            description: "Topological Sort Complete.",
            lineNumber: 8
        };
    }
}
