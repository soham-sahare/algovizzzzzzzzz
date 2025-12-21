import { SortingStep } from "../sorting/selectionSort";

export function* generateDNFSteps(array: number[]): Generator<SortingStep> {
    const arr = [...array];
    const n = arr.length;
    let low = 0;
    let mid = 0;
    let high = n - 1;

    // Initial State
    yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: [], 
        lineNumber: 1,
        labels: { [low]: "Low", [mid]: "Mid", [high]: "High" }
    };

    // Line 2: while mid <= high
    while (mid <= high) {
         // Visualize Comparison
         yield { 
            array: [...arr], 
            comparing: [mid], 
            swapping: [], 
            sorted: [], 
            lineNumber: 2,
            labels: { [low]: "Low", [mid]: "Mid", [high]: "High" } // Keep labels consistent
        };

        if (arr[mid] === 0) {
            // Case 0: Swap(low, mid), low++, mid++
             yield { 
                array: [...arr], 
                comparing: [mid], 
                swapping: [low, mid], 
                sorted: [], 
                lineNumber: 3,
                labels: { [low]: "Swap", [mid]: "Swap", [high]: "High" }
            };
            
            [arr[low], arr[mid]] = [arr[mid], arr[low]];
            
            yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 3,
                labels: { [low]: "Low++", [mid]: "Mid++", [high]: "High" }
            };
            
            low++;
            mid++;

        } else if (arr[mid] === 1) {
            // Case 1: mid++
             yield { 
                array: [...arr], 
                comparing: [mid], 
                swapping: [], 
                sorted: [], 
                lineNumber: 4,
                labels: { [low]: "Low", [mid]: "Move ->", [high]: "High" }
            };
            mid++;

        } else {
            // Case 2: Swap(mid, high), high--
             yield { 
                array: [...arr], 
                comparing: [mid], 
                swapping: [mid, high], 
                sorted: [], 
                lineNumber: 5,
                labels: { [low]: "Low", [mid]: "Swap", [high]: "Swap" }
            };
            
            [arr[mid], arr[high]] = [arr[high], arr[mid]];
            
            yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 5,
                labels: { [low]: "Low", [mid]: "Mid", [high]: "High--" }
            };
            
            high--;
        }
    }

    // Done
    yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: Array.from({length: n}, (_, k) => k), 
        lineNumber: 6,
        labels: {} 
    };
}
