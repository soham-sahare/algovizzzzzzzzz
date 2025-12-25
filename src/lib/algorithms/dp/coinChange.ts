
export type CoinChangeStep = {
    coins: number[];
    amount: number;
    dp: (number | null)[]; // null = infinity
    currentCoinIndex?: number;
    currentAmount?: number;
    message: string;
    description: string;
    highlightedIndices: number[]; // indices in DP array
    activeCoinIndex?: number;
    lineNumber?: number;
};

export function* generateCoinChangeSteps(coins: number[], amount: number): Generator<CoinChangeStep> {
    const dp: (number | null)[] = new Array(amount + 1).fill(null);
    dp[0] = 0; // Base case

    yield {
        coins,
        amount,
        dp: [...dp],
        message: "Initialized DP Array",
        description: "DP[0] = 0. All others = Infinity (unreachable).",
        highlightedIndices: [0]
    };

    // Iterate through coins
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        
        yield {
            coins,
            amount,
            dp: [...dp],
            activeCoinIndex: i,
            message: `Processing Coin: ${coin}`,
            description: `Trying to update DP table using coin value ${coin}.`,
            highlightedIndices: []
        };

        for (let j = coin; j <= amount; j++) {
             // If dp[j - coin] is reachable
             const prevVal = dp[j - coin];
             
             yield {
                coins,
                amount,
                dp: [...dp],
                activeCoinIndex: i,
                currentAmount: j,
                message: `Checking amount ${j}`,
                description: `Can we form ${j} using coin ${coin}? Need DP[${j} - ${coin}] = DP[${j-coin}]`,
                highlightedIndices: [j, j - coin]
            };

             if (prevVal !== null) {
                 const currentVal = dp[j];
                 const newVal = prevVal + 1;

                 if (currentVal === null || newVal < currentVal) {
                     dp[j] = newVal;
                     yield {
                        coins,
                        amount,
                        dp: [...dp],
                        activeCoinIndex: i,
                        currentAmount: j,
                        message: `Update amount ${j}!`,
                        description: `New min coins for ${j} is ${newVal} (using coin ${coin}).`,
                        highlightedIndices: [j]
                    };
                 }
             }
        }
    }

    const result = dp[amount];
    yield {
        coins,
        amount,
        dp: [...dp],
        message: "Algorithm Complete",
        description: result === null ? `Cannot form amount ${amount}.` : `Min coins needed: ${result}`,
        highlightedIndices: result !== null ? [amount] : []
    };
}
