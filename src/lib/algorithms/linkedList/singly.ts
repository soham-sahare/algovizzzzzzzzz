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

// --- NEW OPERATIONS ---

export function* generateInsertSortedSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    // Naïve approach: Just find spot and insert
    // We assume list is sorted?
    // We will just find the first node >= value and insert before it.
    
    const newNode: LinkedListNode = { id: Math.random().toString(36).substr(2, 5), value };

    if (nodes.length === 0 || nodes[0].value >= value) {
        yield* generateInsertHeadSteps(nodes, value);
        return;
    }

    for (let i = 0; i < nodes.length - 1; i++) {
        yield {
             nodes,
             highlightedNodes: [nodes[i].id],
             pointers: { [nodes[i].id]: "Curr", [nodes[i+1].id]: "Next" },
             lineNumber: 2,
             message: `Checking if ${nodes[i+1].value} >= ${value}...`
        };
        
        if (nodes[i+1].value >= value) {
            // Insert after i (before i+1)
            const newNodesList = [...nodes];
            newNodesList.splice(i + 1, 0, newNode);
             yield {
                nodes: newNodesList,
                highlightedNodes: [nodes[i].id, newNode.id],
                pointers: { [nodes[i].id]: "Curr", [newNode.id]: "New" },
                lineNumber: 3,
                message: "Found spot. Inserting..."
            };
            return;
        }
    }
    
    // Check last node
    yield* generateInsertTailSteps(nodes, value);
}

export function* generateDeleteAllOccurrencesSteps(currentNodes: LinkedListNode[], value: number): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    let i = 0;
    let foundAny = false;
    
    // Code: while head and head.variant == val... (Simplified to general iterative logic relative to DELETE_ALL_CODE)
    // DELETE_ALL_CODE lines:
    // 1. while head and head.val == val: head = head.next
    // 2. curr = head
    // 3. while curr and curr.next:
    // 4.   if curr.next.val == val:
    // 5.     curr.next = curr.next.next
    // 6.   else:
    // 7.     curr = curr.next

    // We will map roughly to this logic.
    
    // Handle Head(s)
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "Checking head..." };
    while(nodes.length > 0 && nodes[0].value === value) {
         yield {
             nodes,
             highlightedNodes: [nodes[0].id],
             pointers: { [nodes[0].id]: "Head" },
             lineNumber: 1,
             message: "Head matches value. Removing..."
         };
         nodes.splice(0, 1);
         foundAny = true;
         yield {
             nodes: clone(nodes),
             highlightedNodes: [],
             pointers: {},
             lineNumber: 1,
             message: "Head removed."
         };
    }
    
    // Handle Rest
    if(nodes.length === 0) return;
    
    yield { nodes, highlightedNodes: [nodes[0].id], pointers: { [nodes[0].id]: "Curr" }, lineNumber: 2, message: "Setting curr = head" };
    
    i = 0; // curr index
    while(i < nodes.length - 1) {
         yield {
             nodes,
             highlightedNodes: [nodes[i].id],
             pointers: { [nodes[i].id]: "Curr" },
             lineNumber: 3,
             message: "Checking curr.next..."
         };
         
         if (nodes[i+1].value === value) {
             foundAny = true;
             yield {
                 nodes,
                 highlightedNodes: [nodes[i+1].id],
                 pointers: { [nodes[i].id]: "Curr", [nodes[i+1].id]: "Next Match" },
                 lineNumber: 4,
                 message: "Found match at curr.next!"
             };
             
             nodes.splice(i+1, 1);
             
             yield {
                 nodes: clone(nodes),
                 highlightedNodes: [nodes[i].id],
                 pointers: { [nodes[i].id]: "Curr" },
                 lineNumber: 5,
                 message: "Removed node. curr.next is now skipping deleted node."
             };
         } else {
             i++;
             yield {
                 nodes,
                 highlightedNodes: [nodes[i].id],
                 pointers: { [nodes[i].id]: "Curr" },
                 lineNumber: 7,
                 message: "No match. curr = curr.next"
             };
         }
    }
    
    yield { nodes, highlightedNodes: [], pointers: {}, message: "Deletion complete." };
}

