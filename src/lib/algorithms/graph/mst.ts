
export interface GraphEdge {
    from: string;
    to: string;
    weight: number;
}

export type MSTStep = {
    adj: Record<string, GraphEdge[]>; // Adjacency list representation
    mstEdges: GraphEdge[];
    visitedNodes: string[];
    activeEdge?: GraphEdge;
    candidateEdges: GraphEdge[]; // For Prim's priority queue or Kruskal's sorted list
    message: string;
    lineNumber?: number;
    totalWeight: number;
}

// Helper for Union-Find (Disjoint Set)
class UnionFind {
    parent: Record<string, string> = {};
    constructor(nodes: string[]) {
        nodes.forEach(node => this.parent[node] = node);
    }
    
    find(node: string): string {
        if (this.parent[node] === node) return node;
        return this.parent[node] = this.find(this.parent[node]);
    }
    
    union(node1: string, node2: string): boolean {
        const root1 = this.find(node1);
        const root2 = this.find(node2);
        if (root1 === root2) return false;
        this.parent[root1] = root2;
        return true;
    }
}

export function* generatePrimSteps(
    adj: Record<string, GraphEdge[]>, 
    startNode: string
): Generator<MSTStep> {
    const nodes = Object.keys(adj);
    const mstEdges: GraphEdge[] = [];
    const visited = new Set<string>();
    visited.add(startNode);
    let totalWeight = 0;

    // Initial edges from start node
    let candidates = [...adj[startNode]];
    
    yield {
        adj: adj,
        mstEdges: [],
        visitedNodes: [startNode],
        candidateEdges: [...candidates],
        message: `Start Prim's algorithm at node ${startNode}. Add neighbors to priority queue.`,
        lineNumber: 1,
        totalWeight: 0
    };

    while (visited.size < nodes.length && candidates.length > 0) {
        // Find min edge connecting visited to unvisited
        // Sort candidates by weight (inefficient but simple for viz)
        candidates.sort((a,b) => a.weight - b.weight);
        
        let bestEdge: GraphEdge | null = null;
        let nextNode = '';
        
        // Find first valid edge
        // In optimization we would remove invalid edges, but here we just iterate
        // Actually for simplicity, let's just keep valid edges in candidates
        // Filtering valid candidates: one end in visited, other not
        
        const validCandidates = candidates.filter(e => 
            (visited.has(e.from) && !visited.has(e.to)) || 
            (visited.has(e.to) && !visited.has(e.from))
        );

        if (validCandidates.length === 0) break; // Disconnected graph

        bestEdge = validCandidates[0]; // Min weight
        nextNode = visited.has(bestEdge.from) ? bestEdge.to : bestEdge.from;

        yield {
            adj: adj,
            mstEdges: [...mstEdges],
            visitedNodes: Array.from(visited),
            activeEdge: bestEdge,
            candidateEdges: [...validCandidates],
            message: `Selected minimum weight edge ${bestEdge.from}-${bestEdge.to} (weight ${bestEdge.weight})`,
            lineNumber: 2,
            totalWeight
        };

        visited.add(nextNode);
        mstEdges.push(bestEdge);
        totalWeight += bestEdge.weight;

        // Add new candidates
        const newEdges = adj[nextNode].filter(e => {
            const other = e.from === nextNode ? e.to : e.from;
            return !visited.has(other);
        });
        candidates = [...candidates, ...newEdges]; // Add edges from new node

         yield {
            adj: adj,
            mstEdges: [...mstEdges],
            visitedNodes: Array.from(visited),
            candidateEdges: [...candidates], // Show raw candidates
            message: `Added node ${nextNode} to MST. Total Weight: ${totalWeight}`,
            lineNumber: 3,
            totalWeight
        };
    }
    
    yield {
        adj: adj,
        mstEdges: [...mstEdges],
        visitedNodes: Array.from(visited),
        candidateEdges: [],
        message: `Prim's MST Complete. Total Weight: ${totalWeight}`,
        lineNumber: 4,
        totalWeight
    };
}

export function* generateKruskalSteps(
    adj: Record<string, GraphEdge[]>
): Generator<MSTStep> {
    const nodes = Object.keys(adj);
    // Gather all unique edges
    const allEdges: GraphEdge[] = [];
    const seenEdges = new Set<string>();
    
    Object.values(adj).flat().forEach(e => {
        // Normalize edge key to avoid duplicates in undirected graph
        const key = [e.from, e.to].sort().join('-');
        if (!seenEdges.has(key)) {
            seenEdges.add(key);
            allEdges.push(e);
        }
    });

    allEdges.sort((a, b) => a.weight - b.weight);

    const uf = new UnionFind(nodes);
    const mstEdges: GraphEdge[] = [];
    let totalWeight = 0;

    yield {
        adj: adj,
        mstEdges: [],
        visitedNodes: [],
        candidateEdges: [...allEdges],
        message: `Sort all edges by weight. Initialize Disjoint Set for each node.`,
        lineNumber: 1,
        totalWeight: 0
    };

    for (const edge of allEdges) {
        yield {
            adj: adj,
            mstEdges: [...mstEdges],
            visitedNodes: nodes.filter(n => uf.parent[n] !== n), // Visualization approximation
            activeEdge: edge,
            candidateEdges: [...allEdges], // Show global list
            message: `Evaluate edge ${edge.from}-${edge.to} (weight ${edge.weight}). Check for cycle.`,
            lineNumber: 2,
            totalWeight
        };

        if (uf.union(edge.from, edge.to)) {
            mstEdges.push(edge);
            totalWeight += edge.weight;
            
            yield {
                adj: adj,
                mstEdges: [...mstEdges],
                visitedNodes: [], // Not really relevant in Kruskal's same way as Prim
                activeEdge: edge,
                candidateEdges: [...allEdges],
                message: `No cycle detected. Add ${edge.from}-${edge.to} to MST.`,
                lineNumber: 3,
                totalWeight
            };
        } else {
            yield {
                adj: adj,
                mstEdges: [...mstEdges],
                visitedNodes: [],
                activeEdge: edge,
                candidateEdges: [...allEdges],
                message: `Edge ${edge.from}-${edge.to} creates a cycle. Discard.`,
                lineNumber: 4,
                totalWeight
            };
        }
        
        if (mstEdges.length === nodes.length - 1) break; 
    }

    yield {
        adj: adj,
        mstEdges: [...mstEdges],
        visitedNodes: nodes,
        candidateEdges: [],
        message: `Kruskal's MST Complete. Total Weight: ${totalWeight}`,
        lineNumber: 5,
        totalWeight
    };
}
