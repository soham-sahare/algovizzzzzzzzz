
// Types
export type StackUsingQueuesStep = {
    q1: number[];
    q2: number[];
    message: string;
    lineNumber?: number;
    highlighted?: { q1?: number[], q2?: number[] }; // indices
};

export type SlidingWindowStep = {
    array: number[];
    windowStart: number;
    windowEnd: number;
    deque: number[]; // Stores INDICES
    result: number[];
    message: string;
    lineNumber?: number;
    highlightedIndices?: number[]; // In array
    highlightedDequeIndices?: number[]; // In deque
};


// ----------------------------------------------------------------------
// 1. Stack using Queues (Push Costly)
// ----------------------------------------------------------------------
// push(x):
//  1. Enqueue x to q2
//  2. Dequeue all from q1 and enqueue to q2
//  3. Swap names of q1 and q2

export function* generateStackPushSteps(q1: number[], q2: number[], value: number): Generator<StackUsingQueuesStep> {
    // Initial state
    yield { q1: [...q1], q2: [...q2], message: `Push(${value}) started.`, lineNumber: 1 };

    // 1. Enqueue x to q2
    q2.push(value);
    yield { q1: [...q1], q2: [...q2], message: `Enqueue ${value} to Q2 (Auxiliary)`, lineNumber: 2, highlighted: { q2: [q2.length - 1] } };

    // 2. Move all from q1 to q2
    while (q1.length > 0) {
        const val = q1.shift()!;
        yield { q1: [...q1], q2: [...q2], message: `Dequeue ${val} from Q1...`, lineNumber: 3, highlighted: { q1: [0] } }; // Highlighting front of q1 ideally
        
        q2.push(val);
        yield { q1: [...q1], q2: [...q2], message: `...and Enqueue ${val} to Q2`, lineNumber: 3, highlighted: { q2: [q2.length - 1] } };
    }

    // 3. Swap - We simulate swap by just returning the new state where q1 is now q2's content
    // In actual code: temp = q1; q1 = q2; q2 = temp;
    // Here we just yield the swapped state for the visualizer to update its state
    // BUT checking visualizer page implementation: it likely maintains q1 and q2 state.
    // So we should return the final content.
    
    // We will yield a "Swap" message.
    const temp = [...q1];
    const newQ1 = [...q2];
    const newQ2 = temp; // empty

    yield { q1: newQ1, q2: newQ2, message: "Swap Q1 and Q2 names. Now Q1 has elements in LIFO order.", lineNumber: 4 };
}

export function* generateStackPopSteps(q1: number[], q2: number[]): Generator<StackUsingQueuesStep> {
     yield { q1: [...q1], q2: [...q2], message: "Pop started.", lineNumber: 5 };
     
     if(q1.length === 0) {
         yield { q1: [...q1], q2: [...q2], message: "Stack Underflow (Q1 empty)", lineNumber: 6 };
         return;
     }

     const val = q1.shift();
     yield { q1: [...q1], q2: [...q2], message: `Dequeued ${val} from Q1 (Top of Stack).`, lineNumber: 7, highlighted: { q1: [0] } };
}


// ----------------------------------------------------------------------
// 2. Sliding Window Maximum
// ----------------------------------------------------------------------

export function* generateSlidingWindowMaxSteps(nums: number[], k: number): Generator<SlidingWindowStep> {
    const n = nums.length;
    const deque: number[] = []; // indices
    const result: number[] = [];
    
    yield {
        array: nums,
        windowStart: 0,
        windowEnd: 0,
        deque: [],
        result: [],
        message: "Starting Sliding Window Maximum...",
        lineNumber: 1
    };

    for (let i = 0; i < n; i++) {
        // Step 1: Remove elements out of window from front
        // Window is [i - k + 1, i]
        const windowStart = i - k + 1;
        
        yield {
            array: nums,
            windowStart: Math.max(0, windowStart),
            windowEnd: i,
            deque: [...deque],
            result: [...result],
            message: `Processing index ${i} (Value: ${nums[i]})`,
            lineNumber: 2,
            highlightedIndices: [i]
        };

        if (deque.length > 0 && deque[0] < i - k + 1) {
            const removed = deque.shift();
            yield {
                array: nums,
                windowStart: Math.max(0, windowStart),
                windowEnd: i,
                deque: [...deque],
                result: [...result],
                message: `Index ${removed} is out of window [${i-k+1}, ${i}]. Remove from Deque Front.`,
                lineNumber: 3
            };
        }

        // Step 2: Remove smaller elements from rear
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            const popped = deque.pop();
             yield {
                array: nums,
                windowStart: Math.max(0, windowStart),
                windowEnd: i,
                deque: [...deque],
                result: [...result],
                message: `${nums[popped]} < ${nums[i]}. Remove ${nums[popped]} from Deque Rear (Useless).`,
                lineNumber: 4
            };
        }

        // Step 3: Add current
        deque.push(i);
        yield {
            array: nums,
            windowStart: Math.max(0, windowStart),
            windowEnd: i,
            deque: [...deque],
            result: [...result],
            message: `Add index ${i} to Deque Rear.`,
            lineNumber: 5
        };

        // Step 4: Result
        if (i >= k - 1) {
            const maxVal = nums[deque[0]];
            result.push(maxVal);
             yield {
                array: nums,
                windowStart: Math.max(0, windowStart),
                windowEnd: i,
                deque: [...deque],
                result: [...result],
                message: `Window size reached. Max is ${maxVal} (Deque Front). Append to result.`,
                lineNumber: 6
            };
        }
    }
    
    yield {
        array: nums,
        windowStart: n - k,
        windowEnd: n - 1,
        deque: [...deque],
        result: [...result],
        message: "Finished!",
        lineNumber: 7
    };
}
