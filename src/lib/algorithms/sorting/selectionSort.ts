export type SortingStep = {
    array: number[];
    comparing: number[]; // Indices being compared
    swapping: number[];  // Indices being swapped
    sorted: number[];    // Indices that are sorted
    lineNumber?: number; // For pseudocode highlighting
    labels?: { [index: number]: string }; // Optional labels for specific indices (e.g., L, R, Mid)
};

export function* generateSelectionSortSteps(initialArray: number[]): Generator<SortingStep> {
    const arr = [...initialArray];
    const n = arr.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        
        // Line 1: for i = 0 to n-1
        // Line 2: min = i
        yield { array: [...arr], comparing: [i], swapping: [], sorted: [...sortedIndices], lineNumber: 2 };

        for (let j = i + 1; j < n; j++) {
            // Line 3: for j = i+1 to n
            yield { array: [...arr], comparing: [j, minIdx], swapping: [], sorted: [...sortedIndices], lineNumber: 3 };

            // Line 4: if arr[j] < arr[min]
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                // Line 5: min = j
                yield { array: [...arr], comparing: [j], swapping: [], sorted: [...sortedIndices], lineNumber: 5 };
            }
        }

        // Line 6: if min != i
        if (minIdx !== i) {
            // Line 7: swap(arr[i], arr[min])
            yield { array: [...arr], comparing: [], swapping: [i, minIdx], sorted: [...sortedIndices], lineNumber: 7 };
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield { array: [...arr], comparing: [], swapping: [i, minIdx], sorted: [...sortedIndices], lineNumber: 7 };
        }

        sortedIndices.push(i);
        yield { array: [...arr], comparing: [], swapping: [], sorted: [...sortedIndices], lineNumber: 1 };
    }
    
    // Final state
    yield { array: [...arr], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), lineNumber: 8 };
}
