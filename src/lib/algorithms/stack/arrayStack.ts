
export type StackStep = {
    array: (number | null)[];
    top: number;
    highlightedIndices: number[];
    lineNumber?: number;
    message: string;
};

export function* generateCreateStackSteps(size: number): Generator<StackStep> {
    const array = new Array(size).fill(null);
    yield {
        array,
        top: -1,
        highlightedIndices: [],
        lineNumber: 1,
        message: `Created stack of size ${size}`
    };
}

export function* generatePushSteps(currentArray: (number | null)[], currentTop: number, value: number, maxSize: number): Generator<StackStep> {
    const array = [...currentArray];
    
    // Check overflow
    yield { array, top: currentTop, highlightedIndices: [], lineNumber: 1, message: "Checking if full..." };
    
    if (currentTop === maxSize - 1) {
        yield { array, top: currentTop, highlightedIndices: [], lineNumber: 2, message: "Stack Overflow!" };
        return;
    }

    // top++
    const newTop = currentTop + 1;
    yield { array, top: newTop, highlightedIndices: [], lineNumber: 3, message: "Incrementing Top" };

    // stack[top] = val
    array[newTop] = value;
    yield {
        array,
        top: newTop,
        highlightedIndices: [newTop],
        lineNumber: 4,
        message: `Inserted ${value} at index ${newTop}`
    };
}

export function* generatePopSteps(currentArray: (number | null)[], currentTop: number): Generator<StackStep> {
    const array = [...currentArray];

    // Check underflow
    yield { array, top: currentTop, highlightedIndices: [], lineNumber: 1, message: "Checking if empty..." };

    if (currentTop === -1) {
         yield { array, top: currentTop, highlightedIndices: [], lineNumber: 2, message: "Stack Underflow!" };
         return;
    }

    // val = stack[top]
    const val = array[currentTop];
    yield { 
        array, 
        top: currentTop, 
        highlightedIndices: [currentTop], 
        lineNumber: 3, 
        message: `Accessing value ${val}` 
    };

    // For visualization, we might want to clear the value or just move pointer.
    // Clearing it makes it clearer it's gone from the "active" stack.
    array[currentTop] = null; 

    // top--
    const newTop = currentTop - 1;
    yield {
        array,
        top: newTop,
        highlightedIndices: [],
        lineNumber: 4,
        message: "Decrementing Top"
    };
    
    yield {
        array,
        top: newTop,
        highlightedIndices: [],
        lineNumber: 5,
        message: `Returned ${val}`
    };
}

export function* generatePeekSteps(currentArray: (number | null)[], currentTop: number): Generator<StackStep> {
    const array = [...currentArray];
    
    yield { array, top: currentTop, highlightedIndices: [], lineNumber: 1, message: "Checking if empty..." };

    if (currentTop === -1) {
         yield { array, top: currentTop, highlightedIndices: [], lineNumber: 2, message: "Stack is Empty." };
         return;
    }

    yield {
        array,
        top: currentTop,
        highlightedIndices: [currentTop],
        lineNumber: 3,
        message: `Top value is ${array[currentTop]}`
    };
}

export function* generateIsEmptySteps(currentTop: number, currentArray: (number | null)[]): Generator<StackStep> {
    yield { 
        array: currentArray, 
        top: currentTop, 
        highlightedIndices: [], 
        lineNumber: 1, 
        message: `Checking if top == -1` 
    };
    
    const isEmpty = currentTop === -1;
    yield { 
        array: currentArray, 
        top: currentTop, 
        highlightedIndices: [], 
        lineNumber: 1, 
        message: `Result: ${isEmpty}` 
    };
}

export function* generateIsFullSteps(currentTop: number, maxSize: number, currentArray: (number | null)[]): Generator<StackStep> {
    yield { 
         array: currentArray,
         top: currentTop, 
         highlightedIndices: [], 
         lineNumber: 1, 
         message: `Checking if top == ${maxSize - 1}` 
    };
    
    const isFull = currentTop === maxSize - 1;
    yield { 
         array: currentArray, 
         top: currentTop, 
         highlightedIndices: [], 
         lineNumber: 1, 
         message: `Result: ${isFull}` 
    };
}

export function* generateGetSizeSteps(currentTop: number, currentArray: (number | null)[]): Generator<StackStep> {
    // size = top + 1
    yield {
        array: currentArray,
        top: currentTop,
        highlightedIndices: [],
        lineNumber: 1,
        message: `Size = top + 1`
    };
    
    yield {
        array: currentArray,
        top: currentTop,
        highlightedIndices: [],
        lineNumber: 1,
        message: `Size is ${currentTop + 1}`
    };
}
