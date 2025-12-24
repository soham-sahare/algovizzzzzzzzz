
import { GraphStep } from "./bfs";
import { GraphEdge } from "@/components/visualizations/GraphVisualizer";

export type DijkstraStep = GraphStep & {
    distances: Record<string, number>;
};

export function* generateDijkstraSteps(
    adjList: Record<string, GraphEdge[]>, // Need edges to know weights
    startNode: string,
    nodes: string[]
): Generator<DijkstraStep> {
    const distances: Record<string, number> = {};
    const visited = new Set<string>();
    const prev: Record<string, string | null> = {};

    // Initialize
    nodes.forEach(node => {
        distances[node] = Infinity;
        prev[node] = null;
    });
    distances[startNode] = 0;

    // We use a simple array as PQ for visualization simplicity
    // Format: [nodeId, distance]
    let pq: { id: string, dist: number }[] = [{ id: startNode, dist: 0 }];

    yield { 
        visitingNodeId: undefined, 
        visitedNodeIds: [],
        highlightedNodeIds: [startNode], 
        highlightedEdges: [], 
        distances: { ...distances },
        message: `Initialize distances. Start ${startNode} = 0, others = Infinity.`,
        lineNumber: 1 
    };

    while (pq.length > 0) {
        // Sort to simulate Priority Queue (Smallest distance first)
        pq.sort((a, b) => a.dist - b.dist);
        
        const { id: curr, dist: currDist } = pq.shift()!;

        if (visited.has(curr)) continue;
        visited.add(curr);

        yield { 
            visitingNodeId: curr, 
            visitedNodeIds: Array.from(visited),
            highlightedNodeIds: [curr], 
            highlightedEdges: [], 
            distances: { ...distances },
            message: `Visit ${curr} (Distance: ${currDist}). Check neighbors.`,
            lineNumber: 2 
        };

        const neighbors = adjList[curr] || [];
        
        for (const edge of neighbors) {
            const neighbor = edge.to;
            const weight = edge.weight || 1;
            
            if (visited.has(neighbor)) continue;

            yield { 
                visitingNodeId: curr, 
                visitedNodeIds: Array.from(visited),
                highlightedNodeIds: [curr, neighbor], 
                highlightedEdges: [{ from: curr, to: neighbor }], 
                distances: { ...distances },
                message: `Checking neighbor ${neighbor} (Weight: ${weight}).`,
                lineNumber: 3 
            };

            const newDist = currDist + weight;
            
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                prev[neighbor] = curr;
                pq.push({ id: neighbor, dist: newDist });
                
                yield { 
                    visitingNodeId: curr, 
                    visitedNodeIds: Array.from(visited),
                    highlightedNodeIds: [neighbor], 
                    highlightedEdges: [{ from: curr, to: neighbor }], 
                    distances: { ...distances },
                    message: `Relaxed ${neighbor}: Inf -> ${newDist}`,
                    lineNumber: 4 
                };
            }
        }
    }

    yield { 
        visitingNodeId: undefined, 
        visitedNodeIds: Array.from(visited),
        highlightedNodeIds: [], 
        highlightedEdges: [], 
        distances: { ...distances },
        message: "Dijkstra Complete. Shortest paths found.",
        lineNumber: 5 
    };
}
