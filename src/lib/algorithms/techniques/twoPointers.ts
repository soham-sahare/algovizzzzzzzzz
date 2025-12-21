import { SortingStep } from "../../sorting/selectionSort";

export function* generateTwoPointersSteps(array: number[], target: number): Generator<SortingStep> {
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;

    // Line 1: left = 0, right = n - 1
    yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: [], 
        lineNumber: 1,
        labels: { [left]: "L", [right]: "R" }
    };

    // Line 2: while left < right
    while (left < right) {
        // Line 3: sum = arr[left] + arr[right]
        // Visualize the pair being summed
        yield { 
            array: [...arr], 
            comparing: [left, right], // Highlight the pair
            swapping: [], 
            sorted: [], 
            lineNumber: 3,
            labels: { [left]: "L", [right]: "R" }
        };

        const sum = arr[left] + arr[right];

        // Line 4: if sum == target
        if (sum === target) {
            // Line 5: return [left, right]
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [left, right], // Mark as found
                lineNumber: 5,
                labels: { [left]: "Found", [right]: "Found" }
            };
            return;
        }

        // Line 6: if sum < target
        if (sum < target) {
            // Line 7: left++
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 7,
                labels: { [left]: "L ->", [right]: "R" } // Visualization hint
            };
            left++;
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 7,
                labels: { [left]: "L", [right]: "R" }
            };
        } else {
            // Line 9: right--
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 9,
                labels: { [left]: "L", [right]: "<- R" } // Visualization hint
            };
            right--;
             yield { 
                array: [...arr], 
                comparing: [], 
                swapping: [], 
                sorted: [], 
                lineNumber: 9,
                labels: { [left]: "L", [right]: "R" }
            };
        }
    }

    // Line 10: return -1
    yield { 
        array: [...arr], 
        comparing: [], 
        swapping: [], 
        sorted: [], 
        lineNumber: 10,
        labels: {}
    };
}
