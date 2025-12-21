
import { QueueStep } from "./arrayQueue";

export function* generateAddFrontSteps(
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
        yield { array, front, rear, size, highlightedIndices: [], lineNumber: 2, message: "Deque Overflow! (Full)" };
        return;
    }

    if (front === -1) {
        front = 0; 
        rear = 0;
        array[0] = value;
        yield { array, front, rear, size: 1, highlightedIndices: [0], lineNumber: 5, message: "Empty: Init Front/Rear at 0" };
        return;
    }

    // Decrement Front circularly
    // if front = 0, newFront = capacity - 1
    const nextFront = (front - 1 + capacity) % capacity;
    yield {
         array, front, rear, size, highlightedIndices: [nextFront], lineNumber: 3, message: `New Front = (Front - 1 + Cap) % Cap = ${nextFront}`
    };

    array[nextFront] = value;
    yield {
        array,
        front: nextFront,
        rear,
        size: size + 1,
        highlightedIndices: [nextFront],
        lineNumber: 4,
        message: `Added ${value} at Front (${nextFront})`
    };
}

export function* generateAddRearSteps(
    currentArray: (number | null)[], 
    front: number, 
    rear: number, 
    value: number, 
    capacity: number,
    size: number
): Generator<QueueStep> {
    // Same as Circular Queue Enqueue
    const array = [...currentArray];
    
    yield { array, front, rear, size, highlightedIndices: [], lineNumber: 1, message: "Checking if full..." };

    if (size === capacity) {
        yield { array, front, rear, size, highlightedIndices: [], lineNumber: 2, message: "Deque Overflow! (Full)" };
        return;
    }

    if (front === -1) {
        front = 0; rear = 0;
        array[0] = value;
        yield { array, front, rear, size: 1, highlightedIndices: [0], lineNumber: 5, message: "Empty: Init Front/Rear at 0" };
        return;
    }

    const nextRear = (rear + 1) % capacity;
    yield {
         array, front, rear, size, highlightedIndices: [nextRear], lineNumber: 3, message: `Nea Rear = (Rear + 1) % Cap = ${nextRear}`
    };

    array[nextRear] = value;
    yield {
        array,
        front,
        rear: nextRear,
        size: size + 1,
        highlightedIndices: [nextRear],
        lineNumber: 4,
        message: `Added ${value} at Rear (${nextRear})`
    };
}

export function* generateRemoveFrontSteps(
    currentArray: (number | null)[],
    front: number,
    rear: number,
    capacity: number,
    size: number
): Generator<QueueStep> {
    // Same as Circular Queue Dequeue
    const array = [...currentArray];

    yield { array, front, rear, size, highlightedIndices: [], lineNumber: 1, message: "Checking if empty..." };

    if (size === 0) {
        yield { array, front, rear, size, highlightedIndices: [], lineNumber: 2, message: "Deque Underflow! (Empty)" };
        return;
    }

    const val = array[front];
    yield { array, front, rear, size, highlightedIndices: [front], lineNumber: 3, message: `Removing ${val} from Front` };

    array[front] = null;
    
    if (front === rear) {
        yield { array, front: -1, rear: -1, size: 0, highlightedIndices: [], lineNumber: 5, message: "Last element removed. Reset." };
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
        message: `Front moves forward to ${nextFront}`
    };
}

export function* generateRemoveRearSteps(
    currentArray: (number | null)[],
    front: number,
    rear: number,
    capacity: number,
    size: number
): Generator<QueueStep> {
    const array = [...currentArray];

    yield { array, front, rear, size, highlightedIndices: [], lineNumber: 1, message: "Checking if empty..." };

    if (size === 0) {
        yield { array, front, rear, size, highlightedIndices: [], lineNumber: 2, message: "Deque Underflow! (Empty)" };
        return;
    }

    const val = array[rear];
    yield { array, front, rear, size, highlightedIndices: [rear], lineNumber: 3, message: `Removing ${val} from Rear` };

    array[rear] = null;
    
    if (front === rear) {
        yield { array, front: -1, rear: -1, size: 0, highlightedIndices: [], lineNumber: 5, message: "Last element removed. Reset." };
        return;
    }

    // Decrement Rear Circularly
    const nextRear = (rear - 1 + capacity) % capacity;
    yield {
        array,
        front,
        rear: nextRear,
        size: size - 1,
        highlightedIndices: [],
        lineNumber: 4,
        message: `Rear moves backward to ${nextRear}`
    };
}
