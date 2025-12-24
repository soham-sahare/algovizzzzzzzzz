
import { SearchingStep } from "./linearSearch";

export function* generateExponentialSearchSteps(array: number[], target: number): Generator<SearchingStep> {
    const n = array.length;

    if (array[0] === target) {
         yield {
            array: [...array],
            indices: [0],
            message: `Found ${target} at index 0`,
            found: true,
            lineNumber: 1
        };
        return;
    }

    let i = 1;
    yield {
        array: [...array],
        indices: [i],
        message: `Start at index 1.`,
        found: false,
        lineNumber: 2
    };

    while (i < n && array[i] <= target) {
        
        yield {
            array: [...array],
            indices: [i],
            message: `Checked index ${i}, value ${array[i]}. ${array[i]} <= ${target}. Doubling index.`,
            found: false,
            lineNumber: 3
        };

        i = i * 2;
    }

    const low = Math.floor(i / 2);
    const high = Math.min(i, n - 1);

    yield {
        array: [...array],
        indices: [low, high],
        message: `Target is within range [${low}, ${high}]. Performing Binary Search...`,
        found: false,
        lineNumber: 4
    };

    // Binary Search on [low, high]
    let l = low;
    let r = high;
    
    while(l <= r) {
        const mid = Math.floor((l + r) / 2);
        
        yield {
            array: [...array],
            indices: [l, r, mid], // Highlight range + mid
            message: `Binary Search: Low=${l}, High=${r}. Mid=${mid} (${array[mid]})`,
            found: false,
            lineNumber: 5
        };

        if (array[mid] === target) {
             yield {
                array: [...array],
                indices: [mid],
                message: `Found ${target} at index ${mid}!`,
                found: true,
                lineNumber: 6
            };
            return;
        }

        if (array[mid] < target) {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    yield {
        array: [...array],
        indices: [],
        message: `Target ${target} not found.`,
        found: false,
        lineNumber: 7
    };
}
