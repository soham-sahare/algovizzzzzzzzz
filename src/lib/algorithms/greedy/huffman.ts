import { TreeNode } from "@/lib/algorithms/tree/bst";

export type HuffmanStep = {
    treeRoot: TreeNode | null;
    frequencies: Record<string, number>;
    codes: Record<string, string>;
    priorityQueue: TreeNode[]; // Show the queue state
    message: string;
    lineNumber?: number;
}

export function* generateHuffmanSteps(text: string): Generator<HuffmanStep> {
    if (!text) return;

    // 1. Count Frequencies
    const frequencies: Record<string, number> = {};
    for (const char of text) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }

    yield {
        treeRoot: null,
        frequencies: { ...frequencies },
        codes: {},
        priorityQueue: [],
        message: `Counted frequencies for "${text}"`,
        lineNumber: 1
    };

    // 2. Create Leaf Nodes and Priority Queue
    let pq: TreeNode[] = Object.entries(frequencies).map(([char, freq]) => ({
        id: `leaf-${char}`,
        value: freq, // Numeric freq
        label: `${char}:${freq}`, // Display label
        left: null,
        right: null,
    }));
    
    // Helper to sort PQ by frequency (value is now number)
    const sortPQ = (queue: TreeNode[]) => {
        return queue.sort((a, b) => a.value - b.value);
    };

    pq = sortPQ(pq);

    yield {
        treeRoot: null,
        frequencies,
        codes: {},
        priorityQueue: JSON.parse(JSON.stringify(pq)),
        message: "Created leaf nodes in Priority Queue (Sorted by Freq)",
        lineNumber: 2
    };

    // 3. Build Tree
    let nodeIdCounter = 0;
    
    while (pq.length > 1) {
        // Extract two smallest
        const left = pq.shift()!;
        const right = pq.shift()!;

        yield {
            treeRoot: null, 
            frequencies,
            codes: {},
            priorityQueue: sortPQ([left, right, ...pq]), // Show what we extracted
            message: `Extracted min nodes: [${left.label || left.value}] and [${right.label || right.value}]`,
            lineNumber: 3
        };

        const sumFreq = left.value + right.value;

        const newNode: TreeNode = {
            id: `internal-${nodeIdCounter++}`,
            value: sumFreq,
            label: `sum:${sumFreq}`,
            left,
            right
        };

        pq.push(newNode);
        pq = sortPQ(pq);

        yield {
            treeRoot: newNode, // Show the subtree we just made
            frequencies,
            codes: {},
            priorityQueue: JSON.parse(JSON.stringify(pq)),
            message: `Created internal node [${sumFreq}] with children [${left.value}] and [${right.value}]`,
            lineNumber: 4
        };
    }

    const root = pq[0] || null;

    // 4. Generate Codes
    const codes: Record<string, string> = {};
    const generateCodes = (node: TreeNode | null, code: string) => {
        if (!node) return;
        if (!node.left && !node.right) {
            // Leaf: Label format is "char:freq"
            const char = node.label ? node.label.split(':')[0] : "";
            if (char) codes[char] = code;
        }
        generateCodes(node.left, code + "0");
        generateCodes(node.right, code + "1");
    };

    if (root) generateCodes(root, "");

    yield {
        treeRoot: root,
        frequencies,
        codes: { ...codes },
        priorityQueue: [],
        message: "Huffman Tree Complete! Codes Generated.",
        lineNumber: 5
    };
}
