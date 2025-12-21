import { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";
import { LinkedListStep } from "./singly";

// Helper to clone nodes
const clone = (nodes: LinkedListNode[]) => nodes.map(n => ({...n}));

export function* generateDoublyInsertHeadSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    // Create new node
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };
    
    // Step 1: Create Node
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New" },
        message: `Creating new node ${value}`
    };

    if (nodes.length > 0) {
        // Step 2: Link New -> Old Head
        yield {
            nodes: [newNode, ...nodes],
            highlightedNodes: [newNode.id, nodes[0].id],
            pointers: { [newNode.id]: "New", [nodes[0].id]: "Old Head" },
            message: "Setting NewNode.next = Head"
        };
        
        // Step 3: Link Old Head -> New (Prev)
        yield {
            nodes: [newNode, ...nodes],
            highlightedNodes: [nodes[0].id],
            pointers: { [nodes[0].id]: "Old Head" },
            message: "Setting Head.prev = NewNode"
        };
    }

    // Step 4: Update Head
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "Head" },
        message: "Updating Head pointer"
    };
}

export function* generateDoublyInsertTailSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };

    if (nodes.length === 0) {
        yield* generateDoublyInsertHeadSteps(currentNodes, value);
        return;
    }

    // Traverse
    for (let i = 0; i < nodes.length; i++) {
        yield {
            nodes: nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            message: "Traversing to tail..."
        };
    }

    const lastNode = nodes[nodes.length - 1];

    // Append visually
    const newNodes = [...nodes, newNode];
    yield {
        nodes: newNodes,
        highlightedNodes: [lastNode.id, newNode.id],
        pointers: { [lastNode.id]: "Tail", [newNode.id]: "New" },
        message: "Setting Tail.next = NewNode"
    };
    
    yield {
        nodes: newNodes,
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New Tail" },
        message: "Setting NewNode.prev = OldTail"
    };
}

export function* generateDoublyDeleteHeadSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    if (nodes.length === 0) return;

    yield {
        nodes,
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "DELETE" },
        message: "Targeting Head for deletion"
    };

    if (nodes.length === 1) {
        yield {
            nodes: [],
            highlightedNodes: [],
            pointers: {},
            message: "List is now empty."
        };
        return;
    }

    // Move Head
    const newHead = nodes[1];
    yield {
        nodes,
        highlightedNodes: [newHead.id],
        pointers: { [nodes[0].id]: "Old", [newHead.id]: "New Head" },
        message: "Move Head to next node"
    };

    // Remove Old
    yield {
        nodes: nodes.slice(1),
        highlightedNodes: [newHead.id],
        pointers: { [newHead.id]: "Head" },
        message: "Old Head removed. Setting NewHead.prev = null"
    };
}

export function* generateDoublyDeleteTailSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    if (nodes.length === 0) return;
    if (nodes.length === 1) {
        yield* generateDoublyDeleteHeadSteps(currentNodes);
        return;
    }

    // Traverse
    for (let i = 0; i < nodes.length; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            message: "Traversing to tail..."
        };
    }

    const tail = nodes[nodes.length - 1];
    const newTail = nodes[nodes.length - 2];

    yield {
        nodes,
        highlightedNodes: [tail.id],
        pointers: { [tail.id]: "Tail", [newTail.id]: "New Tail" },
        message: "Found tail."
    };

    yield {
        nodes: nodes.slice(0, nodes.length - 1),
        highlightedNodes: [newTail.id],
        pointers: { [newTail.id]: "Tail" },
        message: "Removed tail. Setting NewTail.next = null"
    };
}

export function* generateDoublySearchSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = currentNodes;
    
    // Traverse
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 2, // Matches search pseudocode line
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
        yield {
            nodes,
            highlightedNodes: [],
            pointers: {},
            lineNumber: 5,
            message: "Value not found."
        };
    }
}

export function* generateDoublyInsertAtPositionSteps(currentNodes: LinkedListNode[], value: number, index: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    if (index < 0 || index > nodes.length) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
         return;
    }

    if (index === 0) {
        yield* generateDoublyInsertHeadSteps(nodes, value);
        return;
    }
    
    if (index === nodes.length) {
        yield* generateDoublyInsertTailSteps(nodes, value);
        return;
    }

    // Traverse to index - 1
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
        message: "Found previous node."
    };

    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };
    const nextNode = nodes[index];
    
    // Insert visually
    const newNodesList = [...nodes];
    newNodesList.splice(index, 0, newNode);
    
    yield {
        nodes: newNodesList,
        highlightedNodes: [newNode.id],
        pointers: { [prevNode.id]: "Prev", [newNode.id]: "New", [nextNode.id]: "Next" },
        lineNumber: 6,
        message: "Inserting new node..."
    };
    
    // Update pointers message
    yield {
        nodes: newNodesList,
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New" },
        lineNumber: 7,
        message: "Updated Prev.next, New.prev, New.next, Next.prev"
    };
}

