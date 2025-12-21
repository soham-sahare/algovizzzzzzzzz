import { SortingStep } from "../sorting/selectionSort";

export function* generateBinarySearchSteps(array: number[], target: number): Generator<SortingStep> {
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;
    
    // Line 1: while left <= right
    yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: [], 
        lineNumber: 1,
        labels: { [left]: "L", [right]: "R" }
    };

    while (left <= right) {
        // Line 2: mid = left + (right - left) / 2
        const mid = Math.floor(left + (right - left) / 2);
        
        // Visualize with Mid pointer
        yield { 
            array: [...arr], 
            comparing: [mid], 
            swapping: [], 
            sorted: [], 
            lineNumber: 2,
            labels: { [left]: "L", [right]: "R", [mid]: "M" }
        };

        // Line 3: if arr[mid] == target
        if (arr[mid] === target) {
            // Line 4: return mid
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [mid], 
                lineNumber: 4,
                labels: { [mid]: "Found!" }
            };
            return;
        }

        // Line 5: if arr[mid] < target
        if (arr[mid] < target) {
            // Line 6: left = mid + 1
            left = mid + 1;
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 6,
                labels: { [left]: "L", [right]: "R" }
            };
        } else {
            // Line 8: right = mid - 1
            right = mid - 1;
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 8,
                labels: { [left]: "L", [right]: "R" }
            };
        }
    }

    // Line 9: return -1
    yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: [], 
        lineNumber: 9,
        labels: {} 
    };
}
