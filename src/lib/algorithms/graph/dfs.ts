
import { GraphStep } from "./bfs";

export function* generateDFSSteps(
    adjList: Record<string, string[]>, 
    startNode: string
): Generator<GraphStep> {
    const visited = new Set<string>();
    const stack: string[] = [startNode]; // Iterative DFS using Stack
    const visitedList: string[] = [];

    // For visualization, we might want to differentiate "seen" vs "processed" if using color.
    // Standard DFS:
    
    yield { 
        visitingNodeId: undefined, 
        visitedNodeIds: [],
        highlightedNodeIds: [startNode], 
        highlightedEdges: [], 
        stack: [...stack],
        message: `Initialize Stack with Start Node ${startNode}`,
        lineNumber: 1 
    };

    while (stack.length > 0) {
        const curr = stack.pop()!;
        
        if (!visited.has(curr)) {
            visited.add(curr);
            visitedList.push(curr);

            yield { 
                visitingNodeId: curr, 
                visitedNodeIds: [...visitedList],
                highlightedNodeIds: [], 
                highlightedEdges: [], 
                stack: [...stack],
                message: `Pop ${curr}. Visit it.`,
                lineNumber: 2 
            };

            const neighbors = adjList[curr] || [];
            // To mimic recursive DFS (going deeper into first neighbor), 
            // we should push neighbors in REVERSE order so the first one is popped first.
            const reversedNeighbors = [...neighbors].reverse();

            for (const neighbor of reversedNeighbors) {
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                    yield { 
                        visitingNodeId: curr, 
                        visitedNodeIds: [...visitedList],
                        highlightedNodeIds: [neighbor], 
                        highlightedEdges: [{ from: curr, to: neighbor }], 
                        stack: [...stack],
                        message: `Push neighbor ${neighbor} to Stack.`,
                        lineNumber: 3 
                    };
                }
            }
        } else {
             yield { 
                visitingNodeId: curr, 
                visitedNodeIds: [...visitedList],
                highlightedNodeIds: [], 
                highlightedEdges: [], 
                stack: [...stack],
                message: `${curr} already visited. Skip.`,
                lineNumber: 4 
            };
        }
    }
    
    yield { 
        visitingNodeId: undefined, 
        visitedNodeIds: [...visitedList],
        highlightedNodeIds: [], 
        highlightedEdges: [], 
        stack: [],
        message: "DFS Traversal Complete",
        lineNumber: 5 
    };
}
