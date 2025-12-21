import { LinkedListNode } from "@/components/visualizations/LinkedListVisualizer";

export type LinkedListStep = {
    nodes: LinkedListNode[];
    highlightedNodes: string[];
    pointers: { [id: string]: string };
    lineNumber?: number;
    message?: string;
};

const clone = (nodes: LinkedListNode[]) => nodes.map(n => ({...n}));

// --- REVERSAL OPERATIONS ---

export function* generateReverseIterativeSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    if(nodes.length === 0) return;
    
    let prevIndex = -1; // null
    let currIndex = 0;
    
    while(currIndex < nodes.length) {
         yield {
            nodes: clone(nodes), 
            highlightedNodes: [nodes[currIndex].id],
            pointers: { 
                [nodes[currIndex].id]: "Curr",
                ...(prevIndex >= 0 ? {[nodes[prevIndex].id]: "Prev"} : {})
            },
            message: `Reversing node ${nodes[currIndex].value}...`
        };

        yield {
             nodes: clone(nodes),
             highlightedNodes: [nodes[currIndex].id],
             pointers: { 
                [nodes[currIndex].id]: `Next -> ${prevIndex >= 0 ? nodes[prevIndex].value : "NULL"}`,
                ...(prevIndex >= 0 ? {[nodes[prevIndex].id]: "Prev"} : {})
            },
             message: `Set ${nodes[currIndex].value}.next to ${prevIndex >= 0 ? nodes[prevIndex].value : "NULL"}`
        };
        
        prevIndex = currIndex;
        currIndex++;
    }
    
    const reversedNodes = clone(nodes).reverse();
    yield {
        nodes: reversedNodes,
        highlightedNodes: [],
        pointers: { [reversedNodes[0].id]: "Head" },
        message: "Iterative reversal complete."
    };
}

export function* generateReverseRecursiveSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    if(nodes.length === 0) return;

    for(let i=0; i<nodes.length; i++) {
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: `Stack(${i})` },
            message: `Recursive call on node ${nodes[i].value}...`
        };
    }

    yield {
        nodes,
        highlightedNodes: [nodes[nodes.length-1].id],
        pointers: { [nodes[nodes.length-1].id]: "Base Case" },
        message: "Reached end (Base Case). Returning Head."
    };

    let reversed = [...nodes];
    for(let i=nodes.length-2; i>=0; i--) {
         yield {
            nodes: reversed, 
            highlightedNodes: [nodes[i].id, nodes[i+1].id],
            pointers: { [nodes[i].id]: "Head", [nodes[i+1].id]: "Next" },
            message: `Returning... Setting ${nodes[i+1].value}.next = ${nodes[i].value}`
        };
    }
    
    reversed = reversed.reverse();
    yield {
        nodes: reversed,
        highlightedNodes: [],
        pointers: {},
        message: "Recursion complete. List reversed."
    };
}

export function* generateReverseKGroupSteps(currentNodes: LinkedListNode[], k: number): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if(k <= 1 || nodes.length < k) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "k <= 1 or List too short. No change." };
         return;
    }

    let count = 0;
    while (count + k <= nodes.length) {
        yield {
            nodes,
            highlightedNodes: nodes.slice(count, count + k).map(n => n.id),
            pointers: { [nodes[count].id]: "Group Start" },
            message: `Reversing group of ${k}...`
        };

        const group = nodes.slice(count, count + k).reverse();
        nodes.splice(count, k, ...group);

        yield {
            nodes: clone(nodes),
            highlightedNodes: group.map(n => n.id),
            pointers: {},
            message: "Group reversed."
        };
        count += k;
    }
    
    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "K-Group Reversal Complete."
    };
}

