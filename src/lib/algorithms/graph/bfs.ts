
import { GraphNode, GraphEdge } from "@/components/visualizations/GraphVisualizer";

export type GraphStep = {
    visitingNodeId?: string;
    visitedNodeIds: string[];
    highlightedNodeIds: string[]; // For queue/stack visualization hints
    highlightedEdges: { from: string; to: string }[];
    queue?: string[]; // For BFS
    stack?: string[]; // For DFS
    message: string;
    lineNumber?: number;
}

export function* generateBFSSteps(
    adjList: Record<string, string[]>, 
    startNode: string
): Generator<GraphStep> {
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const visitedList: string[] = []; // For visualization order

    visited.add(startNode);
    
    yield { 
        visitingNodeId: undefined, 
        visitedNodeIds: [],
        highlightedNodeIds: [startNode], 
        highlightedEdges: [], 
        queue: [...queue],
        message: `Initialize Queue with Start Node ${startNode}`,
        lineNumber: 1 
    };

    while (queue.length > 0) {
        const curr = queue.shift()!;
        visitedList.push(curr);

        yield { 
            visitingNodeId: curr, 
            visitedNodeIds: [...visitedList], // Current is now visited
            highlightedNodeIds: [], 
            highlightedEdges: [], 
            queue: [...queue],
            message: `Dequeue ${curr}. Visit it.`,
            lineNumber: 2 
        };

        const neighbors = adjList[curr] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                
                yield { 
                    visitingNodeId: curr, 
                    visitedNodeIds: [...visitedList],
                    highlightedNodeIds: [neighbor], 
                    highlightedEdges: [{ from: curr, to: neighbor }], 
                    queue: [...queue],
                    message: `Neighbor ${neighbor} not visited. Enqueue.`,
                    lineNumber: 3 
                };
            } else {
                 yield { 
                    visitingNodeId: curr, 
                    visitedNodeIds: [...visitedList],
                    highlightedNodeIds: [], 
                    highlightedEdges: [], 
                    queue: [...queue],
                    message: `Neighbor ${neighbor} already visited. Skip.`,
                    lineNumber: 4 
                };
            }
        }
    }
    
    yield { 
        visitingNodeId: undefined, 
        visitedNodeIds: [...visitedList],
        highlightedNodeIds: [], 
        highlightedEdges: [], 
        queue: [],
        message: "BFS Traversal Complete",
        lineNumber: 5 
    };
}
