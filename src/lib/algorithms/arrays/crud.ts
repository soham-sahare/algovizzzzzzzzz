
export type ArrayCRUDStep = {
    array: (number | null)[];
    highlightIndices: number[];
    pointers: { index: number, label: string, color: string }[];
    message: string;
    lineNumber?: number;
}

export function* generateArrayCRUDSteps(
    initialArray: number[], 
    op: 'INSERT' | 'UPDATE' | 'DELETE_INDEX' | 'DELETE_VALUE', 
    param1: number, // index or value depending on op
    param2?: number // value for INSERT/UPDATE
): Generator<ArrayCRUDStep> {
    const arr: (number | null)[] = [...initialArray]; // Use internal copy

    if (op === 'INSERT') {
        const index = param1;
        const value = param2!;
        
        if (index < 0 || index > arr.length) {
             yield { array: [...arr], highlightIndices: [], pointers: [], message: "Index out of bounds!", lineNumber: 0 };
             return;
        }

        yield { array: [...arr], highlightIndices: [], pointers: [{ index, label: 'Target', color: 'bg-blue-500' }], message: `Task: Insert ${value} at index ${index}`, lineNumber: 1 };
        
        // Expand array first
        arr.push(null);
        yield { array: [...arr], highlightIndices: [arr.length-1], pointers: [], message: `Expanded array size by 1.`, lineNumber: 2 };

        // Shifting
        for (let i = arr.length - 2; i >= index; i--) {
            yield { 
                array: [...arr], 
                highlightIndices: [i, i+1], 
                pointers: [{ index: i, label: 'Move', color: 'bg-purple-500' }], 
                message: `Shifting element at ${i} to ${i+1}`, 
                lineNumber: 3 
            };
            arr[i+1] = arr[i];
            arr[i] = null; // visual gap
        }

        yield { array: [...arr], highlightIndices: [index], pointers: [{ index, label: 'Empty', color: 'bg-yellow-500' }], message: `Space created at index ${index}. ready to insert.`, lineNumber: 4 };
        
        arr[index] = value;
        yield { 
            array: [...arr], 
            highlightIndices: [index], 
            pointers: [{ index, label: 'Inserted', color: 'bg-green-500' }], 
            message: `Inserted ${value} at index ${index}!`, 
            lineNumber: 5 
        };
    }

    else if (op === 'DELETE_INDEX') {
        const index = param1;
        
        if (index < 0 || index >= arr.length) {
             yield { array: [...arr], highlightIndices: [], pointers: [], message: "Index out of bounds!", lineNumber: 0 };
             return;
        }

        yield { array: [...arr], highlightIndices: [index], pointers: [{ index, label: 'Delete', color: 'bg-red-500' }], message: `Task: Delete element at index ${index}`, lineNumber: 1 };
        
        arr[index] = null;
        yield { array: [...arr], highlightIndices: [index], pointers: [], message: `Element removed. Shifting remaining elements...`, lineNumber: 2 };

        for (let i = index; i < arr.length - 1; i++) {
             yield { 
                array: [...arr], 
                highlightIndices: [i, i+1], 
                pointers: [{ index: i+1, label: 'Shift Left', color: 'bg-purple-500' }], 
                message: `Moving element from ${i+1} to ${i}`, 
                lineNumber: 3 
            };
            arr[i] = arr[i+1];
            arr[i+1] = null;
        }

        arr.pop(); // Remove last null
        yield { 
            array: [...arr], 
            highlightIndices: [], 
            pointers: [], 
            message: `Deletion complete. Array resized.`, 
            lineNumber: 4 
        };
    }

    else if (op === 'DELETE_VALUE') {
        const value = param1;
        yield { array: [...arr], highlightIndices: [], pointers: [], message: `Task: Delete first occurrence of value ${value}`, lineNumber: 1 };
        
        let foundIndex = -1;
        for (let i = 0; i < arr.length; i++) {
            yield { array: [...arr], highlightIndices: [i], pointers: [{ index: i, label: '?', color: 'bg-blue-500' }], message: `Checking index ${i}: Is ${arr[i]} == ${value}?`, lineNumber: 2 };
            
            if (arr[i] === value) {
                foundIndex = i;
                 yield { array: [...arr], highlightIndices: [i], pointers: [{ index: i, label: 'Found', color: 'bg-green-500' }], message: `Found ${value} at index ${i}! Deleting...`, lineNumber: 3 };
                break;
            }
        }

        if (foundIndex === -1) {
            yield { array: [...arr], highlightIndices: [], pointers: [], message: `Value ${value} not found in array.`, lineNumber: 4 };
            return;
        }

        // Delegate to delete by index logic efficiently re-implemented here
        arr[foundIndex] = null;
        for (let i = foundIndex; i < arr.length - 1; i++) {
             yield { 
                array: [...arr], 
                highlightIndices: [i, i+1], 
                pointers: [{ index: i+1, label: 'Shift', color: 'bg-purple-500' }], 
                message: `Shifting ${i+1} to ${i}`, 
                lineNumber: 5
            };
            arr[i] = arr[i+1];
            arr[i+1] = null;
        }
        arr.pop();
        yield { array: [...arr], highlightIndices: [], pointers: [], message: `Deletion complete.`, lineNumber: 6 };
    }

    else if (op === 'UPDATE') {
        const index = param1;
        const value = param2!;
        
        if (index < 0 || index >= arr.length) return;

        yield { array: [...arr], highlightIndices: [index], pointers: [{ index, label: 'Target', color: 'bg-blue-500' }], message: `Task: Update index ${index} to ${value}`, lineNumber: 1 };
        
        arr[index] = value;
        yield { array: [...arr], highlightIndices: [index], pointers: [{ index, label: 'Updated', color: 'bg-green-500' }], message: `Value updated!`, lineNumber: 2 };
    }
}
