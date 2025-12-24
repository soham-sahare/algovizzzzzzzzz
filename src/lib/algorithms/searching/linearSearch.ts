import { SortingStep } from "../sorting/selectionSort"; // Reuse type, though we might want a generic one later.
// SortingStep has: array, comparing[], swapping[], sorted[], lineNumber
// For searching, we can use 'comparing' for the current element check.
// 'sorted' can be used to mark "checked" elements or the found element.

export function* generateLinearSearchSteps(array: number[], target: number): Generator<SortingStep> {
    const n = array.length;
    
    // Line 1: for i = 0 to n-1
    yield { array: [...array], comparing: [], swapping: [], sorted: [], lineNumber: 1 };

    for (let i = 0; i < n; i++) {
        // Line 2: if arr[i] == target
        yield { array: [...array], comparing: [i], swapping: [], sorted: [], lineNumber: 2 };

        if (array[i] === target) {
            // Found!
            // Line 3: return i
            yield { array: [...array], comparing: [], swapping: [], sorted: [i], lineNumber: 3 };
            return;
        }
    }

    // Line 4: return -1
    yield { array: [...array], comparing: [], swapping: [], sorted: [], lineNumber: 4 };
}

export interface SearchingStep {
    array: number[];
    indices: number[];
    message: string;
    found: boolean;
    lineNumber?: number;
}
