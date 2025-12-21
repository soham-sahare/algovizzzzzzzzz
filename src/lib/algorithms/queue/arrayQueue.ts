
export type QueueStep = {
    array: (number | null)[];
    front: number;
    rear: number;
    size: number;
    highlightedIndices: number[];
    lineNumber?: number;
    message: string;
};

export function* generateCreateQueueSteps(capacity: number): Generator<QueueStep> {
    const array = new Array(capacity).fill(null);
    yield {
        array,
        front: -1,
        rear: -1,
        size: 0,
        highlightedIndices: [],
        lineNumber: 1,
        message: `Created queue of capacity ${capacity}`
    };
}

export function* generateEnqueueSteps(
    currentArray: (number | null)[], 
    front: number, 
    rear: number, 
    value: number, 
    capacity: number
): Generator<QueueStep> {
    const array = [...currentArray];
    
    yield { array, front, rear, size: 0, highlightedIndices: [], lineNumber: 1, message: "Checking if full..." };

    // Basic Array Queue Implementation (Linear, not circular for this specific basic demo, but usually array queues should be circular to be efficient. 
    // If we do linear, once rear hits end, we can't enqueue even if front moved. 
    // Let's implement Linear first as "Basic Array Queue" to show the drawback, or Circular immediately?
    // User requested "Array-Based Queue" AND "Circular Queue". 
    // So "Array-Based queue" usually implies the naive implementation where empty pockets at start are lost.
    
    if (rear === capacity - 1) {
        yield { array, front, rear, size: 0, highlightedIndices: [], lineNumber: 2, message: "Queue Overflow! (Rear reached end)" };
        return;
    }

    if (front === -1) {
        front = 0; // Initialize front on first element
        yield { array, front, rear, size: 0, highlightedIndices: [], lineNumber: 3, message: "First element: Set front = 0" };
    }

    const newRear = rear + 1;
    yield { array, front, rear: newRear, size: 0, highlightedIndices: [newRear], lineNumber: 4, message: "Increment Rear" };

    array[newRear] = value;
    yield {
        array,
        front,
        rear: newRear,
        size: 0, 
        highlightedIndices: [newRear],
        lineNumber: 5,
        message: `Enqueued ${value} at index ${newRear}`
    };
}

export function* generateDequeueSteps(
    currentArray: (number | null)[],
    front: number,
    rear: number
): Generator<QueueStep> {
    const array = [...currentArray];
    
    yield { array, front, rear, size: 0, highlightedIndices: [], lineNumber: 1, message: "Checking if empty..." };

    if (front === -1 || front > rear) {
         yield { array, front, rear, size: 0, highlightedIndices: [], lineNumber: 2, message: "Queue Underflow! (Empty)" };
         return;
    }

    const val = array[front];
    yield {
        array,
        front,
        rear,
        size: 0,
        highlightedIndices: [front],
        lineNumber: 3,
        message: `Accessing value ${val} at Front`
    };

    array[front] = null; // Clear visually
    const newFront = front + 1;

    yield {
        array,
        front: newFront,
        rear,
        size: 0,
        highlightedIndices: [],
        lineNumber: 4,
        message: "Increment Front"
    };

    if (newFront > rear) {
        // Reset if empty
        yield {
            array,
            front: -1,
            rear: -1,
            size: 0,
            highlightedIndices: [],
            lineNumber: 5,
            message: "Queue became empty. Resetting pointers."
        };
    }
}

export function* generatePeekQueueSteps(currentArray: (number | null)[], front: number, rear: number): Generator<QueueStep> {
    yield { array: currentArray, front, rear, size: 0, highlightedIndices: [], lineNumber: 1, message: "Checking if empty..." };
    
    if (front === -1 || front > rear) {
         yield { array: currentArray, front, rear, size: 0, highlightedIndices: [], lineNumber: 2, message: "Queue is Empty" };
         return;
    }

    yield {
        array: currentArray,
        front,
        rear,
        size: 0,
        highlightedIndices: [front],
        lineNumber: 3,
        message: `Front value is ${currentArray[front]}`
    };
}
