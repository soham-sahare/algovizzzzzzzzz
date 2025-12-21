import { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";

export type LinkedListStep = {
    nodes: LinkedListNode[];
    highlightedNodes: string[];
    pointers: { [id: string]: string };
    lineNumber?: number;
    message?: string;
};

// Helper to clone nodes
const clone = (nodes: LinkedListNode[]) => nodes.map(n => ({...n}));

export function* generateInsertHeadSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    // Create new node
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };
    
    // Step 1: Create Node
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New" },
        lineNumber: 2,
        message: `Creating new node with value ${value}`
    };

    // Step 2: Point new node to Head
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New", ...(nodes.length > 0 ? {[nodes[0].id]: "Head"} : {}) },
        lineNumber: 3,
        message: "Setting new node's next to current Head"
    };

    // Step 3: Update Head
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "Head" },
        lineNumber: 4,
        message: "Updating Head to new node"
    };
}

export function* generateInsertTailSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };

    if (nodes.length === 0) {
        yield* generateInsertHeadSteps(currentNodes, value);
        return;
    }

    // Traverse to end
    for (let i = 0; i < nodes.length; i++) {
        yield {
            nodes: nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr", [nodes[0].id]: "Head" },
            lineNumber: 4, 
            message: "Traversing to last node..."
        };
    }

    // Found tail
    const lastNode = nodes[nodes.length - 1];
    yield {
        nodes: nodes,
        highlightedNodes: [lastNode.id],
        pointers: { [lastNode.id]: "Tail" },
        lineNumber: 5,
        message: "Found tail node"
    };

    // Append
    yield {
        nodes: [...nodes, newNode],
        highlightedNodes: [newNode.id],
        pointers: { [lastNode.id]: "Prev", [newNode.id]: "New Tail" },
        lineNumber: 6,
        message: "Linking previous tail to new node"
    };
}

export function* generateSearchSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    if (nodes.length === 0) {
        yield {
            nodes,
            highlightedNodes: [],
            pointers: {},
            message: "List is empty, not found."
        };
        return;
    }

    for (let i = 0; i < nodes.length; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 2,
            message: `Checking node with value ${nodes[i].value}...`
        };

        if (nodes[i].value === value) {
            yield {
                nodes,
                highlightedNodes: [nodes[i].id],
                pointers: { [nodes[i].id]: "Found!" },
                lineNumber: 3,
                message: `Found value ${value} at index ${i}!`
            };
            return;
        }
    }

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        lineNumber: 4,
        message: `Value ${value} not found in list.`
    };
}

export function* generateDeleteValueSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);

    if (nodes.length === 0) return;

        if (nodes[0].value === value) {
        yield {
            nodes,
            highlightedNodes: [nodes[0].id],
            pointers: { [nodes[0].id]: "Target" },
            lineNumber: 2,
            message: "Value found at Head. Deleting..."
        };
        yield {
            nodes: nodes.slice(1),
            highlightedNodes: [],
            pointers: nodes.length > 1 ? { [nodes[1].id]: "New Head" } : {},
            lineNumber: 2,
            message: "Head updated."
        };
        return;
    }

    // Traverse
    let found = false;
    for (let i = 0; i < nodes.length - 1; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr", [nodes[i+1].id]: "Next" },
            lineNumber: 4,
            message: `Checking next node (${nodes[i+1].value})...`
        };

        if (nodes[i+1].value === value) {
             yield {
                nodes,
                highlightedNodes: [nodes[i+1].id],
                pointers: { [nodes[i].id]: "Curr", [nodes[i+1].id]: "Target" },
                lineNumber: 5,
                message: `Found ${value}!`
            };
            
            // Delete
            nodes.splice(i+1, 1);
            
            yield {
                nodes: clone(nodes), // Updated list
                highlightedNodes: [nodes[i].id],
                pointers: { [nodes[i].id]: "Curr" },
                lineNumber: 6,
                message: "Node removed, links updated."
            };
            found = true;
            break;
        }
    }

    if (!found) {
        yield {
            nodes,
            highlightedNodes: [],
            pointers: {},
            message: "Value not found."
        };
    }
}

