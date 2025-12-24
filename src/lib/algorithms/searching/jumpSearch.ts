
import { SearchingStep } from "./linearSearch";

export function* generateJumpSearchSteps(array: number[], target: number): Generator<SearchingStep> {
    const n = array.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;

    yield {
        array: [...array],
        indices: [],
        message: `Step Size: ${step}. Jumping through array...`,
        found: false,
        lineNumber: 1
    };

    // Jump
    while (array[Math.min(step, n) - 1] < target) {
        yield {
            array: [...array],
            indices: [Math.min(step, n) - 1],
            message: `Checked ${array[Math.min(step, n) - 1]} at index ${Math.min(step, n) - 1}. ${array[Math.min(step, n) - 1]} < ${target}`,
            found: false,
            lineNumber: 2
        };

        prev = step;
        step += Math.floor(Math.sqrt(n));
        
        if (prev >= n) {
             yield {
                array: [...array],
                indices: [],
                message: `Target ${target} not found (exceeded bound).`,
                found: false,
                lineNumber: 3
            };
            return;
        }
    }

    // Linear Search block
    yield {
        array: [...array],
        indices: [prev],
        message: `Value at jump > target (or end of array). Linear search from index ${prev}.`,
        found: false,
        lineNumber: 4
    };

    while (array[prev] < target) {
        prev++;
         yield {
            array: [...array],
            indices: [prev],
            message: `Checking ${array[prev]}...`,
            found: false,
            lineNumber: 5
        };

        if (prev === Math.min(step, n)) {
             yield {
                array: [...array],
                indices: [],
                message: `Reached next block without finding target.`,
                found: false,
                lineNumber: 6
            };
            return;
        }
    }

    if (array[prev] === target) {
         yield {
            array: [...array],
            indices: [prev],
            message: `Found ${target} at index ${prev}!`,
            found: true,
            lineNumber: 7
        };
        return;
    }

    yield {
        array: [...array],
        indices: [],
        message: `Target ${target} not found.`,
        found: false,
        lineNumber: 8
    };
}
