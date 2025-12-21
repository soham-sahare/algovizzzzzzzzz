
import { StackStep } from "./arrayStack";

// Simplified Stack Step for generic items (strings/numbers)
// We will use a string array to represent the stack for broad compatibility
export type GenericStackStep<T> = {
    stack: T[];
    highlightedIndices: number[]; // Indices in the stack to highlight
    inputValue?: string | number; // Current input being processed (e.g. char in string)
    inputIndex?: number; // Index in the input string/array
    message: string;
    lineNumber?: number;
    output?: string | number; // For reverse string or NGE output
};

// ----------------------------------------------------------------------
// 1. Balanced Parentheses
// ----------------------------------------------------------------------

export function* generateBalancedParenthesesSteps(input: string): Generator<GenericStackStep<string>> {
    const stack: string[] = [];
    
    yield {
        stack: [],
        highlightedIndices: [],
        inputValue: "",
        inputIndex: -1,
        lineNumber: 1,
        message: "Starting check..."
    };

    const map: { [key: string]: string } = { ')': '(', '}': '{', ']': '[' };

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        yield {
            stack: [...stack],
            highlightedIndices: [],
            inputValue: char,
            inputIndex: i,
            lineNumber: 2,
            message: `Processing '${char}'`
        };

        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
            yield {
                stack: [...stack],
                highlightedIndices: [stack.length - 1],
                inputValue: char,
                inputIndex: i,
                lineNumber: 3,
                message: `Pushing '${char}' to stack`
            };
        } else {
            // Closing bracket
            if (stack.length === 0) {
                 yield {
                    stack: [...stack],
                    highlightedIndices: [],
                    inputValue: char,
                    inputIndex: i,
                    lineNumber: 4,
                    message: "Stack empty! Unbalanced."
                };
                return; // Unbalanced
            }

            const top = stack[stack.length - 1];
            yield {
                stack: [...stack],
                highlightedIndices: [stack.length - 1],
                inputValue: char,
                inputIndex: i,
                lineNumber: 5,
                message: `Checking top '${top}' against '${char}'`
            };

            if (top === map[char]) {
                stack.pop();
                yield {
                    stack: [...stack],
                    highlightedIndices: [],
                    inputValue: char,
                    inputIndex: i,
                    lineNumber: 6,
                    message: "Match found! Popping."
                };
            } else {
                 yield {
                    stack: [...stack],
                    highlightedIndices: [stack.length - 1],
                    inputValue: char,
                    inputIndex: i,
                    lineNumber: 7,
                    message: `Mismatch! '${top}' != '${map[char]}'. Unbalanced.`
                };
                return;
            }
        }
    }

    if (stack.length === 0) {
        yield { stack: [], highlightedIndices: [], message: "Stack is empty. Balanced!", lineNumber: 8 };
    } else {
        yield { stack: [...stack], highlightedIndices: [], message: "Stack not empty. Unbalanced.", lineNumber: 8 };
    }
}


// ----------------------------------------------------------------------
// 2. Reverse String
// ----------------------------------------------------------------------

export function* generateReverseStringSteps(input: string): Generator<GenericStackStep<string>> {
    const stack: string[] = [];
    let output = "";

    yield { stack: [], highlightedIndices: [], message: "Start reversing...", inputIndex: -1, lineNumber: 1 };

    // Phase 1: Push
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        stack.push(char);
        yield {
            stack: [...stack],
            highlightedIndices: [stack.length - 1],
            inputValue: char,
            inputIndex: i,
            output,
            lineNumber: 2,
            message: `Pushing '${char}'`
        };
    }

    // Phase 2: Pop
    yield { stack: [...stack], highlightedIndices: [], message: "All pushed. Now Popping...", lineNumber: 3 };

    while (stack.length > 0) {
        const char = stack.pop()!; // Non-null assertion safe due to loop condition
        output += char;
        yield {
            stack: [...stack],
            highlightedIndices: [], // Top was just removed
            output,
            inputValue: char,
            lineNumber: 4,
            message: `Popped '${char}', append to output.`
        };
    }
    
    yield { stack: [], highlightedIndices: [], output, message: "Reversal Complete!", lineNumber: 5 };
}

// ----------------------------------------------------------------------
// 3. Next Greater Element
// ----------------------------------------------------------------------

// We'll visualize NGE for each element in an array
// Input: [4, 5, 2, 25]
// Output: [5, 25, 25, -1]
export function* generateNextGreaterElementSteps(input: number[]): Generator<GenericStackStep<number>> {
    const stack: number[] = []; // Stores INDICES
    const result = new Array(input.length).fill(-1);
    
    yield { stack: [], highlightedIndices: [], message: "Starting NGE...", lineNumber: 1 };

    for (let i = 0; i < input.length; i++) {
        const currentVal = input[i];
        
        yield {
            stack: [...stack], // Visualize indices or values? Let's verify.
                               // Usually visualization is better with values, but stack needs indices to update result.
                               // For visuals, we can map indices to values in the UI if needed, but let's store INDICES in stack here 
                               // and let UI map them to values for display if it wants, 
                               // OR we just store values in a simple logic stack if duplicates don't matter much for basic NGE.
                               // Best practice: Store indices.
            highlightedIndices: [],
            inputValue: currentVal,
            inputIndex: i,
            lineNumber: 2,
            message: `Current element: ${currentVal}`
        };

        while (stack.length > 0 && input[stack[stack.length - 1]] < currentVal) {
             const topIndex = stack[stack.length - 1];
             const topVal = input[topIndex];
             
             yield {
                stack: [...stack],
                highlightedIndices: [stack.length - 1],
                inputValue: currentVal,
                inputIndex: i,
                lineNumber: 3,
                message: `${currentVal} > ${topVal} (Top). Found NGE for ${topVal}!`
            };
            
            result[topIndex] = currentVal;
            stack.pop();

             yield {
                stack: [...stack],
                highlightedIndices: [],
                inputValue: currentVal,
                inputIndex: i,
                lineNumber: 4,
                message: "Popped index. Checking next top..."
            };
        }
        
        stack.push(i);
        yield {
            stack: [...stack],
            highlightedIndices: [stack.length - 1],
            inputValue: currentVal,
            inputIndex: i,
            lineNumber: 5,
            message: `Pushed index of ${currentVal} to stack.`
        };
    }
    
    yield { stack: [...stack], highlightedIndices: [], message: "Done. Remaining items have no NGE (-1).", lineNumber: 6 };
}