// TRAVERSE_CODE:
// 1. curr = head
// 2. while curr:
// 3.   print(curr.val)
// 4.   curr = curr.next

export function* generateTraverseSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "curr = head" };
    
    for (let i = 0; i < nodes.length; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 2,
            message: `Current node exists.`
        };
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 3,
            message: `Visiting ${nodes[i].value}`
        };
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 4,
            message: `curr = curr.next`
        };
    }
    yield { nodes, highlightedNodes: [], pointers: {}, message: "Traversal complete." };
}

// FIND_NTH_CODE:
// 1. curr = head, count = 0
// 2. while curr:
// 3.   if count == n: return curr
// 4.   curr = curr.next
// 5.   count++

export function* generateFindNthSteps(currentNodes: LinkedListNode[], n: number): Generator<LinkedListStep> {
    const nodes = currentNodes;
    if (n < 0 || n >= nodes.length) {
        yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
        return;
    }
    
    yield {  nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "curr = head, count = 0" };

    for (let i = 0; i < nodes.length; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: `Cnt: ${i}` },
            lineNumber: 3,
            message: `Checking if count ${i} == ${n}`
        };
        
        if (i === n) {
             yield {
                nodes,
                highlightedNodes: [nodes[i].id],
                pointers: { [nodes[i].id]: "Found" },
                lineNumber: 3,
                message: `Found node at index ${n}: ${nodes[i].value}`
            };
            return;
        }

        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 4,
            message: "curr = curr.next"
        };
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 5,
            message: "count++"
        };
    }
}

// FIND_MIDDLE_CODE
// 1. slow = head, fast = head
// 2. while fast and fast.next:
// 3.   slow = slow.next
// 4.   fast = fast.next.next
// 5. return slow

export function* generateFindMiddleSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
     const nodes = currentNodes;
     if (nodes.length === 0) return;
     
     let slow = 0;
     let fast = 0;
     
     yield {
        nodes,
        highlightedNodes: [nodes[slow].id],
        pointers: { [nodes[slow].id]: "Slow/Fast" },
        lineNumber: 1,
        message: "Init slow and fast pointers"
    };

     while (fast < nodes.length && fast + 1 < nodes.length) {
          yield {
            nodes,
            highlightedNodes: [nodes[slow].id, nodes[fast].id],
            pointers: { [nodes[slow].id]: "Slow", [nodes[fast].id]: "Fast" },
            lineNumber: 2,
            message: "Checking fast and fast.next..."
        };
        
        slow++;
        yield {
             nodes,
             highlightedNodes: [nodes[slow].id, nodes[fast].id],
             pointers: { [nodes[slow].id]: "Slow", [nodes[fast].id]: "Fast" },
             lineNumber: 3,
             message: "slow = slow.next"
        };
        
        fast += 2;
        // Check bounds before accessing
        const fastId = fast < nodes.length ? nodes[fast].id : null;
        yield {
             nodes,
             highlightedNodes: [nodes[slow].id, ...(fastId ? [fastId] : [])],
             pointers: { [nodes[slow].id]: "Slow", ...(fastId ? {[fastId]: "Fast"} : {}) },
             lineNumber: 4,
             message: "fast = fast.next.next"
        };
     }

      if (fast < nodes.length) {
          // Final check loop condition fail
           yield {
            nodes,
            highlightedNodes: [nodes[slow].id, nodes[fast].id],
            pointers: { [nodes[slow].id]: "Slow", [nodes[fast].id]: "Fast" },
            lineNumber: 2,
            message: "Loop condition met/failed."
        };
      }
     
     yield {
        nodes,
        highlightedNodes: [nodes[slow].id],
        pointers: { [nodes[slow].id]: "Mid" },
        lineNumber: 5,
        message: `Middle is ${nodes[slow].value}`
    };
}

