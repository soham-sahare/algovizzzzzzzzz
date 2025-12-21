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
        lineNumber: 1,
        message: `Creating new node ${value}`
    };

    // Step 2: Link New -> Old Head
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id, nodes[0].id],
        pointers: { [newNode.id]: "New", [nodes[0].id]: "Old Head" },
        lineNumber: 5,
        message: "New node points to Old Head."
    };

    // Step 3: Find Tail to update its next
    const tailIndex = nodes.length; // Actually it's just the last one in the visual array
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [nodes[nodes.length - 1].id],
        pointers: { [nodes[nodes.length - 1].id]: "Tail" },
        lineNumber: 6,
        message: "Locating Tail to update its cycle link..."
    };

    // Step 4: Update Tail -> New Head (Visual only since arrows are implicit or 'Next->Head')
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [nodes[nodes.length - 1].id, newNode.id],
        pointers: { [newNode.id]: "Head", [nodes[nodes.length - 1].id]: "Tail" },
        lineNumber: 6,
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
            lineNumber: 2,
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
        lineNumber: 4,
        message: "Appended new node."
    };

    yield {
        nodes: newNodes,
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "Tail" },
        lineNumber: 5,
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
        lineNumber: 1, // Target Head
        message: "Targeting Head."
    };

    // Need to update Tail
    const tail = nodes[nodes.length - 1];
    yield {
        nodes,
        highlightedNodes: [tail.id],
        pointers: { [tail.id]: "Tail" },
        lineNumber: 4,
        message: "Tail link must be updated..."
    };

    // Remove Head
    yield {
        nodes: nodes.slice(1),
        highlightedNodes: [tail.id, nodes[1].id],
        pointers: { [nodes[1].id]: "New Head", [tail.id]: "Tail" },
        lineNumber: 3,
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
            lineNumber: 4,
            message: "Traversing..."
        };
    }

    const newTail = nodes[nodes.length - 2];
    const oldTail = nodes[nodes.length - 1];

    yield {
        nodes,
        highlightedNodes: [oldTail.id],
        pointers: { [newTail.id]: "New Tail", [oldTail.id]: "Delete" },
        lineNumber: 4,
        message: "Found Tail."
    };

    yield {
        nodes: nodes.slice(0, nodes.length - 1),
        highlightedNodes: [newTail.id],
        pointers: { [newTail.id]: "Tail" },
        lineNumber: 5,
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

export function* generateCircularCheckSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    if (nodes.length === 0) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Empty list." };
         return;
    }

    // Naive check by traversing to end and seeing if next is head
    // (Since our data model is an array, we simulate the structure)
    
    // Step 1: Head
    yield {
        nodes,
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "Head" },
        lineNumber: 1,
        message: "Checking Head..."
    };
    
    // Check Tail
    const tail = nodes[nodes.length - 1];
    yield {
        nodes,
        highlightedNodes: [tail.id],
        pointers: { [tail.id]: "Tail" },
        lineNumber: 2,
        message: "Checking Tail node..."
    };

    // Verify Link
    yield {
        nodes,
        highlightedNodes: [tail.id, nodes[0].id],
        pointers: { [tail.id]: "Tail", [nodes[0].id]: "Head" },
        lineNumber: 3,
        message: "Tail.next points to Head? Yes. It is Circular."
    };
}

export function* generateCircularSplitSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
     // Tortoise and Hare to find mid
     let nodes = clone(currentNodes);
     if (nodes.length < 2) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "List too small to split." };
         return;
     }

     let slow = 0;
     let fast = 0;
     
     // Visual loop to find mid
     while (fast < nodes.length - 1 && (fast + 2) < nodes.length) { // Simplified logic for array-based simulation
         yield {
             nodes,
             highlightedNodes: [nodes[slow].id, nodes[fast].id],
             pointers: { [nodes[slow].id]: "Slow", [nodes[fast].id]: "Fast" },
             lineNumber: 2,
             message: "Finding middle..."
         };
         slow++;
         fast += 2;
     }
    yield {
         nodes,
         highlightedNodes: [nodes[slow].id],
         pointers: { [nodes[slow].id]: "Mid" },
         lineNumber: 3,
         message: "Found middle node."
     };
     
     // Split
     const head1 = nodes[0];
     const tail1 = nodes[slow];
     const head2 = nodes[slow + 1];
     const tail2 = nodes[nodes.length - 1];

     yield {
         nodes,
         highlightedNodes: [tail1.id, head2.id],
         pointers: { [tail1.id]: "Tail1", [head2.id]: "Head2" },
         lineNumber: 4,
         message: "Splitting list here..."
     };
     
     // Visualization note: splitting fully in the UI is hard with one array.
     // We will conceptually show them as "Split" by color or message.
     // Or we can just highlight the cut point.
     
     yield {
         nodes,
         highlightedNodes: [tail1.id, tail2.id],
         pointers: { [tail1.id]: "Tail1 -> Head1", [tail2.id]: "Tail2 -> Head2" },
         lineNumber: 5,
         message: "Lists split into two halves."
     };
}

export function* generateJosephusSteps(currentNodes: LinkedListNode[], k: number): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if (nodes.length === 0 || k < 1) return;

    let index = 0; // Start at head
    
    while (nodes.length > 1) {
        // Count k steps
        for(let step = 1; step < k; step++) {
             // visually traverse
             yield {
                nodes: clone(nodes), // keep stable reference if possible, but cloning is safer for safety
                highlightedNodes: [nodes[index].id],
                pointers: { [nodes[index].id]: "Curr" },
                lineNumber: 2,
                message: `Skipping... (${step}/${k})`
            };
            index = (index + 1) % nodes.length;
        }

        const eliminatedNode = nodes[index];
        yield {
            nodes: clone(nodes),
            highlightedNodes: [eliminatedNode.id],
            pointers: { [eliminatedNode.id]: "Eliminate" },
            lineNumber: 3,
            message: `Eliminating ${eliminatedNode.value}!`
        };

        nodes.splice(index, 1);
        // Next person starts from the same index (because list shifted left)
        index = index % nodes.length;

        yield {
            nodes: clone(nodes),
            highlightedNodes: [],
            pointers: {},
            lineNumber: 4,
            message: "Node removed. Circle shrinks."
        };
    }

    yield {
        nodes: clone(nodes),
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "Winner" },
        lineNumber: 5,
        message: `Winner is ${nodes[0].value}!`
    };
}
