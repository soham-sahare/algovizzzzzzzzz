import { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { LinkedListStep } from "./singly";

// Helper to clone nodes
const clone = (nodes: LinkedListNode[]) => nodes.map(n => ({...n}));

export function* generateCircularInsertHeadSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };

    // Case: Empty List
    if (nodes.length === 0) {
        yield {
            nodes: [newNode],
            highlightedNodes: [newNode.id],
            pointers: { [newNode.id]: "Head/Tail" },
            message: "Empty list. New node points to itself."
        };
        return;
    }

    // Step 1: Create Node
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New" },
        message: `Creating new node ${value}`
    };

    // Step 2: Link New -> Old Head
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id, nodes[0].id],
        pointers: { [newNode.id]: "New", [nodes[0].id]: "Old Head" },
        message: "New node points to Old Head."
    };

    // Step 3: Find Tail to update its next
    const tailIndex = nodes.length; // Actually it's just the last one in the visual array
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [nodes[nodes.length - 1].id],
        pointers: { [nodes[nodes.length - 1].id]: "Tail" },
        message: "Locating Tail to update its cycle link..."
    };

    // Step 4: Update Tail -> New Head (Visual only since arrows are implicit or 'Next->Head')
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [nodes[nodes.length - 1].id, newNode.id],
        pointers: { [newNode.id]: "Head", [nodes[nodes.length - 1].id]: "Tail" },
        message: "Updated Tail to point to New Head."
    };
}

export function* generateCircularInsertTailSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };

    if (nodes.length === 0) {
        yield* generateCircularInsertHeadSteps(currentNodes, value);
        return;
    }

    // Traverse to tail
    for (let i = 0; i < nodes.length; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            message: "Traversing..."
        };
    }

    const oldTail = nodes[nodes.length - 1];
    
    // Append
    const newNodes = [...nodes, newNode];
    yield {
        nodes: newNodes,
        highlightedNodes: [newNode.id],
        pointers: { [oldTail.id]: "Old Tail", [newNode.id]: "New Tail" },
        message: "Appended new node."
    };

    yield {
        nodes: newNodes,
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "Tail" },
        message: "New Tail now points back to Head."
    };
}

export function* generateCircularDeleteHeadSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    if (nodes.length === 0) return;

    if (nodes.length === 1) {
        yield {
            nodes: [],
            highlightedNodes: [],
            pointers: {},
            message: "List is now empty."
        };
        return;
    }

    yield {
        nodes,
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "Delete" },
        message: "Targeting Head."
    };

    // Need to update Tail
    const tail = nodes[nodes.length - 1];
    yield {
        nodes,
        highlightedNodes: [tail.id],
        pointers: { [tail.id]: "Tail" },
        message: "Tail link must be updated..."
    };

    // Remove Head
    yield {
        nodes: nodes.slice(1),
        highlightedNodes: [tail.id, nodes[1].id],
        pointers: { [nodes[1].id]: "New Head", [tail.id]: "Tail" },
        message: "Removed Head. Tail now points to New Head."
    };
}

export function* generateCircularDeleteTailSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    if (nodes.length === 0) return;
    if (nodes.length === 1) {
        yield* generateCircularDeleteHeadSteps(currentNodes);
        return;
    }

    // Traverse
    for (let i = 0; i < nodes.length - 1; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            message: "Traversing..."
        };
    }

    const newTail = nodes[nodes.length - 2];
    const oldTail = nodes[nodes.length - 1];

    yield {
        nodes,
        highlightedNodes: [oldTail.id],
        pointers: { [newTail.id]: "New Tail", [oldTail.id]: "Delete" },
        message: "Found Tail."
    };

    yield {
        nodes: nodes.slice(0, nodes.length - 1),
        highlightedNodes: [newTail.id],
        pointers: { [newTail.id]: "Tail" },
        message: "Removed Old Tail. New Tail points to Head."
    };
}

export function* generateCircularSearchSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = currentNodes;
    
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 2,
            message: `Checking node ${nodes[i].value}...`
        };

        if (nodes[i].value === value) {
             yield {
                nodes,
                highlightedNodes: [nodes[i].id],
                pointers: { [nodes[i].id]: "Found" },
                lineNumber: 3,
                message: `Found ${value}!`
            };
            found = true;
            break;
        }
    }

    if (!found) {
        yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 5, message: "Value not found." };
    }
}

