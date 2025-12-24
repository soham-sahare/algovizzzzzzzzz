
import { TreeNode, TreeStep } from "./bst";

// We can treat AVL Node just as TreeNode for visualization purposes.
// We'll calculate height dynamically or store it if needed for logic, 
// but for the generator, we just need 'value', 'left', 'right', 'id'.

// Helper to clone structure
function cloneTree(node: TreeNode | null): TreeNode | null {
    if (!node) return null;
    return {
        ...node,
        left: cloneTree(node.left),
        right: cloneTree(node.right)
    };
}

function getHeight(node: TreeNode | null): number {
    if (!node) return 0;
    // We can compute height specifically or assume it's stored. 
    // For simplicity in this visualizer logic, let's recompute:
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function getBalance(node: TreeNode | null): number {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
}

// Rotations return the NEW root of the subtree
// We must modify the nodes in place or return new nodes.
// Since we are inside a generator simulating steps, let's allow mutation of the 'current' structure
// and yield CLONES of the entire root.

function rotateRight(y: TreeNode): TreeNode {
    const x = y.left;
    if (!x) return y; // Should not happen in valid rotation context
    
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    return x; // New root
}

function rotateLeft(x: TreeNode): TreeNode {
    const y = x.right;
    if (!y) return x; 

    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    return y;
}

export function* generateAVLInsertSteps(startRoot: TreeNode | null, value: number): Generator<TreeStep> {
    // We maintain a working copy of the tree
    // Ideally we should use a persistent data structure or deep clone, 
    // but here we will just perform the recursive logic.
    // However, to yield the "whole tree" state, we need to know the 'root'.
    // The recursive insert function will return the new subtree root.
    
    // Wrapper to hold the main root ref
    let mainRoot: TreeNode | null = cloneTree(startRoot);

    // We need a way to update mainRoot from within the recursive calls 
    // OR we just write the recursive function to perform the logic and we yield from it.
    // But 'yield' needs to yield { root: mainRoot }. 
    // The recursive function doesn't know 'mainRoot' easily unless passed.

    // Let's implement an iterative approach OR a recursive one where we pass the snapshot callback?
    // Generators are recursive via 'yield *'.

    // Let's try the recursive generator pattern.
    
    function* insertRec(node: TreeNode | null, val: number): Generator<any, TreeNode, any> {
        // 1. Standard BST Insert
        if (!node) {
            const newNode: TreeNode = { 
                id: Math.random().toString(36).substr(2, 5), 
                value: val, 
                left: null, 
                right: null, 
                isNew: true 
            };
            return newNode;
        }

        if (val < node.value) {
            node.left = yield* insertRec(node.left, val);
        } else if (val > node.value) {
            node.right = yield* insertRec(node.right, val);
        } else {
            return node; // Duplicate
        }

        // Yield step after standard insert (unwinding recursion)
        // We simulate "Backtracking" to check balance
        yield { 
            action: "balance_check", 
            nodeId: node.id, 
            message: `Checking balance at ${node.value} (Bal: ${getBalance(node)})` 
        };

        const balance = getBalance(node);

        // Left Left Case
        if (balance > 1 && val < (node.left?.value ?? 0)) {
            yield { action: "message", message: `Left Left Case at ${node.value}. Rotate Right.` };
            const newRoot = rotateRight(node);
            return newRoot;
        }

        // Right Right Case
        if (balance < -1 && val > (node.right?.value ?? 0)) {
            yield { action: "message", message: `Right Right Case at ${node.value}. Rotate Left.` };
            const newRoot = rotateLeft(node);
            return newRoot;
        }

        // Left Right Case
        if (balance > 1 && val > (node.left?.value ?? 0)) {
            yield { action: "message", message: `Left Right Case at ${node.value}. Left Rotate ${node.left!.value}, then Right Rotate ${node.value}.` };
            node.left = rotateLeft(node.left!);
            // Yield update?
            yield { action: "partial_rotation", message: `After Left Rotate on child...` };
            
            const newRoot = rotateRight(node);
            return newRoot;
        }

        // Right Left Case
        if (balance < -1 && val < (node.right?.value ?? 0)) {
            yield { action: "message", message: `Right Left Case at ${node.value}. Right Rotate ${node.right!.value}, then Left Rotate ${node.value}.` };
            node.right = rotateRight(node.right!);
             yield { action: "partial_rotation", message: `After Right Rotate on child...` };

            const newRoot = rotateLeft(node);
            return newRoot;
        }

        return node;
    }

    // Now we need to run this generator, but wrap the yields to attach 'mainRoot'
    // The problem is: 'insertRec' RETURNS the new node structure, but it modifies 'node' in place (or returns new one).
    // If we use 'mainRoot' as the starting object, the changes propagate if we mutate.
    // My rotate functions MUTATE the nodes passed in (by connecting left/right), so 'mainRoot' should reflect it?
    // YES, they rearrange references.
    
    // BUT 'insertRec' returns the *new root* of that subtree.
    // If the root changes, we need to update the parent pointer.
    // The recursive call `node.left = yield* ...` handles the parent pointer update!
    // So mainRoot needs to be updated by the initial call.

    // To yield the *intermediate* states, we need to be able to access the TOP level 'mainRoot' even while deep in recursion.
    // Since we are mutating objects reachable from 'mainRoot', 'mainRoot' *should* reflect changes 
    // as long as we haven't replaced the top root reference yet. 
    // The top root reference is updated at the *very end* of the top call.
    
    // Wait, if I rotate at the top, mainRoot changes.
    // So 'mainRoot' variable inside the *generator wrapper* needs to be the one we yield.
    // But since 'insertRec' returns the new root, we only know the *final* new root at the end.
    // During recursion, 'node' IS a part of 'mainRoot' (by reference), so mutating 'node.left' updates 'mainRoot'.
    
    // Exception: If we execute a rotation, 'node' might be replaced by 'newRoot'.
    // The parent's reference to 'node' is updated *after* the yield returns?
    // `node.left = yield* insertRec(...)` -> The assignment happens *after* the generator finishes for that subtree.
    // So while the subprocess is yielding "I am about to rotate", the PARENT has NOT yet updated its pointer to the result.
    // This means 'mainRoot' might point to the OLD structure while we are calculating the new one.
    
    // This is a known issue with functional updates + generators.
    // BETTER APPROACH: Iterative insertion with a stack to track path for balancing.
    // This allows us to modify pointers immediately and yield the root.

    const nodesStack: TreeNode[] = [];
    
    // 1. BST Insert (Iterative)
    // Special case for empty tree
    if (!mainRoot) {
        const newNode: TreeNode = { 
            id: Math.random().toString(36).substr(2, 5), 
            value: value, 
            left: null, 
            right: null, 
            isNew: true 
        };
        yield { root: newNode, highlightedNodes: [newNode.id], message: "Inserted root.", lineNumber: 1 };
        return;
    }

    let curr: TreeNode | null = mainRoot;
    let pathStack: { node: TreeNode, dir: 'left' | 'right' }[] = []; 
    // We cannot easily use a stack of just nodes because we need to update the *parent's pointer* to the child after rotation.

    // Just use a simple recursive helper that DOES NOT yield, but we manually yield snapshots?
    // Or stick to the recursive generator but accept that the visualization might look slightly "delayed" in updates?
    // Actually, we can fix the reference:
    // When `insertRec` yields, it hasn't returned yet.
    // If we want to visualize the tree *during* the rotation logic, we need the pointers to be correct.
    
    // Let's use a Hybrid. 
    // We will do the standard insert (iterative) to find spot and link node.
    // THEN we walk up the stack and balance.
    // This is easier to manage state.

    // --- Iterative Insert ---
    const newNode: TreeNode = { 
        id: Math.random().toString(36).substr(2, 5), 
        value, 
        left: null, 
        right: null, 
        isNew: true 
    };
    
    yield { root: mainRoot, highlightedNodes: [], message: `Inserting ${value}...`, lineNumber: 1 };

    let p: TreeNode | null = mainRoot;
    const path: TreeNode[] = []; // Used for retracing for balance
    
    while (true) {
        path.push(p);
        if (value < p.value) {
            if (!p.left) {
                p.left = newNode;
                break;
            }
            p = p.left;
        } else {
            if (!p.right) {
                p.right = newNode;
                break;
            }
            p = p.right;
        }
    }

    yield { root: mainRoot, highlightedNodes: [newNode.id], message: "Inserted. Checking balance...", lineNumber: 2 };

    // --- Backtracking & Balancing ---
    // We go up the path in reverse
    for (let i = path.length - 1; i >= 0; i--) {
        const node = path[i];
        
        yield { 
            root: mainRoot, 
            highlightedNodes: [node.id], 
            activeNodeId: node.id,
            message: `At ${node.value}, Balance: ${getBalance(node)}`,
            lineNumber: 3
        };

        const balance = getBalance(node);

        if (Math.abs(balance) > 1) {
             yield { 
                root: mainRoot, 
                highlightedNodes: [node.id], 
                message: `Imbalance detected at ${node.value}! (${balance})`,
                lineNumber: 4
            };

            // Determine Case
            // We need to know which child caused it.
            // Since we just inserted, we can check value vs node.value
            let newSubRoot: TreeNode = node;
            
            if (balance > 1 && value < (node.left?.value ?? 0)) {
                // Left Left
                 yield { root: mainRoot, highlightedNodes: [node.id, node.left!.id], message: "Left-Left Case -> Rotate Right", lineNumber: 5 };
                 newSubRoot = rotateRight(node);
            }
            else if (balance < -1 && value > (node.right?.value ?? 0)) {
                // Right Right
                 yield { root: mainRoot, highlightedNodes: [node.id, node.right!.id], message: "Right-Right Case -> Rotate Left", lineNumber: 6 };
                 newSubRoot = rotateLeft(node);
            }
            else if (balance > 1 && value > (node.left?.value ?? 0)) {
                // Left Right
                 yield { root: mainRoot, highlightedNodes: [node.id, node.left!.id], message: "Left-Right Case -> Left Rotate Child, then Right Rotate", lineNumber: 7 };
                 node.left = rotateLeft(node.left!);
                 
                 // Yield intermediate
                 yield { root: mainRoot, highlightedNodes: [node.id], message: "Child rotated. Now Rotate Right.", lineNumber: 8 };
                 
                 newSubRoot = rotateRight(node);
            }
            else if (balance < -1 && value < (node.right?.value ?? 0)) {
                // Right Left
                 yield { root: mainRoot, highlightedNodes: [node.id, node.right!.id], message: "Right-Left Case -> Right Rotate Child, then Left Rotate", lineNumber: 9 };
                 node.right = rotateRight(node.right!);

                 yield { root: mainRoot, highlightedNodes: [node.id], message: "Child rotated. Now Rotate Left.", lineNumber: 10 };
                 
                 newSubRoot = rotateLeft(node);
            }

            // LINKING THE NEW SUBROOT BACK TO PARENT
            if (i === 0) {
                mainRoot = newSubRoot;
            } else {
                const parent = path[i - 1];
                if (parent.left === node) parent.left = newSubRoot;
                else parent.right = newSubRoot;
            }

            yield { root: mainRoot, highlightedNodes: [newSubRoot.id], message: "Rebalanced.", lineNumber: 11 };
            
            // In AVL, one rotation (single or double) fixes the imbalance for the insertion. 
            // We can break or continue? Standard AVL says one fix is enough for Insert.
            return;
        }
    }
}
