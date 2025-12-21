
import { QueueStep } from "./arrayQueue";

export function* generateCircularEnqueueSteps(
    currentArray: (number | null)[], 
    front: number, 
    rear: number, 
    value: number, 
    capacity: number,
    size: number
): Generator<QueueStep> {
    const array = [...currentArray];
    
    yield { array, front, rear, size, highlightedIndices: [], lineNumber: 1, message: "Checking if full..." };

    if (size === capacity) {
        yield { array, front, rear, size, highlightedIndices: [], lineNumber: 2, message: "Queue Overflow! (Full)" };
        return;
    }

    if (front === -1) {
        front = 0;
        rear = 0;
        array[0] = value;
        yield {
             array, front, rear, size: 1, highlightedIndices: [0], lineNumber: 5, message: "Empty Queue: Init Front/Rear at 0" 
        };
        return;
    }

    const nextRear = (rear + 1) % capacity;
    yield {
         array, front, rear, size, highlightedIndices: [nextRear], lineNumber: 3, message: `Next Rear = (Rear + 1) % ${capacity} = ${nextRear}`
    };

    array[nextRear] = value;
    yield {
        array,
        front,
        rear: nextRear,
        size: size + 1,
        highlightedIndices: [nextRear],
        lineNumber: 4,
        message: `Enqueued ${value} at index ${nextRear}`
    };
}

export function* generateCircularDequeueSteps(
    currentArray: (number | null)[],
    front: number,
    rear: number,
    capacity: number,
    size: number
): Generator<QueueStep> {
    const array = [...currentArray];

    yield { array, front, rear, size, highlightedIndices: [], lineNumber: 1, message: "Checking if empty..." };

    if (size === 0) {
        yield { array, front, rear, size, highlightedIndices: [], lineNumber: 2, message: "Queue Underflow! (Empty)" };
        return;
    }

    const val = array[front];
    yield {
        array,
        front,
        rear,
        size,
        highlightedIndices: [front],
        lineNumber: 3,
        message: `Dequeuing ${val} from Front (${front})`
    };

    array[front] = null;
    
    if (front === rear) {
        // Last element
        yield {
            array,
            front: -1,
            rear: -1,
            size: 0,
            highlightedIndices: [],
            lineNumber: 5,
            message: "Last element removed. Resetting Front/Rear."
        };
        return;
    }

    const nextFront = (front + 1) % capacity;
    yield {
        array,
        front: nextFront,
        rear,
        size: size - 1,
        highlightedIndices: [],
        lineNumber: 4,
        message: `Front moves to (Front + 1) % ${capacity} = ${nextFront}`
    };
}
