
import { SearchingStep } from "./linearSearch";

export function* generateInterpolationSearchSteps(array: number[], target: number): Generator<SearchingStep> {
    let low = 0;
    let high = (array.length - 1);

    yield {
        array: [...array],
        indices: [low, high],
        message: `Range: [${low} ... ${high}]`,
        found: false,
        lineNumber: 1
    };

    while (low <= high && target >= array[low] && target <= array[high]) {
        if (low === high) {
             if (array[low] === target) {
                 yield {
                    array: [...array],
                    indices: [low],
                    message: `Found at index ${low}`,
                    found: true,
                    lineNumber: 7
                };
                return;
             }
             yield {
                array: [...array],
                indices: [low],
                message: `Not found at index ${low}`,
                found: false,
                lineNumber: 8
            };
             return;
        }

        // Probe Formula
        const pos = low + Math.floor(((high - low) / (array[high] - array[low])) * (target - array[low]));
        
        yield {
            array: [...array],
            indices: [pos],
            message: `Probing position ${pos} using interpolation formula...`,
            found: false,
            lineNumber: 2
        };

        if (array[pos] === target) {
             yield {
                array: [...array],
                indices: [pos],
                message: `Found ${target} at index ${pos}!`,
                found: true,
                lineNumber: 3
            };
            return;
        }

        if (array[pos] < target) {
             yield {
                array: [...array],
                indices: [pos],
                message: `${array[pos]} < ${target}. Target is in right part. Low = ${pos + 1}`,
                found: false,
                lineNumber: 4
            };
            low = pos + 1;
        } else {
             yield {
                array: [...array],
                indices: [pos],
                message: `${array[pos]} > ${target}. Target is in left part. High = ${pos - 1}`,
                found: false,
                lineNumber: 5
            };
            high = pos - 1;
        }
    }
    
    yield {
        array: [...array],
        indices: [],
        message: `Target ${target} not found.`,
        found: false,
        lineNumber: 6
    };
}
