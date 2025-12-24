
export type BitStep = {
    rows: { id: string, label: string, value: number, highlightIndices?: number[], color?: string }[];
    message: string;
    lineNumber?: number;
}

export function* generateBitwiseSteps(a: number, b: number, op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT'): Generator<BitStep> {
    const len = 8; // visualize 8 bits for simplicity

    if (op === 'NOT') {
        const result = (~a) & 0xFF; // Keep to 8 bits unsigned equivalent for display
        
        yield {
            rows: [
                { id: 'a', label: 'Input', value: a, highlightIndices: [] }
            ],
            message: `NOT Operation on ${a} (Inverting bits)`,
            lineNumber: 1
        };

        for (let i = 0; i < len; i++) {
             yield {
                rows: [
                    { id: 'a', label: 'Input', value: a, highlightIndices: [i] },
                    { id: 'res', label: 'Result', value: ((~a) & ((1 << (i + 1)) - 1)) >>> 0, highlightIndices: [i], color: "bg-green-100 border-green-500 text-green-700" }
                ],
                message: `Invert bit ${i}: ${((a >> i) & 1)} -> ${(((~a) >> i) & 1)}`,
                lineNumber: 2
            };
        }
        
         yield {
            rows: [
                { id: 'a', label: 'Input', value: a },
                { id: 'res', label: 'Result', value: result, color: "bg-green-100 border-green-500 text-green-700" }
            ],
            message: `Result: ${result}`,
            lineNumber: 3
        };
        return;
    }

    if (op === 'LSHIFT' || op === 'RSHIFT') {
        const shiftAmt = b; // b is shift amount
        const result = op === 'LSHIFT' ? (a << shiftAmt) : (a >> shiftAmt);
        
        yield {
           rows: [
               { id: 'a', label: 'Input', value: a, highlightIndices: [] }
           ],
           message: `${op === 'LSHIFT' ? 'Left' : 'Right'} Shift by ${shiftAmt}`,
           lineNumber: 1
       };
       
       yield {
           rows: [
               { id: 'a', label: 'Input', value: a },
               { id: 'res', label: 'Result', value: result, color: "bg-green-100 border-green-500 text-green-700" }
           ],
           message: `Result: ${result}. Bits shifted.`,
           lineNumber: 2
       };
       return;
    }

    // Binary Operators: AND, OR, XOR
    let result = 0;
    if (op === 'AND') result = a & b;
    if (op === 'OR') result = a | b;
    if (op === 'XOR') result = a ^ b;

    yield {
        rows: [
            { id: 'a', label: 'A', value: a },
            { id: 'b', label: 'B', value: b }
        ],
        message: `${op} Operation: ${a} ${getMessageOp(op)} ${b}`,
        lineNumber: 1
    };

    let currentRes = 0;
    for (let i = 0; i < len; i++) {
        const bitA = (a >> i) & 1;
        const bitB = (b >> i) & 1;
        let bitRes = 0;
        
        if (op === 'AND') bitRes = bitA & bitB;
        if (op === 'OR') bitRes = bitA | bitB;
        if (op === 'XOR') bitRes = bitA ^ bitB;

        if (bitRes) {
            currentRes |= (1 << i);
        }

        yield {
            rows: [
                { id: 'a', label: 'A', value: a, highlightIndices: [i] },
                { id: 'b', label: 'B', value: b, highlightIndices: [i] },
                { id: 'res', label: 'Result', value: currentRes, highlightIndices: [i], color: "bg-green-100 border-green-500 text-green-700" }
            ],
            message: `Bit ${i}: ${bitA} ${getMessageOp(op)} ${bitB} = ${bitRes}`,
            lineNumber: 2
        };
    }

    yield {
        rows: [
            { id: 'a', label: 'A', value: a },
            { id: 'b', label: 'B', value: b },
            { id: 'res', label: 'Result', value: result, color: "bg-green-100 border-green-500 text-green-700" }
        ],
        message: `Final Result: ${result}`,
        lineNumber: 3
    };
}


export function* generateCountSetBitsSteps(n: number): Generator<BitStep> {
    let count = 0;
    let currentN = n;
    
    yield {
        rows: [{ id: 'n', label: 'N', value: currentN }],
        message: `Start: Counting set bits in ${currentN}`,
        lineNumber: 1
    };

    while (currentN > 0) {
        yield {
            rows: [{ id: 'n', label: 'N', value: currentN, color: "bg-blue-100 border-blue-500 text-blue-700" }],
            message: `Current N: ${currentN}. Value > 0, so entering loop.`,
            lineNumber: 2
        };

        const nextN = currentN & (currentN - 1);
        
        yield {
             rows: [
                { id: 'n', label: 'N', value: currentN },
                { id: 'n-1', label: 'N - 1', value: currentN - 1 },
                { id: 'res', label: 'N & (N-1)', value: nextN, color: "bg-green-100 border-green-500 text-green-700" }
            ],
            message: `Operation: n = n & (n-1). Clears the rightmost set bit.`,
            lineNumber: 3
        };

        currentN = nextN;
        count++;

        yield {
             rows: [{ id: 'n', label: 'N', value: currentN }],
             message: `N becomes ${currentN}. Count is now ${count}.`,
             lineNumber: 4
        };
    }

    yield {
        rows: [{ id: 'n', label: 'Final N', value: 0 }],
        message: `N is 0. Total set bits: ${count}`,
        lineNumber: 5
    };
}

export function* generatePowerOfTwoSteps(n: number): Generator<BitStep> {
    yield {
        rows: [{ id: 'n', label: 'N', value: n }],
        message: `Checking if ${n} is a Power of Two.`,
        lineNumber: 1
    };

    if (n <= 0) {
         yield {
            rows: [{ id: 'n', label: 'N', value: n }],
            message: `N <= 0. Not a power of two. Return False.`,
            lineNumber: 2
        };
        return;
    }

    const nMinus1 = n - 1;
    const result = n & nMinus1;

    yield {
        rows: [
            { id: 'n', label: 'N', value: n },
            { id: 'n-1', label: 'N - 1', value: nMinus1 }
        ],
        message: `Calculate N & (N-1).`,
        lineNumber: 3
    };

    if (result === 0) {
         yield {
            rows: [
                { id: 'n', label: 'N', value: n },
                { id: 'n-1', label: 'N - 1', value: nMinus1 },
                { id: 'res', label: 'Result', value: result, color: "bg-green-100 border-green-500 text-green-700" }
            ],
            message: `Result is 0! It implies only one bit was set. Return True.`,
            lineNumber: 4
        };
    } else {
         yield {
            rows: [
                { id: 'n', label: 'N', value: n },
                { id: 'n-1', label: 'N - 1', value: nMinus1 },
                { id: 'res', label: 'Result', value: result, color: "bg-red-100 border-red-500 text-red-700" }
            ],
            message: `Result is ${result} (!= 0). More than one bit set. Return False.`,
            lineNumber: 5
        };
    }
}

