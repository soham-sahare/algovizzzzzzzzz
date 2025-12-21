import { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";

export type LinkedListStep = {
    nodes: LinkedListNode[];
    auxiliaryNodes?: LinkedListNode[]; // For second list or result list
    highlightedNodes: string[];
    pointers: { [id: string]: string };
    lineNumber?: number;
    message?: string;
};

const clone = (nodes: LinkedListNode[]) => nodes.map(n => ({...n}));

// --- INTERSECTION OPERATIONS ---

export function* generateIntersectionSteps(listA: LinkedListNode[], listB: LinkedListNode[]): Generator<LinkedListStep> {
    const nodesA = clone(listA);
    const nodesB = clone(listB);
    
    // We assume lists intersect at a specific node VALUE or ID.
    // Let's assume matching IDs = intersection.
    
    let ptrA: LinkedListNode | undefined = nodesA[0];
    let ptrB: LinkedListNode | undefined = nodesB[0];
    let switchedA = false; 
    let switchedB = false;

    // Helper to find next node
    const advance = (curr: LinkedListNode, listContext: LinkedListNode[]) => {
        // Find index of curr in listContext, then get next
        const idx = listContext.findIndex(n => n.id === curr.id);
        if (idx !== -1 && idx < listContext.length - 1) return listContext[idx+1];
        return undefined; // End of list
    };

    yield {
        nodes: nodesA,
        auxiliaryNodes: nodesB,
        highlightedNodes: [nodesA[0]?.id, nodesB[0]?.id].filter(Boolean),
        pointers: { [nodesA[0]?.id]: "Ptr A", [nodesB[0]?.id]: "Ptr B" },
        message: "Initialize Pointers at both heads."
    };

    while (ptrA || ptrB) {
        // Strict reference/ID equality
        if (ptrA && ptrB && ptrA.id === ptrB.id) {
             yield {
                nodes: nodesA,
                auxiliaryNodes: nodesB,
                highlightedNodes: [ptrA.id],
                pointers: { [ptrA.id]: "Intersection" },
                message: `Intersection found at node ${ptrA.value}!`
            };
            return;
        }
        
        yield {
            nodes: nodesA,
            auxiliaryNodes: nodesB,
            highlightedNodes: [ptrA?.id, ptrB?.id].filter(Boolean) as string[],
            pointers: { 
                ...(ptrA ? {[ptrA.id]: "Ptr A"} : {}),
                ...(ptrB ? {[ptrB.id]: "Ptr B"} : {})
            },
            message: "Advancing pointers..."
        };

        // Advance Ptr A
        if (ptrA) {
             let nextA: LinkedListNode | undefined;
             if (!switchedA) nextA = advance(ptrA, nodesA);
             else nextA = advance(ptrA, nodesB);

             if (nextA) ptrA = nextA;
             else {
                 if (!switchedA) {
                     switchedA = true;
                     ptrA = nodesB[0];
                     yield {
                        nodes: nodesA,
                        auxiliaryNodes: nodesB,
                        highlightedNodes: [],
                        pointers: { [ptrA!.id]: "Ptr A" },
                        message: "Ptr A reached end. Switching to Head B."
                    };
                 } else {
                     ptrA = undefined;
                 }
             }
        } 
        
        // Advance Ptr B
        if (ptrB) {
             let nextB: LinkedListNode | undefined;
             if (!switchedB) nextB = advance(ptrB, nodesB);
             else nextB = advance(ptrB, nodesA);

             if (nextB) ptrB = nextB;
             else {
                 if (!switchedB) {
                     switchedB = true;
                     ptrB = nodesA[0];
                     yield {
                        nodes: nodesA,
                        auxiliaryNodes: nodesB,
                        highlightedNodes: [],
                        pointers: { [ptrB!.id]: "Ptr B" },
                        message: "Ptr B reached end. Switching to Head A."
                    };
                 } else {
                     ptrB = undefined;
                 }
             }
        }
        
        if (!ptrA && !ptrB) break;
    }
    
    yield {
        nodes: nodesA,
        auxiliaryNodes: nodesB,
        highlightedNodes: [],
        pointers: {},
        message: "No intersection found."
    };
}

// --- UNION OPERATIONS ---

export function* generateUnionSteps(listA: LinkedListNode[], listB: LinkedListNode[]): Generator<LinkedListStep> {
    const nodesA = clone(listA);
    const nodesB = clone(listB);
    
    let resultNodes: LinkedListNode[] = [];
    const addedIds = new Set<string>();
    
    // Add all from A
    for (let i = 0; i < nodesA.length; i++) {
        const node = nodesA[i];
        
        yield {
            nodes: nodesA,
            auxiliaryNodes: nodesB, 
            highlightedNodes: [node.id],
            pointers: { [node.id]: "Scanning" },
            message: `Scanning List A: ${node.value}`
        };
        
        if (!addedIds.has(node.id)) {
            addedIds.add(node.id);
            resultNodes.push({ ...node, id: node.id + "_u" }); // Clone ID for result
             yield {
                nodes: nodesA,
                auxiliaryNodes: nodesB,
                highlightedNodes: [node.id],
                pointers: { [node.id]: "Added" },
                message: `Added ${node.value} to Union.`
            };
        }
    }
    
    // Add unique from B
    for (let i = 0; i < nodesB.length; i++) {
        const node = nodesB[i];
         yield {
            nodes: nodesA,
            auxiliaryNodes: nodesB,
            highlightedNodes: [node.id],
            pointers: { [node.id]: "Scanning" },
            message: `Scanning List B: ${node.value}`
        };
        
        // Value-based union check
        const alreadyIn = resultNodes.some(r => r.value === node.value);
            
        if (!alreadyIn) {
             resultNodes.push({ ...node, id: node.id + "_u2" }); 
             yield {
                nodes: nodesA,
                auxiliaryNodes: nodesB,
                highlightedNodes: [node.id],
                pointers: { [node.id]: "Added" },
                message: `Added ${node.value} to Union`
            };
        } else {
            yield {
                nodes: nodesA,
                auxiliaryNodes: nodesB,
                highlightedNodes: [node.id],
                pointers: { [node.id]: "Skipping" },
                message: `Skipping ${node.value} (Already exists)`
            };
        }
    }
    
    // Final Step shows the Result List
    yield {
        nodes: resultNodes,
        auxiliaryNodes: undefined, // Clear aux
        highlightedNodes: [],
        pointers: {},
        message: "Union Complete. Showing Result List."
    };
}
