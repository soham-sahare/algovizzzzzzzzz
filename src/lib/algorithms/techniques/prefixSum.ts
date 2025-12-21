import { SortingStep } from "../sorting/selectionSort";

export function* generatePrefixSumSteps(array: number[], query?: { l: number; r: number }): Generator<SortingStep> {
    const arr = [...array];
    const n = arr.length;
    const prefix = new Array(n).fill(0);
    
    // Step 1: Build Prefix Sum Array
    // Line 1: P[0] = arr[0]
    prefix[0] = arr[0];
    yield { 
        array: [...prefix], // visualizing prefix array construction
        comparing: [0], 
        swapping: [], 
        sorted: [], 
        lineNumber: 1,
        labels: { [0]: `${arr[0]}` }
    };

    // Line 2: for i = 1 to n-1
    for (let i = 1; i < n; i++) {
        // Line 3: P[i] = P[i-1] + arr[i]
        prefix[i] = prefix[i - 1] + arr[i];
         yield { 
            array: [...prefix], 
            comparing: [i, i-1], // showing dependency
            swapping: [], 
            sorted: Array.from({length: i}, (_, k) => k), 
            lineNumber: 3,
            labels: { [i]: `${prefix[i-1]} + ${arr[i]}` }
        };
    }

    // Finished building
    yield { 
        array: [...prefix], 
        comparing: [], 
        swapping: [], 
        sorted: Array.from({length: n}, (_, k) => k), 
        lineNumber: 4,
        labels: {}
    };

    // Step 2: Query (if provided)
    if (query) {
        const { l, r } = query;
        // Line 5: if l == 0 return P[r]
        if (l === 0) {
             yield { 
                array: [...prefix], 
                comparing: [r], 
                swapping: [], 
                sorted: Array.from({length: n}, (_, k) => k), 
                lineNumber: 5,
                labels: { [r]: `Sum(0, ${r}) = ${prefix[r]}` }
            };
        } else {
            // Line 6: return P[r] - P[l-1]
             yield { 
                array: [...prefix], 
                comparing: [r, l-1], 
                swapping: [], 
                sorted: Array.from({length: n}, (_, k) => k), 
                lineNumber: 6,
                labels: { [r]: `P[${r}]`, [l-1]: `- P[${l-1}]` }
            };
        }
    }
}
