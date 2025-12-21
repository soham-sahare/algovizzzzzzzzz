import { SortingStep } from "../sorting/selectionSort";

export function* generateKadanesSteps(array: number[]): Generator<SortingStep> {
    const arr = [...array];
    const n = arr.length;
    
    let currentSum = arr[0];
    let maxSum = arr[0];
    let start = 0;
    let end = 0;
    let tempStart = 0;

    // Line 1: Initialize
    yield { 
        array: [...arr], 
        comparing: [0], 
        swapping: [], 
        sorted: [], 
        lineNumber: 1,
        labels: { [0]: "Curr & Max" }
    };

    // Line 2: for i = 1 to n-1
    for (let i = 1; i < n; i++) {
        // Visualize checking next element
        yield { 
            array: [...arr], 
            comparing: [i], 
            swapping: [], 
            sorted: [], 
            lineNumber: 2,
            labels: { [i]: "?" }
        };

        // Line 3: currentSum = max(arr[i], currentSum + arr[i])
        // Decide whether to start fresh or extend
        if (arr[i] > currentSum + arr[i]) {
            currentSum = arr[i];
            tempStart = i;
             yield { 
                array: [...arr], 
                comparing: [i], 
                swapping: [], 
                sorted: [], 
                lineNumber: 3,
                labels: { [i]: "Alert: Start New!" }
            };
        } else {
            currentSum += arr[i];
             yield { 
                array: [...arr], 
                comparing: Array.from({length: i - tempStart + 1}, (_, k) => tempStart + k), 
                swapping: [], 
                sorted: [], 
                lineNumber: 3,
                labels: { [i]: "Extend" }
            };
        }

        // Line 4: if currentSum > maxSum
        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
            // Line 5: Update Max
             yield { 
                array: [...arr], 
                comparing: Array.from({length: end - start + 1}, (_, k) => start + k), 
                swapping: [], 
                sorted: Array.from({length: end - start + 1}, (_, k) => start + k), 
                lineNumber: 5,
                labels: { [end]: "New Max!" }
            };
        } else {
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: Array.from({length: end - start + 1}, (_, k) => start + k), // Keep old max highlighted
                lineNumber: 4,
                labels: {} 
            };
        }
    }

    // Line 6: Return max
    yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: Array.from({length: end - start + 1}, (_, k) => start + k), 
        lineNumber: 6,
        labels: { [start]: "Start", [end]: "End" }
    };
}
