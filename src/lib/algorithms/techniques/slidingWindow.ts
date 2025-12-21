import { SortingStep } from "../../sorting/selectionSort";

export function* generateSlidingWindowSteps(array: number[], k: number): Generator<SortingStep> {
    const arr = [...array];
    const n = arr.length;
    
    if (n < k || k <= 0) {
        return;
    }

    let currentSum = 0;
    
    // Calculate sum of first window
    // Line 1: currentSum = 0
    // Line 2: for i = 0 to k-1
    for (let i = 0; i < k; i++) {
        yield { 
            array: [...arr], 
            comparing: [i], 
            swapping: [], 
            sorted: [], 
            lineNumber: 2,
            labels: { [i]: "Add" }
        };
        currentSum += arr[i];
    }

    let maxSum = currentSum;
    let maxWindowStart = 0;

    // Yield initial window state
    // Line 3: maxSum = currentSum
    yield { 
        array: [...arr], 
        comparing: Array.from({length: k}, (_, i) => i), // Highlight whole window
        swapping: [], 
        sorted: [], 
        lineNumber: 3,
        labels: { [0]: "Start", [k-1]: "End" }
    };

    // Slide the window
    // Line 4: for i = k to n-1
    for (let i = k; i < n; i++) {
        // Line 5: currentSum += arr[i] - arr[i-k]
        // Visualize removing outgoing element
        yield { 
            array: [...arr], 
            comparing: [], 
            swapping: [], 
            sorted: [], 
            lineNumber: 5,
            labels: { [i - k]: "Remove (-)", [i]: "Add (+)" }
        };

        currentSum += arr[i] - arr[i - k];

        // Line 6: maxSum = max(maxSum, currentSum)
        if (currentSum > maxSum) {
            maxSum = currentSum;
            maxWindowStart = i - k + 1;
            // Line 7: Update max
             yield { 
                array: [...arr], 
                comparing: Array.from({length: k}, (_, idx) => i - k + 1 + idx), 
                swapping: [], 
                sorted: [maxWindowStart], // Just mark start of new max window generally or specially
                lineNumber: 7,
                labels: { [i - k + 1]: "New Max!" }
            };
        } else {
             yield { 
                array: [...arr], 
                comparing: Array.from({length: k}, (_, idx) => i - k + 1 + idx), // Current window
                swapping: [], 
                sorted: [], 
                lineNumber: 6,
                labels: {}
            };
        }
    }

    // Final state: Highlight optimal window
     yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: Array.from({length: k}, (_, idx) => maxWindowStart + idx), 
        lineNumber: 8,
        labels: { [maxWindowStart]: "Max Window" }
    };
}