export function* generateReverseBetweenSteps(currentNodes: LinkedListNode[], left: number, right: number): Generator<LinkedListStep> {
     let nodes = clone(currentNodes);
     if (left >= right || left < 0 || right >= nodes.length) {
          yield { nodes, highlightedNodes: [], pointers: {}, message: "Invalid range." };
          return;
     }

     yield {
         nodes,
         highlightedNodes: [nodes[left].id, nodes[right].id],
         pointers: { [nodes[left].id]: "L", [nodes[right].id]: "R" },
         message: `Reversing between index ${left} and ${right}...`
     };

     const segment = nodes.slice(left, right + 1).reverse();
     nodes.splice(left, segment.length, ...segment);

     yield {
         nodes,
         highlightedNodes: segment.map(n => n.id),
         pointers: {},
         message: "Range reversed."
     };
}

// --- CYCLE OPERATIONS ---

export function* generateDetectCycleFloydSteps(currentNodes: LinkedListNode[], cycleIndex: number): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    
    if (cycleIndex === -1 && nodes.length > 0) {
        yield { nodes, highlightedNodes: [], pointers: {}, message: "Checking for cycle..." };
        yield { nodes, highlightedNodes: [nodes[nodes.length-1].id], pointers: { [nodes[nodes.length-1].id]: "Tail -> NULL" }, message: "Tail points to NULL. No cycle." };
        return;
    }
    
    if (nodes.length === 0) return;

    let slow = 0;
    let fast = 0;
    
    yield {
        nodes,
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "Slow/Fast" },
        message: "Initialize Slow and Fast at Head."
    };

    while (true) {
        const getNext = (i: number) => {
            if (i === nodes.length - 1) return cycleIndex;
            return i + 1;
        }

        slow = getNext(slow);
        fast = getNext(getNext(fast));
        
        if (slow === -1 || fast === -1) { 
             break; 
        }

        yield {
            nodes,
            highlightedNodes: [nodes[slow].id, nodes[fast].id],
            pointers: { [nodes[slow].id]: "Slow", [nodes[fast].id]: "Fast" },
            message: `Slow moves 1, Fast moves 2...`
        };

        if (slow === fast) {
            yield {
                nodes,
                highlightedNodes: [nodes[slow].id],
                pointers: { [nodes[slow].id]: "Intersection" },
                message: "Slow and Fast met! Cycle Detected."
            };
            return;
        }
    }
}

// --- SORTING OPERATIONS ---

export function* generateMergeSortSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    
    if (nodes.length <= 1) {
         yield { nodes, highlightedNodes: [], pointers: {}, message: "List already sorted." };
         return;
    }

    function* mergeSortRecursive(arr: LinkedListNode[], startIndex: number): Generator<LinkedListStep> {
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        yield {
            nodes: nodes,
            highlightedNodes: arr.map(n => n.id),
            pointers: { [arr[0].id]: "Sort Range Start", [arr[arr.length-1].id]: "End" },
            message: `Splitting range of size ${arr.length} into ${left.length} and ${right.length}`
        };

        const sortedLeft: LinkedListNode[] = yield* mergeSortRecursive(left, startIndex);
        const sortedRight: LinkedListNode[] = yield* mergeSortRecursive(right, startIndex + mid);

        const merged: LinkedListNode[] = [];
        let l = 0, r = 0;
        
        yield {
            nodes: nodes,
            highlightedNodes: [...sortedLeft.map(n=>n.id), ...sortedRight.map(n=>n.id)],
            pointers: {},
            message: "Merging sorted halves..."
        };

        while(l < sortedLeft.length && r < sortedRight.length) {
            yield {
                nodes: nodes,
                highlightedNodes: [sortedLeft[l].id, sortedRight[r].id],
                pointers: { [sortedLeft[l].id]: "L", [sortedRight[r].id]: "R" },
                message: `Comparing ${sortedLeft[l].value} and ${sortedRight[r].value}`
            };

            if(sortedLeft[l].value <= sortedRight[r].value) {
                merged.push(sortedLeft[l]);
                l++;
            } else {
                merged.push(sortedRight[r]);
                r++;
            }
        }
        
        while(l < sortedLeft.length) merged.push(sortedLeft[l++]);
        while(r < sortedRight.length) merged.push(sortedRight[r++]);

        nodes.splice(startIndex, merged.length, ...merged);

        yield {
            nodes: clone(nodes),
            highlightedNodes: merged.map(n => n.id),
            pointers: {},
            message: "Merged segment sorted."
        };

        return merged;
    }

    yield* mergeSortRecursive(nodes, 0);

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Merge Sort Complete."
    };
}

