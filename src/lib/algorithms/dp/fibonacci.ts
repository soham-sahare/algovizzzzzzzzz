
export type DPStep = {
    table: number[]; 
    activeIndices?: number[];
    highlightedIndices?: number[];
    message: string;
    lineNumber?: number;
}

export function* generateFibTabulationSteps(n: number): Generator<DPStep> {
    const dp: number[] = new Array(n + 1).fill(0);
    
    yield { 
        table: [...dp], 
        activeIndices: [], 
        message: `Initialize table size ${n + 1} with 0s.`, 
        lineNumber: 1 
    };

    // Base cases
    if (n >= 1) {
        dp[1] = 1;
        yield { 
            table: [...dp], 
            activeIndices: [1], 
            message: "Base Case: Fib(1) = 1", 
            lineNumber: 2 
        };
    }

    // Loop
    for (let i = 2; i <= n; i++) {
        yield { 
            table: [...dp], 
            activeIndices: [i], 
            highlightedIndices: [i-1, i-2],
            message: `Calculate Fib(${i}) = Fib(${i-1}) + Fib(${i-2})`, 
            lineNumber: 3 
        };

        dp[i] = dp[i-1] + dp[i-2];

        yield { 
            table: [...dp], 
            activeIndices: [i], 
            highlightedIndices: [i-1, i-2],
            message: `Fib(${i}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`, 
            lineNumber: 4 
        };
    }

    yield { 
        table: [...dp], 
        activeIndices: [], 
        message: `Result: Fib(${n}) = ${dp[n]}`, 
        lineNumber: 5 
    };
}
