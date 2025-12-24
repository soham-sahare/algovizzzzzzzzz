
import { LinkedListStep } from "./singly"; // Reuse existing type if compatible, or define new one

// We'll define a generic Node structure for visualization
export interface VisualNode {
    id: string;
    value: number;
    nextId: string | null;
    prevId?: string | null; // For Doubly
    highlight?: boolean;
    color?: string;
}

export type ListCRUDStep = {
    nodes: VisualNode[];
    pointers: { id: string, nodeId: string | null, label: string, color: string }[];
    message: string;
    lineNumber?: number;
}

export function* generateListCRUDSteps(
    initialValues: number[],
    type: 'SINGLY' | 'DOUBLY' | 'CIRCULAR',
    op: 'INSERT' | 'DELETE' | 'UPDATE' | 'GET',
    param1: number, // index or value (for delete value)
    param2?: number, // value for insert/update
    deleteByValue: boolean = false
): Generator<ListCRUDStep> {
    // 1. Reconstruct list state for simulation
    let nodes: VisualNode[] = initialValues.map((val, idx) => ({
        id: `node-${idx}`,
        value: val,
        nextId: idx < initialValues.length - 1 ? `node-${idx + 1}` : null,
        prevId: type === 'DOUBLY' && idx > 0 ? `node-${idx - 1}` : null
    }));

    // Fix connections for Circular
    if (type === 'CIRCULAR' && nodes.length > 0) {
        nodes[nodes.length - 1].nextId = nodes[0].id;
    }

    const headId = nodes.length > 0 ? nodes[0].id : null;
    
    // Helper to emit step
    function* emit(msg: string, pointers: any[] = [], highlights: string[] = []) {
        yield {
            nodes: nodes.map(n => ({
                ...n,
                highlight: highlights.includes(n.id)
            })),
            pointers,
            message: msg
        };
    }

    if (op === 'INSERT') {
        const index = param1;
        const value = param2!;
        
        // Handle Empty List Insertion
        if (nodes.length === 0) {
            if (index !== 0) {
                yield* emit("Error: Index out of bounds for empty list", []);
                return;
            }
            const newNode: VisualNode = { id: `new`, value, nextId: null, prevId: null, color: 'bg-green-100 border-green-500' };
            if (type === 'CIRCULAR') newNode.nextId = newNode.id; // Point to self
            nodes.push(newNode);
            yield* emit(`Inserted ${value} as Head`, [], [newNode.id]);
            return;
        }

        const newNode: VisualNode = { id: `new-${Date.now()}`, value, nextId: null, prevId: null, color: 'bg-green-100 border-green-500' };

        // Insert at Head
        if (index === 0) {
            yield* emit(`Creating new node ${value}`, [], []);
            
            newNode.nextId = headId;
            if (type === 'DOUBLY' && headId) {
                const head = nodes.find(n => n.id === headId);
                if (head) head.prevId = newNode.id;
            }

            // Circular Head Insert: Need to update Tail.next
            if (type === 'CIRCULAR') {
                yield* emit(`Circular: Traversing to tail to update next pointer...`, 
                    [{ id: 'trav', nodeId: headId, label: 'curr', color: 'bg-blue-500' }]);
                
                // Simulate traversal to tail (simplified for visual)
                 const tail = nodes[nodes.length - 1]; // In our array rep, last is tail
                 tail.nextId = newNode.id;
                 yield* emit(`Tail updated to point to new HEAD`, [], [tail.id]);
            }

            nodes.unshift(newNode);
            yield* emit(`Inserted ${value} at Head`, [{ id: 'head', nodeId: newNode.id, label: 'HEAD', color: 'bg-red-500' }], [newNode.id]);
            return;
        }

        // Insert at Index
        yield* emit(`Traversing to index ${index - 1}...`, [{ id: 'curr', nodeId: headId, label: 'curr', color: 'bg-blue-500' }]);
        
        // Simplified array-based traversal for visualization data generation
        // In real Linked List we'd loop.
        if (index < 0 || index > nodes.length) {
             yield* emit(`Index out of bounds!`, []);
             return;
        }

        let prevNodeIdx = index - 1;
        let prevNode = nodes[prevNodeIdx];

        yield* emit(`Found predecessor at index ${index-1}`, 
            [{ id: 'curr', nodeId: prevNode.id, label: 'prev', color: 'bg-blue-500' }],
            [prevNode.id]
        );

        newNode.nextId = prevNode.nextId;
        if (type === 'DOUBLY') {
            newNode.prevId = prevNode.id;
            const nextNode = nodes.find(n => n.id === prevNode.nextId);
            if (nextNode) nextNode.prevId = newNode.id;
        }
        
        prevNode.nextId = newNode.id;
        
        // Splice into array to keep visual order correct
        nodes.splice(index, 0, newNode);
        
        yield* emit(`Inserted ${value} at index ${index}`, 
            [{ id: 'ptr', nodeId: newNode.id, label: 'New', color: 'bg-green-500' }], 
            [newNode.id]
        );
    }

    else if (op === 'DELETE') {
        if (nodes.length === 0) {
            yield* emit("List is empty!", []);
            return;
        }

        // Delete By Value
        if (deleteByValue) {
            const valToDelete = param1;
             yield* emit(`Searching for value ${valToDelete}...`, [{ id: 'curr', nodeId: headId, label: 'curr', color: 'bg-blue-500' }]);
             
             const idx = nodes.findIndex(n => n.value === valToDelete);
             if (idx === -1) {
                 yield* emit(`Value ${valToDelete} not found.`, []);
                 return;
             }
             
             // Now delegate to delete by index logic or simulate here
             yield* emit(`Value found at index ${idx}. Deleting.`, 
                [{ id: 'curr', nodeId: nodes[idx].id, label: 'Target', color: 'bg-red-500' }], 
                [nodes[idx].id]
            );
            
            // Logic for deletion (simplified array manipulation for viz)
            // If Head
            if (idx === 0) {
                if (nodes.length === 1) {
                    nodes = [];
                    yield* emit("Deleted last node. List empty.", []);
                    return;
                }
                
                if (type === 'CIRCULAR') {
                     const tail = nodes[nodes.length - 1];
                     tail.nextId = nodes[1].id;
                }
                if (type === 'DOUBLY') {
                    nodes[1].prevId = null;
                }
                nodes.shift(); // Remove head
                yield* emit("Head deleted.", []);
                return;
            }
            
            // Middle/Tail
            const prev = nodes[idx - 1];
            const curr = nodes[idx];
            const next = idx < nodes.length - 1 ? nodes[idx + 1] : (type === 'CIRCULAR' ? nodes[0] : null); // For circular, next of tail is head
             
            prev.nextId = curr.nextId;
            if (type === 'DOUBLY' && idx < nodes.length - 1) {
                nodes[idx + 1].prevId = prev.id;
            }
            
            nodes.splice(idx, 1);
            yield* emit("Node removed. Links updated.", []);
            return;
        }

        // Delete By Index
        const index = param1;
        if (index < 0 || index >= nodes.length) {
            yield* emit("Index out of bounds!", []);
            return;
        }
        
        yield* emit(`Targeting index ${index} for deletion`, 
            [{ id: 'target', nodeId: nodes[index].id, label: 'Delete', color: 'bg-red-500' }]
        );

        if (index === 0) {
             // Head Delete Logic
             if (nodes.length === 1) {
                 nodes = [];
             } else {
                 if (type === 'CIRCULAR') nodes[nodes.length-1].nextId = nodes[1].id;
                 if (type === 'DOUBLY') nodes[1].prevId = null;
                 nodes.shift();
             }
             yield* emit("Head removed.", []);
        } else {
            const prev = nodes[index - 1];
            prev.nextId = nodes[index].nextId;
            if (type === 'DOUBLY' && index < nodes.length - 1) {
                nodes[index + 1].prevId = prev.id;
            }
            nodes.splice(index, 1);
            yield* emit(`Node at index ${index} removed.`, []);
        }
    }

    else if (op === 'UPDATE') {
        const index = param1;
        const val = param2!;
         if (index < 0 || index >= nodes.length) {
            yield* emit("Index out of bounds!", []);
            return;
        }
        
        yield* emit(`Accessing index ${index} to update value`, 
            [{ id: 'acc', nodeId: nodes[index].id, label: 'Access', color: 'bg-blue-500' }]
        );
        
        nodes[index].value = val;
        yield* emit(`Updated value to ${val}`, 
            [{ id: 'acc', nodeId: nodes[index].id, label: 'Updated', color: 'bg-green-500' }],
            [nodes[index].id]
        );
    }
    
    else if (op === 'GET') {
         const index = param1;
         if (index < 0 || index >= nodes.length) {
            yield* emit("Index out of bounds!", []);
            return;
        }
        
        // Traverse
        for (let i = 0; i <= index; i++) {
            yield* emit(`Traversing ${i}`, [{ id: 'curr', nodeId: nodes[i].id, label: 'curr', color: 'bg-blue-500' }], [nodes[i].id]);
        }
        
        yield* emit(`Found element at index ${index}: ${nodes[index].value}`, 
            [{ id: 'found', nodeId: nodes[index].id, label: 'Found', color: 'bg-green-500' }],
            [nodes[index].id]
        );
    }
}