export function* generateInsertionSortSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if(nodes.length <= 1) return;
    
    for(let i = 1; i < nodes.length; i++) {
        let current = nodes[i];
        let j = i - 1;

        yield {
            nodes,
            highlightedNodes: [current.id],
            pointers: { [current.id]: "Current" },
            message: `Inserting ${current.value} into sorted portion...`
        };

        while(j >= 0 && nodes[j].value > current.value) {
             yield {
                nodes,
                highlightedNodes: [nodes[j].id, current.id],
                pointers: { [nodes[j].id]: "Compare", [current.id]: "Current" },
                message: `${nodes[j].value} > ${current.value}, shifting...`
            };
            
            nodes[j + 1] = nodes[j];
            nodes[j] = current;
            
            yield {
                nodes: clone(nodes),
                highlightedNodes: [nodes[j].id, nodes[j+1].id],
                pointers: {},
                message: "Swapped."
            };

            j--;
        }
    }
    
    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Insertion Sort Complete."
    };
}

// --- CLONING OPERATIONS ---

export function* generateDeepCopySteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const originalNodes = currentNodes;
    let displayNodes = [...clone(originalNodes)];
    let clonedNodes: LinkedListNode[] = [];
    
    yield {
        nodes: displayNodes,
        highlightedNodes: [],
        pointers: { [originalNodes[0]?.id]: "Original Head" },
        message: "Starting Deep Copy..."
    };

    const newMap = new Map<string, string>();

    for(let i=0; i<originalNodes.length; i++) {
        const original = originalNodes[i];
        const newNode: LinkedListNode = {
            id: `copy-${original.id}`,
            value: original.value
        };
        clonedNodes.push(newNode);
        newMap.set(original.id, newNode.id);

        displayNodes = [...clone(originalNodes), ...clonedNodes];

        yield {
            nodes: displayNodes,
            highlightedNodes: [original.id, newNode.id],
            pointers: { [original.id]: "Src", [newNode.id]: "Copy" },
             message: `Copied node ${original.value}.`
        };
    }

    yield {
        nodes: displayNodes,
        highlightedNodes: [],
        pointers: { [clonedNodes[0]?.id]: "New Head" },
        message: "Deep Copy Complete (Values & Next pointers duplicated)."
    };
}

export function* generateCloneRandomSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    
    if (nodes.length === 0) return;

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Strategy: Interweave Copy Nodes (A -> A' -> B -> B')"
    };

    for(let i=0; i < nodes.length; i += 2) {
        const original = nodes[i];
        const newNode: LinkedListNode = {
            id: `copy-rand-${original.id}`,
            value: original.value
        };
        
        nodes.splice(i + 1, 0, newNode);
        
        yield {
            nodes: clone(nodes),
            highlightedNodes: [original.id, newNode.id],
            pointers: { [original.id]: "Orig", [newNode.id]: "Copy" },
            message: `Created copy ${newNode.value} and inserted after original.`
        };
    }

    yield {
        nodes: clone(nodes),
        highlightedNodes: [],
        pointers: {},
        message: "Phase 2: Assign Random Pointers (copy.random = orig.random.next)"
    };

    for(let i=0; i < nodes.length; i += 2) {
        const orig = nodes[i];
        const copy = nodes[i+1];
        
        yield {
            nodes: clone(nodes),
            highlightedNodes: [orig.id, copy.id],
            pointers: { [orig.id]: "Orig", [copy.id]: "Copy" },
            message: `Setting random pointer for ${copy.value}...`
        };
    }

    yield {
        nodes: clone(nodes),
        highlightedNodes: [],
        pointers: {},
        message: "Phase 3: Restore original list and extract copy."
    };

    const originalRestored: LinkedListNode[] = [];
    const copyExtracted: LinkedListNode[] = [];
    
    for(let i=0; i < nodes.length; i+=2) {
        originalRestored.push(nodes[i]);
        copyExtracted.push(nodes[i+1]);
    }
    
    const finalView = [...originalRestored, ...copyExtracted];

    yield {
        nodes: finalView,
        highlightedNodes: [],
        pointers: { [originalRestored[0].id]: "Orig Head", [copyExtracted[0].id]: "Copy Head" },
        message: "Separation Complete. Two independent lists."
    };
}

