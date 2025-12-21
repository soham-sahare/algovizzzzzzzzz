import { SortingStep } from "./selectionSort";

export function* generateQuickSortSteps(initialArray: number[]): Generator<SortingStep> {
    const arr = [...initialArray];
    const n = arr.length;
    
    yield { array: [...arr], comparing: [], swapping: [], sorted: [], lineNumber: 1 };

    function* partition(low: number, high: number): Generator<SortingStep> {
        // Pivot selection (taking last element)
        const pivot = arr[high];
        let i = low - 1; // Index of smaller element

        // Line 4: pivot = arr[high]
        yield { array: [...arr], comparing: [high], swapping: [], sorted: [], lineNumber: 4 };

        for (let j = low; j < high; j++) {
            // Line 5: for j = low to high - 1
            // Compare arr[j] with pivot
            yield { array: [...arr], comparing: [j, high], swapping: [], sorted: [], lineNumber: 5 };

            // Line 6: if arr[j] < pivot
            if (arr[j] < pivot) {
                i++;
                // Swap arr[i] and arr[j]
                // Line 7: swap(arr[i], arr[j])
                yield { array: [...arr], comparing: [], swapping: [i, j], sorted: [], lineNumber: 7 };
                [arr[i], arr[j]] = [arr[j], arr[i]];
                yield { array: [...arr], comparing: [], swapping: [i, j], sorted: [], lineNumber: 7 };
            }
        }

        // Swap pivot into correct place
        // Line 8: swap(arr[i+1], arr[high])
        yield { array: [...arr], comparing: [], swapping: [i + 1, high], sorted: [], lineNumber: 8 };
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        yield { array: [...arr], comparing: [], swapping: [i + 1, high], sorted: [], lineNumber: 8 };

        return i + 1;
    }

    function* quickSort(low: number, high: number): Generator<SortingStep> {
        if (low < high) {
            // Line 2: if low < high
            // Partition index
            // Line 3: pi = partition(arr, low, high)
            
            // We need to yield* from the generator returned by partition, but generator function returns Iterator not value directly in JS/TS in this syntax easily without a wrapper or just changing logic.
            // Actually in TS generators, we can't easily return a value and iterate. 
            // So we have to compute partition inside loop or modify structure.
            // Let's inline partition logic or adjust structure slightly. 
            // Re-implementing with yielding inside.

            // Calling partition generator
            const partitionGen = partition(low, high);
            let result = partitionGen.next();
            let pi = 0;
            
            while (!result.done) {
                yield result.value;
                result = partitionGen.next();
            }
            // The return value of partition generator is the pivot index. 
            // TS Generator return type handling requires casting or careful design.
            // Simplification: We will manualy track pivot index logic here to avoid complex generator delegation for return values.
             
             // --- Inline Partition Logic Re-start ---
             const pivot = arr[high];
             let i = low - 1;
             yield { array: [...arr], comparing: [high], swapping: [], sorted: [], lineNumber: 4 }; // pivot highlight
             
             for (let j = low; j < high; j++) {
                yield { array: [...arr], comparing: [j, high], swapping: [], sorted: [], lineNumber: 5 }; // compare
                if (arr[j] < pivot) {
                    i++;
                     yield { array: [...arr], comparing: [], swapping: [i, j], sorted: [], lineNumber: 7 }; // swap
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                     yield { array: [...arr], comparing: [], swapping: [i, j], sorted: [], lineNumber: 7 };
                }
             }
             yield { array: [...arr], comparing: [], swapping: [i + 1, high], sorted: [], lineNumber: 8 }; // swap pivot
             [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
             yield { array: [...arr], comparing: [], swapping: [i + 1, high], sorted: [], lineNumber: 8 };
             
             pi = i + 1;
             // --- End Inline Partition ---

            yield* quickSort(low, pi - 1);
            yield* quickSort(pi + 1, high);
        }
    }

    yield* quickSort(0, n - 1);
    
    // Final sorted state
    yield { array: [...arr], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), lineNumber: 9 };
}