export function* generateCircularInsertAtPositionSteps(currentNodes: LinkedListNode[], value: number, index: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    if (index < 0 || index > nodes.length) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
         return;
    }

    if (index === 0) {
        yield* generateCircularInsertHeadSteps(nodes, value);
        return;
    }
    
    if (index === nodes.length) {
        yield* generateCircularInsertTailSteps(nodes, value);
        return;
    }

    // Traverse
    for (let i = 0; i < index - 1; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 4,
            message: "Traversing..."
        };
    }

    const prevNode = nodes[index - 1];
    yield {
        nodes,
        highlightedNodes: [prevNode.id],
        pointers: { [prevNode.id]: "Prev" },
        lineNumber: 5,
        message: "Found prev node."
    };

    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };
    
    const newNodesList = [...nodes];
    newNodesList.splice(index, 0, newNode);
    
    yield {
        nodes: newNodesList,
        highlightedNodes: [newNode.id],
        pointers: { [prevNode.id]: "Prev", [newNode.id]: "New" },
        lineNumber: 6,
        message: "Inserting new node..."
    };
    
    yield {
        nodes: newNodesList,
        highlightedNodes: [],
        pointers: {},
        lineNumber: 7,
        message: "Inserted. Links updated."
    };
}

export function* generateCircularDeleteAtPositionSteps(currentNodes: LinkedListNode[], index: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);

    if (index < 0 || index >= nodes.length) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
         return;
    }

    if (index === 0) {
        yield* generateCircularDeleteHeadSteps(nodes);
        return;
    }
    
    if (index === nodes.length - 1) {
        yield* generateCircularDeleteTailSteps(nodes);
        return;
    }

    // Traverse
    for (let i = 0; i < index - 1; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 4,
            message: "Traversing..."
        };
    }

    const prevNode = nodes[index - 1];
    const targetNode = nodes[index];

    yield {
        nodes,
        highlightedNodes: [targetNode.id],
        pointers: { [prevNode.id]: "Prev", [targetNode.id]: "Target" },
        lineNumber: 5,
        message: "Found target."
    };

    nodes.splice(index, 1);

    yield {
        nodes: clone(nodes),
        highlightedNodes: [],
        pointers: {},
        lineNumber: 6,
        message: "Node deleted. Prev points to Next."
    };
}

export function* generateCircularDeleteValueSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    
    if (nodes.length === 0) return;

    // Head check
    if (nodes[0].value === value) {
        yield* generateCircularDeleteHeadSteps(nodes);
        return;
    }

    let found = false;
    for (let i = 0; i < nodes.length; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 3,
            message: `Checking ${nodes[i].value}...`
        };

        if (nodes[i].value === value) {
             if (i === nodes.length - 1) {
                 yield* generateCircularDeleteTailSteps(nodes);
                 return;
             }

             const prev = nodes[i-1];
             const target = nodes[i];

             yield {
                nodes,
                highlightedNodes: [target.id],
                pointers: { [prev.id]: "Prev", [target.id]: "Target" },
                lineNumber: 5,
                message: "Found value."
            };
            
            nodes.splice(i, 1);
            
            yield {
                nodes: clone(nodes),
                highlightedNodes: [prev.id],
                pointers: { [prev.id]: "Prev" },
                lineNumber: 6,
                message: "Node removed."
            };
            found = true;
            break;
        }
    }
    
    if (!found) {
         yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 7, message: "Value not found." };
    }
}

export function* generateCircularReverseSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    if (nodes.length <= 1) return;
    
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 2, message: "Reversing..." };

    for (let i = 0; i < nodes.length; i++) {
        yield { 
            nodes, 
            highlightedNodes: [nodes[i].id], 
            pointers: { [nodes[i].id]: "Curr" }, 
            lineNumber: 3,
            message: "Reversing link..." 
        };
    }

    const reversedNodes = [...nodes].reverse();
    yield {
        nodes: reversedNodes,
        highlightedNodes: [],
        pointers: {},
        lineNumber: 5,
        message: "Reversed! Tail now points to new Head."
    };
}
