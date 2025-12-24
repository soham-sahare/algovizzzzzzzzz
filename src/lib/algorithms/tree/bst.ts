
export interface TreeNode {
    id: string; // Unique ID for visualization key
    value: number;
    label?: string; // Optional display label (e.g., for Huffman "a:5")
    left: TreeNode | null;
    right: TreeNode | null;
    x?: number; // Optional visual coordinates if pre-calculated
    y?: number;
    highlighted?: boolean;
    isNew?: boolean; // For entry animation hint
}

export type TreeStep = {
    root: TreeNode | null;
    highlightedNodes: string[]; // IDs
    activeNodeId?: string; // Current node being visited
    message: string;
    lineNumber?: number;
    description?: string; // Detailed description of the step
}

// Helper to clone tree structure (shallow clone of nodes, deep clone of structure)
// We need to return a new root reference effectively for React state to detect change, 
// but we also need to preserve IDs.
function cloneTree(node: TreeNode | null): TreeNode | null {
    if (!node) return null;
    return {
        ...node,
        left: cloneTree(node.left),
        right: cloneTree(node.right)
    };
}

export function* generateBSTInsertSteps(root: TreeNode | null, value: number): Generator<TreeStep> {
    const newRoot = cloneTree(root);
    const newNode: TreeNode = { id: Math.random().toString(36).substr(2, 5), value, left: null, right: null, isNew: true };
    
    yield { root: newRoot, highlightedNodes: [], message: `Inserting ${value}...`, lineNumber: 1 };

    if (!newRoot) {
        yield { root: newNode, highlightedNodes: [newNode.id], message: "Tree is empty. New node becomes root.", lineNumber: 2 };
        return;
    }

    let curr: TreeNode | null = newRoot;
    let parent: TreeNode | null = null;
    
    while (curr) {
        yield { 
            root: newRoot, 
            highlightedNodes: [curr.id], 
            activeNodeId: curr.id,
            message: `Comparing ${value} with ${curr.value}`,
            lineNumber: 3
        };

        if (value < curr.value) {
            if (!curr.left) {
                 yield { 
                    root: newRoot, 
                    highlightedNodes: [curr.id],
                    message: `${value} < ${curr.value}. Left child is empty. Insert here.`,
                    lineNumber: 4 
                };
                curr.left = newNode;
                yield { root: newRoot, highlightedNodes: [newNode.id], message: "Inserted.", lineNumber: 5 };
                return;
            }
             yield { 
                root: newRoot, 
                highlightedNodes: [curr.left.id],
                message: `${value} < ${curr.value}. Go Left.`,
                lineNumber: 4
            };
            curr = curr.left;
        } else {
             if (!curr.right) {
                 yield { 
                    root: newRoot, 
                    highlightedNodes: [curr.id],
                    message: `${value} >= ${curr.value}. Right child is empty. Insert here.`,
                    lineNumber: 6 
                };
                curr.right = newNode;
                yield { root: newRoot, highlightedNodes: [newNode.id], message: "Inserted.", lineNumber: 7 };
                return;
            }
            yield { 
                root: newRoot, 
                highlightedNodes: [curr.right.id],
                message: `${value} >= ${curr.value}. Go Right.`,
                lineNumber: 6
            };
            curr = curr.right;
        }
    }
}

export function* generateBSTSearchSteps(root: TreeNode | null, value: number): Generator<TreeStep> {
    // Cloning isn't strictly necessary for search as we don't mutate, but consistent with pattern
    const currentRoot = cloneTree(root);
    
    yield { root: currentRoot, highlightedNodes: [], message: `Searching for ${value}...`, lineNumber: 1 };

    if (!currentRoot) {
        yield { root: null, highlightedNodes: [], message: "Tree is empty. Not found.", lineNumber: 2 };
        return;
    }

    let curr: TreeNode | null = currentRoot;
    
    while (curr) {
        yield { 
            root: currentRoot, 
            highlightedNodes: [curr.id], 
            activeNodeId: curr.id,
            message: `Checking ${curr.value}...`,
            lineNumber: 3
        };

        if (curr.value === value) {
            yield { root: currentRoot, highlightedNodes: [curr.id], message: "Found!", lineNumber: 4 };
            return;
        }
        
        if (value < curr.value) {
            yield { root: currentRoot, highlightedNodes: [curr.id], message: `${value} < ${curr.value}. Go Left.`, lineNumber: 5 };
            curr = curr.left;
        } else {
            yield { root: currentRoot, highlightedNodes: [curr.id], message: `${value} > ${curr.value}. Go Right.`, lineNumber: 6 };
            curr = curr.right;
        }
    }
    
    yield { root: currentRoot, highlightedNodes: [], message: "Reached leaf (null). Value not found.", lineNumber: 7 };
}