export function* generateDoublyDeleteAtPositionSteps(currentNodes: LinkedListNode[], index: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);

    if (index < 0 || index >= nodes.length) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
         return;
    }

    if (index === 0) {
        yield* generateDoublyDeleteHeadSteps(nodes);
        return;
    }
    
    if (index === nodes.length - 1) {
        yield* generateDoublyDeleteTailSteps(nodes);
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
    const nextNode = nodes[index + 1];

    yield {
        nodes,
        highlightedNodes: [targetNode.id],
        pointers: { [prevNode.id]: "Prev", [targetNode.id]: "Target", [nextNode.id]: "Next" },
        lineNumber: 5,
        message: "Found target to delete."
    };

    nodes.splice(index, 1);

    yield {
        nodes: clone(nodes),
        highlightedNodes: [],
        pointers: {},
        lineNumber: 6,
        message: "Node deleted. Re-linked Prev and Next."
    };
}

export function* generateDoublyDeleteValueSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    
    if (nodes.length === 0) return;

    // Head case
    if (nodes[0].value === value) {
        yield* generateDoublyDeleteHeadSteps(nodes);
        return;
    }

    // Traverse
    let found = false;
    for (let i = 0; i < nodes.length; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 3,
            message: `Checking node ${nodes[i].value}...`
        };

        if (nodes[i].value === value) {
             const targetIndex = i;
             if (targetIndex === nodes.length - 1) {
                 yield* generateDoublyDeleteTailSteps(nodes);
                 return;
             }

             // Middle delete
             const prev = nodes[i-1];
             const target = nodes[i];
             const next = nodes[i+1];

             yield {
                nodes,
                highlightedNodes: [target.id],
                pointers: { [prev.id]: "Prev", [target.id]: "Target", [next.id]: "Next" },
                lineNumber: 4,
                message: `Found ${value}!`
            };
            
            nodes.splice(i, 1);
            
            yield {
                nodes: clone(nodes),
                highlightedNodes: [prev.id],
                pointers: { [prev.id]: "Prev" },
                lineNumber: 5,
                message: "Node removed, pointers updated."
            };
            found = true;
            break;
        }
    }
    
    if (!found) {
        yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 6, message: "Value not found." };
    }
}

export function* generateDoublyReverseSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if (nodes.length <= 1) return;
    
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 2, message: "Starting Reverse..." };

    // In a DLL, we swap prev and next for EVERY node.
    // For visualization we just show it traversing and then flipping at the end.
    
    for (let i = 0; i < nodes.length; i++) {
         yield { 
             nodes, 
             highlightedNodes: [nodes[i].id], 
             pointers: { [nodes[i].id]: "Curr" }, 
             lineNumber: 3,
             message: `Swapping prev/next for ${nodes[i].value}...` 
         };
    }

    const reversedNodes = [...nodes].reverse();
    yield {
        nodes: reversedNodes,
        highlightedNodes: [],
        pointers: {},
        lineNumber: 5,
        message: "List Reversed!"
    };
}

export function* generateDoublyTraverseForwardSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    for (let i = 0; i < nodes.length; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            message: `Visiting node ${nodes[i].value}`
        };
    }
    yield { nodes, highlightedNodes: [], pointers: {}, message: "Traversal Complete" };
}

export function* generateDoublyTraverseBackwardSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    for (let i = nodes.length - 1; i >= 0; i--) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            message: `Visiting node ${nodes[i].value}`
        };
    }
    yield { nodes, highlightedNodes: [], pointers: {}, message: "Backward Traversal Complete" };
}

export function* generateDoublyInsertBeforeNodeSteps(currentNodes: LinkedListNode[], targetVal: number, newVal: number): Generator<LinkedListStep> {
     const nodes = clone(currentNodes);
     let targetIndex = -1;

     // Find target
     for(let i=0; i<nodes.length; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            message: `Searching for ${targetVal}...`
        };
        if(nodes[i].value === targetVal) {
            targetIndex = i;
            yield {
                nodes,
                highlightedNodes: [nodes[i].id],
                pointers: { [nodes[i].id]: "Target" },
                message: `Found target ${targetVal} at index ${i}`
            };
            break;
        }
     }

     if(targetIndex === -1) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: `Target ${targetVal} not found.` };
         return;
     }

     if(targetIndex === 0) {
         yield* generateDoublyInsertHeadSteps(nodes, newVal);
         return;
     }

     const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value: newVal };
     const prevNode = nodes[targetIndex - 1];
     const targetNode = nodes[targetIndex];

     const newNodesList = [...nodes];
     newNodesList.splice(targetIndex, 0, newNode);

     yield {
        nodes: newNodesList,
        highlightedNodes: [newNode.id],
        pointers: { [prevNode.id]: "Prev", [newNode.id]: "New", [targetNode.id]: "Target" },
        message: "Inserting New Node before Target..."
     };

     yield {
        nodes: newNodesList,
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New" },
        message: "Updated pointers (Prev.next, New.prev, New.next, Target.prev)"
     };
}
