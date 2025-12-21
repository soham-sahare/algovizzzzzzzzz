import { SortingStep } from "./selectionSort";

export function* generateMergeSortSteps(initialArray: number[]): Generator<SortingStep> {
    const arr = [...initialArray];
    const n = arr.length;
    // Map of sorted indices is hard to track purely in recursive merge sort, 
    // but effectively the range [left, right] becomes sorted after merging.
    
    yield { array: [...arr], comparing: [], swapping: [], sorted: [], lineNumber: 1 };

    function* merge(left: number, mid: number, right: number): Generator<SortingStep> {
        const n1 = mid - left + 1;
        const n2 = right - mid;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[left + i];
        for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        let i = 0;
        let j = 0;
        let k = left;

        // Line 4: while i < n1 and j < n2
        yield { array: [...arr], comparing: [], swapping: [], sorted: [], lineNumber: 4 };

        while (i < n1 && j < n2) {
            // Line 5: if L[i] <= R[j]
            yield { array: [...arr], comparing: [left + i, mid + 1 + j], swapping: [], sorted: [], lineNumber: 5 };
            
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                // Line 6: arr[k] = L[i]
                yield { array: [...arr], comparing: [], swapping: [k], sorted: [], lineNumber: 6 };
                i++;
            } else {
                arr[k] = R[j];
                // Line 7: arr[k] = R[j]
                 yield { array: [...arr], comparing: [], swapping: [k], sorted: [], lineNumber: 7 };
                j++;
            }
            k++;
        }

        // Copy remaining elements
        while (i < n1) {
            arr[k] = L[i];
            yield { array: [...arr], comparing: [], swapping: [k], sorted: [], lineNumber: 8 };
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
             yield { array: [...arr], comparing: [], swapping: [k], sorted: [], lineNumber: 9 };
            j++;
            k++;
        }
    }

    function* mergeSort(left: number, right: number): Generator<SortingStep> {
        if (left >= right) {
            return;
        }
        
        // Line 2: mid = left + (right - left) / 2
        const mid = Math.floor(left + (right - left) / 2);
        yield { array: [...arr], comparing: [], swapping: [], sorted: [], lineNumber: 2 };

        // Line 3: mergeSort(arr, left, mid)
        yield* mergeSort(left, mid);
        yield { array: [...arr], comparing: [], swapping: [], sorted: [], lineNumber: 3 };

        // Line 3: mergeSort(arr, mid + 1, right)
        yield* mergeSort(mid + 1, right);
        
        // Merge
        yield* merge(left, mid, right);
    }

    yield* mergeSort(0, n - 1);

    yield { array: [...arr], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), lineNumber: 10 };
}
