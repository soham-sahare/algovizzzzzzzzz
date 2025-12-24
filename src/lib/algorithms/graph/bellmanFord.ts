
import { GraphEdge } from "./mst";

export type BellmanFordStep = {
    adj: Record<string, GraphEdge[]>;
    distances: Record<string, number>;
    parents: Record<string, string | null>;
    activeEdge?: GraphEdge;
    changed?: boolean;
    iteration: number;
    message: string;
    lineNumber?: number;
    negativeCycleNode?: string;
}

export function* generateBellmanFordSteps(
    adj: Record<string, GraphEdge[]>, 
    startNode: string
): Generator<BellmanFordStep> {
    const nodes = Object.keys(adj);
    const distances: Record<string, number> = {};
    const parents: Record<string, string | null> = {};
    const edges: GraphEdge[] = [];

    // Init
    nodes.forEach(n => {
        distances[n] = Infinity;
        parents[n] = null;
    });
    distances[startNode] = 0;

    Object.values(adj).flat().forEach(e => edges.push(e));

    yield {
        adj,
        distances: { ...distances },
        parents: { ...parents },
        iteration: 0,
        message: `Initialize distances. Start node ${startNode} = 0, others = Infinity.`,
        lineNumber: 1
    };

    // Relax V-1 times
    for (let i = 0; i < nodes.length - 1; i++) {
        let changed = false;
        
        yield {
            adj,
            distances: { ...distances },
            parents: { ...parents },
            iteration: i + 1,
            message: `Iteration ${i + 1} of ${nodes.length - 1}: Relaxing all edges...`,
            lineNumber: 2
        };

        for (const edge of edges) {
             const u = edge.from;
             const v = edge.to;
             const w = edge.weight;

             // Visualize checking edge
             yield {
                adj,
                distances: { ...distances },
                parents: { ...parents },
                activeEdge: edge,
                iteration: i + 1,
                message: `Checking edge ${u}->${v} (weight ${w}).`,
                lineNumber: 3
             };

             if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
                 distances[v] = distances[u] + w;
                 parents[v] = u;
                 changed = true;
                 
                  yield {
                    adj,
                    distances: { ...distances },
                    parents: { ...parents },
                    activeEdge: edge,
                    changed: true,
                    iteration: i + 1,
                    message: `Relaxed! Updated distance to ${v} = ${distances[v]}`,
                    lineNumber: 4
                 };
             }
        }

        if (!changed) {
             yield {
                adj,
                distances: { ...distances },
                parents: { ...parents },
                iteration: i + 1,
                message: `No changes in this iteration. Algorithm terminated early.`,
                lineNumber: 5
             };
             break;
        }
    }

    // Check for negative cycles
    yield {
        adj,
        distances: { ...distances },
        parents: { ...parents },
        iteration: nodes.length,
        message: `Checking for Negative Cycles...`,
        lineNumber: 6
    };

    for (const edge of edges) {
        if (distances[edge.from] !== Infinity && distances[edge.from] + edge.weight < distances[edge.to]) {
             yield {
                adj,
                distances: { ...distances },
                parents: { ...parents },
                activeEdge: edge,
                iteration: nodes.length,
                negativeCycleNode: edge.to,
                message: `Negative Cycle Detected! Edge ${edge.from}->${edge.to} can still be relaxed.`,
                lineNumber: 7
             };
             return;
        }
    }

    yield {
        adj,
        distances: { ...distances },
        parents: { ...parents },
        iteration: nodes.length,
        message: `Bellman-Ford Complete. Shortest paths found.`,
        lineNumber: 8
    };
}
