
export type HeapStep = {
    array: number[];
    treeNodes: { id: string, value: string, leftId?: string, rightId?: string, highlight?: boolean, isComapring?: boolean }[];
    comparingIndices: number[];
    swappingIndices: number[];
    message: string;
    lineNumber?: number;
}

const getParentIndex = (i: number) => Math.floor((i - 1) / 2);
const getLeftChildIndex = (i: number) => 2 * i + 1;
const getRightChildIndex = (i: number) => 2 * i + 2;

// Helper to convert array to tree nodes for visualization
const arrayToTreeNodes = (arr: number[], comparing: number[] = [], swapping: number[] = []) => {
    return arr.map((val, index) => {
        const leftIdx = getLeftChildIndex(index);
        const rightIdx = getRightChildIndex(index);
        
        return {
            id: index.toString(),
            value: val.toString(),
            leftId: leftIdx < arr.length ? leftIdx.toString() : undefined,
            rightId: rightIdx < arr.length ? rightIdx.toString() : undefined,
            highlight: comparing.includes(index) || swapping.includes(index),
            isComparing: comparing.includes(index)
        };
    });
};

export function* generateHeapInsertSteps(currentArray: number[], val: number, type: 'MIN' | 'MAX'): Generator<HeapStep> {
    const arr = [...currentArray];
    arr.push(val);
    let index = arr.length - 1;

    yield {
        array: [...arr],
        treeNodes: arrayToTreeNodes(arr, [index]),
        comparingIndices: [index],
        swappingIndices: [],
        message: `Insert ${val} at end (index ${index})`,
        lineNumber: 1
    };

    // Bubble Up
    while (index > 0) {
        const parentIdx = getParentIndex(index);
        
        yield {
            array: [...arr],
            treeNodes: arrayToTreeNodes(arr, [index, parentIdx]),
            comparingIndices: [index, parentIdx],
            swappingIndices: [],
            message: `Compare with parent ${arr[parentIdx]}`,
            lineNumber: 2
        };

        const shouldSwap = type === 'MIN' ? arr[index] < arr[parentIdx] : arr[index] > arr[parentIdx];

        if (shouldSwap) {
             yield {
                array: [...arr],
                treeNodes: arrayToTreeNodes(arr, [], [index, parentIdx]),
                comparingIndices: [],
                swappingIndices: [index, parentIdx],
                message: `Swap ${arr[index]} and ${arr[parentIdx]}`,
                lineNumber: 3
            };
            
            [arr[index], arr[parentIdx]] = [arr[parentIdx], arr[index]];
            index = parentIdx;
        } else {
            yield {
                array: [...arr],
                treeNodes: arrayToTreeNodes(arr),
                comparingIndices: [],
                swappingIndices: [],
                message: `Correct position found`,
                lineNumber: 4
            };
            break;
        }
    }

    yield {
        array: [...arr],
        treeNodes: arrayToTreeNodes(arr),
        comparingIndices: [],
        swappingIndices: [],
        message: `Insertion Complete`,
        lineNumber: 5
    };
}

export function* generateHeapExtractSteps(currentArray: number[], type: 'MIN' | 'MAX'): Generator<HeapStep> {
    const arr = [...currentArray];
    if (arr.length === 0) return;

    const root = arr[0];
    const last = arr.pop();
    
    if (arr.length === 0) { // Was only 1 element
         yield {
            array: [],
            treeNodes: [],
            comparingIndices: [],
            swappingIndices: [],
            message: `Extracted ${root}. Heap is empty.`,
            lineNumber: 1
        };
        return;
    }

    // Move last to root
    arr[0] = last!;

    yield {
        array: [...arr],
        treeNodes: arrayToTreeNodes(arr, [0]),
        comparingIndices: [0],
        swappingIndices: [],
        message: `Replace root ${root} with last element ${last}`,
        lineNumber: 1
    };

    // Bubble Down
    let index = 0;
    while (true) {
        let swapIdx = index;
        const leftIdx = getLeftChildIndex(index);
        const rightIdx = getRightChildIndex(index);

        if (type === 'MIN') {
            if (leftIdx < arr.length && arr[leftIdx] < arr[swapIdx]) swapIdx = leftIdx;
            if (rightIdx < arr.length && arr[rightIdx] < arr[swapIdx]) swapIdx = rightIdx;
        } else {
            if (leftIdx < arr.length && arr[leftIdx] > arr[swapIdx]) swapIdx = leftIdx;
            if (rightIdx < arr.length && arr[rightIdx] > arr[swapIdx]) swapIdx = rightIdx;
        }

        if (swapIdx !== index) {
            yield {
                array: [...arr],
                treeNodes: arrayToTreeNodes(arr, [index, swapIdx]),
                comparingIndices: [index, swapIdx],
                swappingIndices: [],
                message: `Compare with child ${arr[swapIdx]}`,
                lineNumber: 2
            };

             yield {
                array: [...arr],
                treeNodes: arrayToTreeNodes(arr, [], [index, swapIdx]),
                comparingIndices: [],
                swappingIndices: [index, swapIdx],
                message: `Swap ${arr[index]} and ${arr[swapIdx]}`,
                lineNumber: 3
            };

            [arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]];
            index = swapIdx;
        } else {
            yield {
                array: [...arr],
                treeNodes: arrayToTreeNodes(arr),
                comparingIndices: [],
                swappingIndices: [],
                message: `Heap property restored`,
                lineNumber: 4
            };
            break;
        }
    }
}