// Traversals
export function* generateInorderTraversal(root: TreeNode | null): Generator<TreeStep> {
     const visitOrder: string[] = [];
     const stack: TreeNode[] = [];
     let curr = root;

     yield { root, highlightedNodes: [], message: "Starting Inorder (Left, Root, Right)", lineNumber: 1 };

     while (curr || stack.length > 0) {
         while (curr) {
             stack.push(curr);
             yield { root, highlightedNodes: [curr.id], message: `Go Left to ${curr.value}`, lineNumber: 2 };
             curr = curr.left;
         }
         
         curr = stack.pop()!;
         visitOrder.push(curr.id);
         yield { 
             root, 
             highlightedNodes: visitOrder, 
             activeNodeId: curr.id,
             message: `Visit ${curr.value}`, 
             lineNumber: 3 
         };
         
         curr = curr.right;
     }
     
     yield { root, highlightedNodes: visitOrder, message: "Traversal Complete", lineNumber: 4 };
}

export function* generatePreorderTraversal(root: TreeNode | null): Generator<TreeStep> {
    const visitOrder: string[] = [];
    const stack: TreeNode[] = [];
    
    if (root) stack.push(root);

    yield { root, highlightedNodes: [], message: "Starting Preorder (Root, Left, Right)", lineNumber: 1 };

    while (stack.length > 0) {
        const curr = stack.pop()!;
        visitOrder.push(curr.id);
        
        yield { 
            root, 
            highlightedNodes: visitOrder, 
            activeNodeId: curr.id,
            message: `Visit ${curr.value}`, 
            lineNumber: 2 
        };

        // Push right first so left is processed first
        if (curr.right) {
             yield { root, highlightedNodes: visitOrder, activeNodeId: curr.right.id, message: `Push Right Child ${curr.right.value} to Stack` };
             stack.push(curr.right);
        }
        if (curr.left) {
             yield { root, highlightedNodes: visitOrder, activeNodeId: curr.left.id, message: `Push Left Child ${curr.left.value} to Stack` };
             stack.push(curr.left);
        }
    }
    yield { root, highlightedNodes: visitOrder, message: "Traversal Complete", lineNumber: 3 };
}

export function* generatePostorderTraversal(root: TreeNode | null): Generator<TreeStep> {
    // Two-stack method or recursive simulation
    // Let's use recursive simulation with a stack to track 'visited' state or just simple recursion generator
    
    const visitOrder: string[] = [];
    
    function* postorderRec(node: TreeNode | null): Generator<TreeStep> {
        if (!node) return;
        
        yield { root, highlightedNodes: visitOrder, activeNodeId: node.id, message: `Go Left from ${node.value}`, lineNumber: 2 };
        yield* postorderRec(node.left);
        
        yield { root, highlightedNodes: visitOrder, activeNodeId: node.id, message: `Go Right from ${node.value}`, lineNumber: 3 };
        yield* postorderRec(node.right);
        
        visitOrder.push(node.id);
        yield { 
            root, 
            highlightedNodes: visitOrder, 
            activeNodeId: node.id,
            message: `Visit ${node.value}`, 
            lineNumber: 4 
        };
    }

    yield { root, highlightedNodes: [], message: "Starting Postorder (Left, Right, Root)", lineNumber: 1 };
    if (root) yield* postorderRec(root);
    yield { root, highlightedNodes: visitOrder, message: "Traversal Complete", lineNumber: 5 };
}

export function* generateLevelOrderTraversal(root: TreeNode | null): Generator<TreeStep> {
    const visitOrder: string[] = [];
    const queue: TreeNode[] = [];
    
    if (root) queue.push(root);
    
    yield { root, highlightedNodes: [], message: "Starting Level Order (BFS)", lineNumber: 1 };

    while (queue.length > 0) {
        const curr = queue.shift()!;
        visitOrder.push(curr.id);
        
        yield { 
            root, 
            highlightedNodes: visitOrder, 
            activeNodeId: curr.id,
            message: `Visit ${curr.value}`, 
            lineNumber: 2 
        };

        if (curr.left) {
            queue.push(curr.left);
            yield { root, highlightedNodes: visitOrder, activeNodeId: curr.left.id, message: `Enqueue Left ${curr.left.value}`, lineNumber: 3 };
        }
        if (curr.right) {
            queue.push(curr.right);
            yield { root, highlightedNodes: visitOrder, activeNodeId: curr.right.id, message: `Enqueue Right ${curr.right.value}`, lineNumber: 4 };
        }
    }
    yield { root, highlightedNodes: visitOrder, message: "Traversal Complete", lineNumber: 5 };
}
