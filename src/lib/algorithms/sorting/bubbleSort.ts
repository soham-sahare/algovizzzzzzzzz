export type SortingStep = {
    array: number[];
    comparing: number[];
    swapping: number[];
    sorted: number[];
    lineNumber?: number;
};

export function* generateBubbleSortSteps(initialArray: number[]): Generator<SortingStep> {
    const arr = [...initialArray];
    const n = arr.length;
    const sorted: number[] = [];

    for (let i = 0; i < n; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            // Compare j and j+1
            yield {
                array: [...arr],
                comparing: [j, j + 1],
                swapping: [],
                sorted: [...sorted],
                lineNumber: 3 // if (arr[j] > arr[j + 1])
            };

            if (arr[j] > arr[j + 1]) {
                // Swap start
                yield {
                    array: [...arr],
                    comparing: [],
                    swapping: [j, j + 1],
                    sorted: [...sorted],
                    lineNumber: 4 // swap(arr[j], arr[j+1])
                };

                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;

                // After swap
                yield {
                    array: [...arr],
                    comparing: [],
                    swapping: [j, j + 1],
                    sorted: [...sorted],
                    lineNumber: 4 // Still swapping visual
                };
            }
        }

        // Element at n-i-1 is sorted
        sorted.push(n - i - 1);
        yield {
             array: [...arr],
             comparing: [],
             swapping: [],
             sorted: [...sorted],
             lineNumber: 1 // Outer loop continuation / checking condition
        };

        if (!swapped) {
            // Optimization: Array is sorted
            const remainingSorted = [];
            for (let k = 0; k < n - i - 1; k++) remainingSorted.push(k);
            sorted.push(...remainingSorted);
             yield {
                array: [...arr],
                comparing: [],
                swapping: [],
                sorted: [...sorted],
                lineNumber: 7 // return / break
            };
            break;
        }
    }
    
    // Ensure all are marked sorted at the end
    const finalSorted = Array.from({ length: n }, (_, i) => i);
    yield {
         array: [...arr],
         comparing: [],
         swapping: [],
         sorted: finalSorted,
         lineNumber: 7 // Done
    };
}
