
export type LISStep = {
    array: number[];
    dp: number[]; // Length of LIS ending at index i
    prev: (number | null)[]; // For reconstructing path
    currentIndex: number;
    compareIndex?: number;
    message: string;
    description: string;
    activeIndices: number[];
    highlightedIndices: number[]; // Typically elements part of current LIS candidate
    lineNumber?: number;
    lisPath?: number[]; // indices of final LIS
};

export function* generateLISSteps(nums: number[]): Generator<LISStep> {
    const n = nums.length;
    if (n === 0) return;

    const dp = new Array(n).fill(1);
    const prev = new Array(n).fill(null);

    yield {
        array: nums,
        dp: [...dp],
        prev: [...prev],
        currentIndex: -1,
        message: "Starting LIS Algorithm",
        description: "Initialize DP array with 1 (each element is LIS of length 1).",
        activeIndices: [],
        highlightedIndices: []
    };

    for (let i = 0; i < n; i++) {
        yield {
            array: nums,
            dp: [...dp],
            prev: [...prev],
            currentIndex: i,
            message: `Processing index ${i} (Value: ${nums[i]})`,
            description: "Looking for predecessors smaller than current value.",
            activeIndices: [i],
            highlightedIndices: []
        };

        for (let j = 0; j < i; j++) {
            yield {
                array: nums,
                dp: [...dp],
                prev: [...prev],
                currentIndex: i,
                compareIndex: j,
                message: `Comparing with index ${j} (Value: ${nums[j]})`,
                description: `Checking if ${nums[j]} < ${nums[i]} and if extending path increases length.`,
                activeIndices: [i, j],
                highlightedIndices: []
            };

            if (nums[j] < nums[i]) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    prev[i] = j;
                    
                    yield {
                        array: nums,
                        dp: [...dp],
                        prev: [...prev],
                        currentIndex: i,
                        compareIndex: j,
                        message: `Found extension! New LIS length at ${i} is ${dp[i]}`,
                        description: `${nums[j]} < ${nums[i]}. Updating DP[${i}] = DP[${j}] + 1.`,
                        activeIndices: [i, j],
                        highlightedIndices: [j] // Highlight predecessor
                    };
                }
            }
        }
    }

    // Find max length and reconstruct path
    let maxLen = 0;
    let maxIdx = 0;
    for(let i=0; i<n; i++) {
        if (dp[i] > maxLen) {
            maxLen = dp[i];
            maxIdx = i;
        }
    }

    const path: number[] = [];
    let curr = maxIdx;
    while(curr !== null && curr !== undefined && curr >= 0) { // Safety check
        path.unshift(curr);
        curr = prev[curr];
    }

    yield {
        array: nums,
        dp: [...dp],
        prev: [...prev],
        currentIndex: n,
        message: `Algorithm Complete. Max LIS Length: ${maxLen}`,
        description: "Reconstructed the longest path.",
        activeIndices: [],
        highlightedIndices: path,
        lisPath: path
    };
}
