
import { LinkedListStep } from "@/lib/algorithms/linkedList/singly";
import { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";

// Helper
const clone = (nodes: LinkedListNode[]) => nodes.map(n => ({...n}));

export function* generateEnqueueSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };
    
    // Step 1: Create Node
    yield {
        nodes: [...nodes], // Not added yet visually? Or separate? 
                           // Usually visualizer expects node in array.
                           // Let's add it but disconnected? Or just append.
        highlightedNodes: [],
        pointers: {},
        lineNumber: 1,
        message: `Created new node ${value}`
    };

    if (nodes.length === 0) {
        // Empty queue
        const newNodes = [newNode];
        yield {
            nodes: newNodes,
            highlightedNodes: [newNode.id],
            pointers: { [newNode.id]: "Front/Rear" },
            lineNumber: 2,
            message: "Queue empty. Read = Front = NewNode"
        };
    } else {
        // Append to Rear (Tail)
        const oldRear = nodes[nodes.length - 1];
        
        yield {
            nodes: [...nodes, newNode],
            highlightedNodes: [newNode.id],
            pointers: { [oldRear.id]: "Old Rear", [newNode.id]: "New" },
            lineNumber: 3,
            message: "Linking Old Rear -> New Node"
        };

        yield {
            nodes: [...nodes, newNode],
            highlightedNodes: [newNode.id],
            pointers: { [newNode.id]: "Rear", [nodes[0].id]: "Front" },
            lineNumber: 4,
            message: "Updated Rear pointer"
        };
    }
}

export function* generateDequeueSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    // Check Empty
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "Checking if empty..." };
    
    if (nodes.length === 0) {
         yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 2, message: "Queue Underflow (Empty)" };
         return;
    }

    const frontNode = nodes[0];
    
    yield {
        nodes,
        highlightedNodes: [frontNode.id],
        pointers: { [frontNode.id]: "Front" },
        lineNumber: 3,
        message: "Accessing Front node"
    };

    if (nodes.length === 1) {
         yield {
             nodes: [],
             highlightedNodes: [],
             pointers: {},
             lineNumber: 4,
             message: "Front = Front.next (now null). Rear = null."
         };
         return;
    }

    const newFront = nodes[1];
    yield {
        nodes: nodes.slice(1),
        highlightedNodes: [newFront.id],
        pointers: { [newFront.id]: "Front" },
        lineNumber: 4,
        message: "Front = Front.next"
    };
}

export function* generatePeekSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "Checking if empty..." };
    
    if (nodes.length === 0) {
         yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 2, message: "Queue is Empty" };
         return;
    }

    yield {
        nodes,
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "Front" },
        lineNumber: 3,
        message: `Front value is ${nodes[0].value}`
    };
}