export function* generateInsertAtPositionSteps(currentNodes: LinkedListNode[], value: number, index: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    if (index < 0 || index > nodes.length) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
         return;
    }

    if (index === 0) {
        yield* generateInsertHeadSteps(nodes, value);
        return;
    }

    // Traverse to index - 1
    for (let i = 0; i < index - 1; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 3,
            message: "Traversing..."
        };
    }

    const prevNode = nodes[index - 1];
    yield {
        nodes,
        highlightedNodes: [prevNode.id],
        pointers: { [prevNode.id]: "Prev" },
        lineNumber: 4,
        message: "Found previous node."
    };

    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };
    
    // Insert visually
    const newNodesList = [...nodes];
    newNodesList.splice(index, 0, newNode);
    
    yield {
        nodes: newNodesList,
        highlightedNodes: [newNode.id],
        pointers: { [prevNode.id]: "Prev", [newNode.id]: "New" },
        lineNumber: 6,
        message: "Inserting new node..."
    };
    
    // Re-link visual (implicit in next state)
    yield {
        nodes: newNodesList,
        highlightedNodes: [],
        pointers: {},
        lineNumber: 7,
        message: "Inserted successfully."
    };
}

export function* generateDeleteAtPositionSteps(currentNodes: LinkedListNode[], index: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);

    if (index < 0 || index >= nodes.length) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
         return;
    }

    if (index === 0) {
        // Delete head visual
        yield { nodes, highlightedNodes: [nodes[0].id], pointers: { [nodes[0].id]: "Target" }, message: "Deleting Head..." };
        yield { nodes: nodes.slice(1), highlightedNodes: [], pointers: {}, message: "Head deleted." };
        return;
    }

    // Traverse
    for (let i = 0; i < index - 1; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 5,
            message: "Traversing..."
        };
    }

    const prevNode = nodes[index - 1];
    const targetNode = nodes[index];

    yield {
        nodes,
        highlightedNodes: [targetNode.id],
        pointers: { [prevNode.id]: "Prev", [targetNode.id]: "Target" },
        lineNumber: 6,
        message: "Found target to delete."
    };

    nodes.splice(index, 1);

    yield {
        nodes: clone(nodes),
        highlightedNodes: [],
        pointers: {},
        lineNumber: 7,
        message: "Node deleted."
    };
}

export function* generateReverseSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    // Reverse actually changes the structure significantly.
    // For visualization, we can just reverse the array of nodes if we treat index[i] -> index[i+1] as the link.
    // BUT true reversal changes pointers. 
    // Since our visualizer renders based on ARRAY ORDER (0->1->2), "Reversing" the list means we need to ACTUALLY reverse the array elements to show the new logical order 
    // OR change how visualizer renders (connections).
    // Given the visualizer assumes array order = list order, we just need to reverse the array in place step-by-step?
    // No, standard In-Place Reverse algorithm iterates and flips pointers.
    // To visualize this with our "Line of nodes" visualizer, the nodes would physically swap places or arrows would flip.
    // "Flipping arrows" is hard if visualizer hardcodes left-to-right.
    // SO: We will simulate the "Iterative Reverse" algorithm but at end of each step we might need to re-arrange nodes if we want to show strict connectivity, OR just accept arrows are conceptual.
    // BETTER: We just animate the array reversing.
    // BUT user wants ALGORITHM visualization.
    // Let's stick to simple "Reading" the array in reverse and building a new one? No that's cheating.
    // Let's implement the standard 3-pointer iterative reverse and visualize it by highlighting.
    // NOTE: The `LinkedListVisualizer` renders simple Left->Right. 
    // If we want to show 1->2 becoming 2->1 visually, we basically just reverse the array in the final step.
    // Intermediate steps: We can highlight Prev, Curr, Next.
    
    let nodes = clone(currentNodes);
    
    if (nodes.length <= 1) return;
    
    let prev = null;
    let curr = 0; // Index in the original array? No, `nodes` is the source of truth.
    // Actually, in array-backed linked list visualization, "Reversing" is essentially `nodes.reverse()`.
    // Let's animate the pointers moving.
    
    yield { nodes, highlightedNodes: [], pointers: { [nodes[0].id]: "Curr" }, message: "Starting Reverse..." };

    // We can't easily show arrows flipping individually without a graph visualizer.
    // We will show the pointers traversing, and then "Flip" the list at the end.
    
    for (let i = 0; i < nodes.length; i++) {
         yield { 
             nodes, 
             highlightedNodes: [nodes[i].id], 
             pointers: { 
                 [nodes[i].id]: "Curr", 
                 ...(i > 0 ? {[nodes[i-1].id]: "Prev"} : {}),
                 ...(i < nodes.length - 1 ? {[nodes[i+1].id]: "Next"} : {})
             }, 
             message: `Processing node ${nodes[i].value}...` 
         };
    }

    const reversedNodes = [...nodes].reverse();
    yield {
        nodes: reversedNodes,
        highlightedNodes: [],
        pointers: {},
        message: "List Reversed!"
    };
}