// --- MERGE OPERATIONS ---

export function* generateMergeTwoListsSteps(
    allNodes: LinkedListNode[],
    head1Id: string,
    head2Id: string
): Generator<LinkedListStep> {
    let nodes = clone(allNodes);

    let curr1 = nodes.find(n => n.id === head1Id);
    let curr2 = nodes.find(n => n.id === head2Id);

    let tailId: string | null = null;

    yield {
        nodes,
        highlightedNodes: [head1Id, head2Id],
        pointers: { [head1Id]: "Head 1", [head2Id]: "Head 2" },
        message: "Starting Merge of Two Sorted Lists"
    };

    while (curr1 && curr2) {
        yield {
            nodes,
            highlightedNodes: [curr1.id, curr2.id],
            pointers: { 
                [curr1.id]: "Curr 1", 
                [curr2.id]: "Curr 2",
                ...(tailId ? {[tailId]: "Tail"} : {})
            },
            message: `Comparing ${curr1.value} and ${curr2.value}`
        };

        let smaller: LinkedListNode;
        if (curr1.value <= curr2.value) {
            smaller = curr1;
            curr1 = curr1.next ? nodes.find(n => n.id === curr1!.next) : undefined;
        } else {
            smaller = curr2;
            curr2 = curr2.next ? nodes.find(n => n.id === curr2!.next) : undefined;
        }
        
         yield {
            nodes,
            highlightedNodes: [smaller.id],
            pointers: { [smaller.id]: "Smaller" },
            message: `${smaller.value} is smaller. Adding to merged list.`
        };

        if (!tailId) {
            tailId = smaller.id;
            yield {
                nodes: clone(nodes),
                highlightedNodes: [tailId],
                pointers: { [tailId]: "Merged Head" },
                message: `New Merged Head is ${smaller.value}`
            };
        } else {
            const tailNode = nodes.find(n => n.id === tailId)!;
            tailNode.next = smaller.id;
            
            yield {
                nodes: clone(nodes),
                highlightedNodes: [tailId, smaller.id],
                pointers: { [tailId]: "Tail", [smaller.id]: "Next" },
                message: `Linking Tail (${tailNode.value}) -> ${smaller.value}`
            };
            
            tailId = smaller.id;
        }
    }

    let remaining = curr1 || curr2;
    if (remaining && tailId) {
        const tailNode = nodes.find(n => n.id === tailId)!;
        tailNode.next = remaining.id;
        
        yield {
            nodes: clone(nodes),
            highlightedNodes: [tailId, remaining.id],
            pointers: { [tailId]: "Tail", [remaining.id]: "Remaining" },
            message: `Attaching remaining list starting at ${remaining.value}`
        };
    }

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Merge Complete."
    };
}

