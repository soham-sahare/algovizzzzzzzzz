
import { LinkedListStep } from "@/lib/algorithms/linkedList/singly";
import { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";

// Helper
const clone = (nodes: LinkedListNode[]) => nodes.map(n => ({...n}));

export function* generatePushSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };
    
    // Step 1: Create Node
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "New" },
        lineNumber: 1,
        message: `Created new node ${value}`
    };

    if (nodes.length > 0) {
        // Step 2: Link New -> Top
        yield {
            nodes: [newNode, ...nodes],
            highlightedNodes: [newNode.id, nodes[0].id],
            pointers: { [newNode.id]: "New", [nodes[0].id]: "Old Top" },
            lineNumber: 2,
            message: "newNode.next = top"
        };
    }

    // Step 3: Update Top
    yield {
        nodes: [newNode, ...nodes],
        highlightedNodes: [newNode.id],
        pointers: { [newNode.id]: "Top" },
        lineNumber: 3,
        message: "top = newNode"
    };
}

export function* generatePopSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    // Check Empty
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "Checking if empty..." };
    
    if (nodes.length === 0) {
         yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 2, message: "Stack Underflow (Empty)" };
         return;
    }

    const topNode = nodes[0];
    
    yield {
        nodes,
        highlightedNodes: [topNode.id],
        pointers: { [topNode.id]: "Top" },
        lineNumber: 3,
        message: "Accessing top node"
    };

    if (nodes.length === 1) {
         yield {
             nodes: [],
             highlightedNodes: [],
             pointers: {},
             lineNumber: 4,
             message: "top = top.next (now null)"
         };
         return;
    }

    const newTop = nodes[1];
    yield {
        nodes: nodes.slice(1),
        highlightedNodes: [newTop.id],
        pointers: { [newTop.id]: "Top" },
        lineNumber: 4,
        message: "top = top.next"
    };
}

export function* generatePeekSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "Checking if empty..." };
    
    if (nodes.length === 0) {
         yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 2, message: "Stack is Empty" };
         return;
    }

    yield {
        nodes,
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "Top" },
        lineNumber: 3,
        message: `Top value is ${nodes[0].value}`
    };
}

export function* generateIsEmptySteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "Checking top == null" };
    yield { 
        nodes, 
        highlightedNodes: [], 
        pointers: {}, 
        lineNumber: 1, 
        message: nodes.length === 0 ? "True (Empty)" : "False (Not Empty)" 
    };
}

export function* generateGetSizeSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
     // For Linked List stack, size is O(1) if maintained, or O(N) if traversed.
     // Assuming maintenance for the "Stack" ADT behavior usually, but visually we might traverse.
     // Let's visualize traversal for O(N) get size or just return it for O(1).
     // Let's do O(1) conceptually for the stack API.
     
     const nodes = currentNodes;
     yield {
         nodes,
         highlightedNodes: [],
         pointers: {},
         lineNumber: 1,
         message: `Size is ${nodes.length}`
     };
}
