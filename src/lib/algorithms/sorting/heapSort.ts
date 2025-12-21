import { SortingStep } from "./selectionSort";

export function* generateHeapSortSteps(initialArray: number[]): Generator<SortingStep> {
    const arr = [...initialArray];
    const n = arr.length;

    // Helper for heapify
    function* heapify(n: number, i: number): Generator<SortingStep> {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        // Line 8: largest = i
        // Line 9: l = 2*i + 1, r = 2*i + 2
        
        // Line 10: if l < n and arr[l] > arr[largest]
        if (l < n) {
             yield { array: [...arr], comparing: [l, largest], swapping: [], sorted: [], lineNumber: 10 };
             if (arr[l] > arr[largest]) {
                 largest = l;
             }
        }

        // Line 11: if r < n and arr[r] > arr[largest]
        if (r < n) {
            yield { array: [...arr], comparing: [r, largest], swapping: [], sorted: [], lineNumber: 11 };
            if (arr[r] > arr[largest]) {
                largest = r;
            }
        }

        // Line 12: if largest != i
        if (largest !== i) {
            // Line 13: swap(arr[i], arr[largest])
            yield { array: [...arr], comparing: [], swapping: [i, largest], sorted: [], lineNumber: 13 };
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            yield { array: [...arr], comparing: [], swapping: [i, largest], sorted: [], lineNumber: 13 };

            // Line 14: heapify(arr, n, largest)
            yield* heapify(n, largest);
        }
    }

    yield { array: [...arr], comparing: [], swapping: [], sorted: [], lineNumber: 1 };

    // Build max heap
    // Line 2: buildMaxHeap(arr) -> for i = n/2 - 1 to 0
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(n, i);
    }

    // Extract elements
    // Line 3: for i from n-1 down to 1
    for (let i = n - 1; i > 0; i--) {
        // Line 4: swap(arr[0], arr[i])
        yield { array: [...arr], comparing: [], swapping: [0, i], sorted: Array.from({length: n-1-i}, (_, k) => n-1-k), lineNumber: 4 };
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { array: [...arr], comparing: [], swapping: [0, i], sorted: Array.from({length: n-i}, (_, k) => n-1-k), lineNumber: 4 };

        // Line 5: heapify(arr, i, 0)
        yield* heapify(i, 0);
    }

    // Final sorted state
    yield { array: [...arr], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), lineNumber: 15 };
}