export function* generateMergeAlternateSteps(
    allNodes: LinkedListNode[],
    head1Id: string,
    head2Id: string
): Generator<LinkedListStep> {
    let nodes = clone(allNodes);
    let curr1 = nodes.find(n => n.id === head1Id);
    let curr2 = nodes.find(n => n.id === head2Id);

    if (!curr1) return; 

    yield {
        nodes,
        highlightedNodes: [head1Id, head2Id].filter(Boolean) as string[],
        pointers: { [head1Id]: "Head 1", ...(head2Id ? {[head2Id]: "Head 2"} : {}) },
        message: "Starting Alternate Merge (Zip)"
    };

    while (curr1 && curr2) {
        let next1 = curr1.next ? nodes.find(n => n.id === curr1!.next) : undefined;
        let next2 = curr2.next ? nodes.find(n => n.id === curr2!.next) : undefined;

        curr1.next = curr2.id;
        yield {
            nodes: clone(nodes),
            highlightedNodes: [curr1.id, curr2.id],
            pointers: { [curr1.id]: "Curr 1", [curr2.id]: "Curr 2" },
            message: `Linked ${curr1.value} -> ${curr2.value}`
        };

        if (next1) {
            curr2.next = next1.id;
            yield {
                nodes: clone(nodes),
                highlightedNodes: [curr2.id, next1.id],
                pointers: { [curr2.id]: "Curr 2", [next1.id]: "Next 1" },
                message: `Linked ${curr2.value} -> ${next1.value}`
            };
        }

        curr1 = next1;
        curr2 = next2;
    }

    yield {
        nodes: clone(nodes),
        highlightedNodes: [],
        pointers: {},
        message: "Alternate Merge Complete."
    };
}

export function* generateMergeKListsSteps(
    allNodes: LinkedListNode[],
    heads: string[]
): Generator<LinkedListStep> {
    let nodes = clone(allNodes);

    if (heads.length === 0) return;
    if (heads.length === 1) {
        yield { nodes, highlightedNodes: [], pointers: {}, message: "Only one list. Done." };
        return;
    }

    let currentHeadId = heads[0];

    for (let i = 1; i < heads.length; i++) {
        let listToMergeId = heads[i];
        
        yield {
            nodes,
            highlightedNodes: [currentHeadId, listToMergeId],
            pointers: { [currentHeadId]: "Accumulated", [listToMergeId]: `List ${i+1}` },
            message: `Merging Accumulated List with List ${i+1}`
        };
        
        let c1: LinkedListNode | undefined = nodes.find(n => n.id === currentHeadId);
        let c2: LinkedListNode | undefined = nodes.find(n => n.id === listToMergeId);
        
        let newHeadId = (c1!.value <= c2!.value) ? c1!.id : c2!.id;
        let tail: LinkedListNode | null = null;
        
        c1 = nodes.find(n => n.id === currentHeadId);
        c2 = nodes.find(n => n.id === listToMergeId);

        while (c1 && c2) {
             let smaller: LinkedListNode;
             if (c1.value <= c2.value) {
                 smaller = c1;
                 c1 = c1.next ? nodes.find(n => n.id === c1!.next) : undefined;
             } else {
                 smaller = c2;
                 c2 = c2.next ? nodes.find(n => n.id === c2!.next) : undefined;
             }
             
             if (!tail) {
                 tail = smaller;
             } else {
                 tail.next = smaller.id;
                 yield {
                    nodes: clone(nodes),
                    highlightedNodes: [tail.id, smaller.id],
                    pointers: { [tail.id]: "Tail", [smaller.id]: "Next" },
                    message: `Internal Merge: Link ${tail.value} -> ${smaller.value}`
                };
                 tail = smaller;
             }
        }
        
        if (c1 && tail) { 
             tail.next = c1.id; 
             yield { nodes: clone(nodes), highlightedNodes: [], pointers: {}, message: "Attached remaining C1" };
        }
        else if (c2 && tail) {
             tail.next = c2.id;
             yield { nodes: clone(nodes), highlightedNodes: [], pointers: {}, message: "Attached remaining C2" };
        }
        
        currentHeadId = newHeadId; 
        
        yield {
            nodes: clone(nodes),
            highlightedNodes: [],
            pointers: { [currentHeadId]: "New Accumulator Head" },
            message: `Finished merging List ${i+1}`
        };
    }
    
    yield {
        nodes: clone(nodes),
        highlightedNodes: [],
        pointers: {},
        message: "Merge K Lists Complete."
    };
}