// GET_LENGTH_CODE
// 1. count = 0, curr = head
// 2. while curr:
// 3.   count++
// 4.   curr = curr.next
// 5. return count

export function* generateGetLengthSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    let count = 0;
    
    yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 1, message: "Init count = 0" };

    for (let i = 0; i < nodes.length; i++) {
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: "Curr" },
            lineNumber: 2,
            message: `curr exists: ${nodes[i].value}`
        };
         count++;
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: `Count: ${count}` },
            lineNumber: 3,
            message: `count++ (now ${count})`
        };
         yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: `Count: ${count}` },
            lineNumber: 4,
            message: `curr = curr.next`
        };
    }
     yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 5, message: `Total Length: ${count}` };
}

// UPDATE_CODE
// 1. curr = head
// 2. for i=0 to idx-1: curr = curr.next
// 3. curr.val = val

export function* generateUpdateValueSteps(currentNodes: LinkedListNode[], index: number, newValue: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    if (index < 0 || index >= nodes.length) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "Index out of bounds." };
         return;
    }
    
    yield { nodes, highlightedNodes: [nodes[0].id], pointers: { [nodes[0].id]: "Curr" }, lineNumber: 1, message: "Start at head." };
    
    for(let i=0; i<index; i++) {
         yield {
             nodes,
             highlightedNodes: [nodes[i].id],
             pointers: { [nodes[i].id]: "Curr" },
             lineNumber: 2,
             message: "Traversing to index..."
         };
    }
    
    yield {
         nodes,
         highlightedNodes: [nodes[index].id],
         pointers: { [nodes[index].id]: "Target" },
         lineNumber: 3,
         message: `Found idx ${index}. Updating val to ${newValue}...`
    };
    
    nodes[index].value = newValue; // Update in place in the clone
    
    yield {
         nodes,
         highlightedNodes: [nodes[index].id],
         pointers: { [nodes[index].id]: "Updated" },
         lineNumber: 3,
         message: "Value updated."
    };
}

// CHECK_SORTED_CODE
// 1. curr = head
// 2. while curr and curr.next:
// 3.   if curr.val > curr.next.val: return false
// 4.   curr = curr.next
// 5. return true

export function* generateCheckSortedSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = currentNodes;
    yield { nodes, highlightedNodes: [nodes[0].id], pointers: { [nodes[0].id]: "Head" }, lineNumber: 1, message: "curr = head" };
    
    if (nodes.length < 2) {
         yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 5, message: "List is sorted (empty or single)." };
         return;
    }
    
    let sorted = true;
    for(let i=0; i<nodes.length - 1; i++) {
        yield {
             nodes,
             highlightedNodes: [nodes[i].id, nodes[i+1].id],
             pointers: { [nodes[i].id]: "Curr", [nodes[i+1].id]: "Next" },
             lineNumber: 2,
             message: `Checking curr and curr.next...`
         };
         yield {
             nodes,
             highlightedNodes: [nodes[i].id, nodes[i+1].id],
             pointers: { [nodes[i].id]: "Curr", [nodes[i+1].id]: "Next" },
             lineNumber: 3,
             message: `Comparing ${nodes[i].value} > ${nodes[i+1].value}?`
         };
         
         if (nodes[i].value > nodes[i+1].value) {
             yield {
                 nodes,
                 highlightedNodes: [nodes[i].id],
                 pointers: { [nodes[i].id]: "Violation" },
                 lineNumber: 3,
                 message: "Found violation! Not sorted."
             };
             sorted = false;
             break;
         }
         
         yield {
             nodes,
             highlightedNodes: [nodes[i+1].id],
             pointers: { [nodes[i+1].id]: "Curr" },
             lineNumber: 4,
             message: `curr = curr.next`
         };
    }
    
    if(sorted) {
        yield { nodes, highlightedNodes: [], pointers: {}, lineNumber: 5, message: "List IS sorted." };
    }
}

