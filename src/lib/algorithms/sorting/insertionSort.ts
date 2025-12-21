import { SortingStep } from "./selectionSort"; // Reuse type

export function* generateInsertionSortSteps(initialArray: number[]): Generator<SortingStep> {
    const arr = [...initialArray];
    const n = arr.length;
    // Indices 0..i-1 are sorted relative to each other
    // We treat 0 as initially sorted
    
    // Start with 0 as conceptual sorted part
    yield { array: [...arr], comparing: [], swapping: [], sorted: [0], lineNumber: 1 };

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        // Line 1: loop i from 1 to n
        // Line 2: key = arr[i]
        yield { array: [...arr], comparing: [i], swapping: [], sorted: Array.from({length: i}, (_, k) => k), lineNumber: 2 };

        // Line 4: while loop check
        while (j >= 0) {
            // Line 3: j = i - 1 (conceptually reset each time but we track j)
            // Compare key with arr[j]
             yield { array: [...arr], comparing: [j, j+1], swapping: [], sorted: Array.from({length: i}, (_, k) => k), lineNumber: 4 };

            if (arr[j] > key) {
                // Line 5: arr[j+1] = arr[j]
                arr[j + 1] = arr[j];
                // Visualize the shift (copy)
                 yield { array: [...arr], comparing: [j], swapping: [j+1], sorted: Array.from({length: i}, (_, k) => k), lineNumber: 5 };
                
                // Line 6: j = j - 1
                j--;
            } else {
                break;
            }
        }
        
        // Line 7: arr[j+1] = key
        arr[j + 1] = key;
         yield { array: [...arr], comparing: [], swapping: [j+1], sorted: Array.from({length: i+1}, (_, k) => k), lineNumber: 7 };
    }
    
    // Final
    yield { array: [...arr], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), lineNumber: 8 };
}