// --- INTERSECTION OPERATIONS ---

export function* generateIntersectionSteps(listA: LinkedListNode[], listB: LinkedListNode[]): Generator<LinkedListStep> {
    yield { nodes: [], highlightedNodes: [], pointers: {}, message: "Intersection Visualization requires UI update." };
}

// --- PALINDROME OPERATIONS ---

export function* generateCheckPalindromeSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    const nodes = clone(currentNodes);
    if (nodes.length === 0) return;

    let left = 0;
    let right = nodes.length - 1;

    yield {
        nodes,
        highlightedNodes: [nodes[left].id, nodes[right].id],
        pointers: { [nodes[left].id]: "Left", [nodes[right].id]: "Right" },
        message: "Comparing ends..."
    };

    while (left < right) {
        yield {
            nodes,
            highlightedNodes: [nodes[left].id, nodes[right].id],
            pointers: { [nodes[left].id]: "Left", [nodes[right].id]: "Right" },
            message: `Comparing ${nodes[left].value} vs ${nodes[right].value}`
        };

        if (nodes[left].value !== nodes[right].value) {
            yield {
                nodes,
                highlightedNodes: [nodes[left].id, nodes[right].id],
                pointers: { [nodes[left].id]: "Mismatch!", [nodes[right].id]: "Mismatch!" },
                message: "Values do not match. Not a palindrome."
            };
            return;
        }

        left++;
        right--;
    }

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "All checks passed. It is a palindrome!"
    };
}

export function* generateConvertToPalindromeSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if (nodes.length === 0) return;

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Strategy: Mirror first half onto second half."
    };

    let left = 0;
    let right = nodes.length - 1;

    while (left < right) {
        yield {
            nodes: clone(nodes),
            highlightedNodes: [nodes[left].id, nodes[right].id],
            pointers: { [nodes[left].id]: "Source", [nodes[right].id]: "Target" },
            message: `Copying ${nodes[left].value} to index ${right}...`
        };

        nodes[right].value = nodes[left].value;

        yield {
            nodes: clone(nodes),
            highlightedNodes: [nodes[left].id, nodes[right].id],
            pointers: { [nodes[left].id]: "Source", [nodes[right].id]: "Copied" },
            message: `Updated index ${right} to ${nodes[right].value}`
        };

        left++;
        right--;
    }

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Conversion complete."
    };
}

// --- REORDERING OPERATIONS ---

export function* generateRemoveNthFromEndSteps(currentNodes: LinkedListNode[], n: number): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if (n <= 0 || n > nodes.length) {
        yield { nodes, highlightedNodes: [], pointers: {}, message: "Invalid N." };
        return;
    }

    const targetIndex = nodes.length - n;
     
    let fast = 0;
    let slow = -1;

    yield {
        nodes,
        highlightedNodes: [nodes[0].id],
        pointers: { [nodes[0].id]: "Head" },
        message: `Goal: Remove ${n}th node from end (Index ${targetIndex}).`
    };

    for(let i=0; i<n; i++) {
        fast++;
         if(fast < nodes.length) {
             yield {
                nodes,
                highlightedNodes: [nodes[fast].id],
                pointers: { [nodes[fast].id]: "Fast" },
                message: `Advancing Fast... (${i+1}/${n})`
            };
         }
    }
    
    while (fast < nodes.length) {
        slow++;
        fast++;
        
        let ptrs: any = {};
        if (slow >= 0 && slow < nodes.length) ptrs[nodes[slow].id] = "Slow";
        if (fast < nodes.length) ptrs[nodes[fast].id] = "Fast";
        else if (nodes.length > 0) ptrs[nodes[nodes.length-1].id] = "Fast (NULL)";

        yield {
            nodes,
            highlightedNodes: slow >= 0 ? [nodes[slow].id] : [],
            pointers: ptrs,
            message: "Moving Slow and Fast together..."
        };
    }

    if(slow === -1) {
        yield {
            nodes,
            highlightedNodes: [nodes[0].id],
            pointers: { [nodes[0].id]: "Target" },
            message: "Target is Head. Removing Head."
        };
        nodes.shift();
    } else {
        const toRemove = nodes[slow + 1];
        yield {
            nodes,
            highlightedNodes: [nodes[slow].id, toRemove.id],
            pointers: { [nodes[slow].id]: "Prev", [toRemove.id]: "Target" },
            message: `Skipping target node ${toRemove.value}...`
        };
        nodes.splice(slow + 1, 1);
    }

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Node removed."
    };
}

export function* generateRotateListSteps(currentNodes: LinkedListNode[], k: number): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if(nodes.length === 0 || k === 0) return;

    const len = nodes.length;
    const rotations = k % len;

    if (rotations === 0) {
        yield { nodes, highlightedNodes: [], pointers: {}, message: "k is multiple of length. No change." };
        return;
    }

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: `Rotating right by ${rotations} positions...`
    };

    const newTailIndex = len - rotations - 1;
    const newHeadIndex = len - rotations;

    yield {
        nodes,
        highlightedNodes: [nodes[newTailIndex].id, nodes[newHeadIndex].id],
        pointers: { [nodes[newTailIndex].id]: "New Tail", [nodes[newHeadIndex].id]: "New Head" },
        message: "Identifying break point..."
    };

    const part1 = nodes.slice(0, newHeadIndex);
    const part2 = nodes.slice(newHeadIndex);
    
    nodes = [...part2, ...part1];

    yield {
        nodes: clone(nodes),
        highlightedNodes: [nodes[0].id, nodes[nodes.length-1].id],
        pointers: { [nodes[0].id]: "Head", [nodes[nodes.length-1].id]: "Tail" },
        message: "Rotated."
    };
}

export function* generateSwapPairsSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
     let nodes = clone(currentNodes);
     if (nodes.length < 2) return;

     let i = 0;
     while (i < nodes.length - 1) {
         let first = nodes[i];
         let second = nodes[i+1];

         yield {
             nodes: clone(nodes),
             highlightedNodes: [first.id, second.id],
             pointers: { [first.id]: "1st", [second.id]: "2nd" },
             message: `Swapping pair (${first.value}, ${second.value})...`
         };

         nodes[i] = second;
         nodes[i+1] = first;

         yield {
             nodes: clone(nodes),
             highlightedNodes: [second.id, first.id],
             pointers: { [second.id]: "Swapped", [first.id]: "Swapped" },
             message: "Pair swapped."
         };

         i += 2;
     }

     yield {
         nodes,
         highlightedNodes: [],
         pointers: {},
         message: "Swap Pairs complete."
     };
}

export function* generateOddEvenSteps(currentNodes: LinkedListNode[]): Generator<LinkedListStep> {
    let nodes = clone(currentNodes);
    if (nodes.length < 3) return;

    let oddArr: LinkedListNode[] = [];
    let evenArr: LinkedListNode[] = [];

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Separating Odd and Even indexed nodes..."
    };

    for(let i=0; i<nodes.length; i++) {
        const isOdd = (i+1) % 2 !== 0; 
        
        yield {
            nodes,
            highlightedNodes: [nodes[i].id],
            pointers: { [nodes[i].id]: isOdd ? "Odd" : "Even" },
            message: `Node ${nodes[i].value} is at index ${i+1} (${isOdd ? "Odd" : "Even"}).`
        };

        if(isOdd) oddArr.push(nodes[i]);
        else evenArr.push(nodes[i]);
    }

    nodes = [...oddArr, ...evenArr];

    yield {
        nodes,
        highlightedNodes: [],
        pointers: {},
        message: "Reconnecting: Odd List -> Even List."
    };
}
