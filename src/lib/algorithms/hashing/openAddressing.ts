
export type ProbingStep = {
    array: number[]; // -1: empty, -2: deleted/tombstone, >=0: value
    activeIndex?: number;
    probingIndex?: number;
    attemptCount?: number;
    message: string;
    lineNumber?: number;
}

export function* generateProbingInsertSteps(
    currentArray: number[], 
    val: number,
    tableSize: number
): Generator<ProbingStep> {
    const array = [...currentArray];
    let index = val % tableSize;
    let attempts = 0;

    yield { 
        array: [...array], 
        activeIndex: undefined,
        probingIndex: index,
        message: `Hash(${val}) = ${val} % ${tableSize} = ${index}`, 
        lineNumber: 1 
    };

    while (attempts < tableSize) {
        // -1 is empty, -2 is deleted (tombstone) - treat both as available for INSERT
        if (array[index] === -1 || array[index] === -2) {
            array[index] = val;
                yield { 
                array: [...array], 
                activeIndex: index,
                probingIndex: index,
                message: `Found slot at ${index}. Insert ${val}.`, 
                lineNumber: 4 
            };
            return;
        } else {
                yield { 
                array: [...array], 
                activeIndex: index, // Occupied
                probingIndex: index,
                message: `Index ${index} occupied by ${array[index]}. Probe next...`, 
                lineNumber: 6 
            };
            index = (index + 1) % tableSize;
            attempts++;
        }
    }

    yield { 
        array: [...array], 
        message: `Table Full! Could not insert ${val}.`, 
        lineNumber: 7 
    };
}

export function* generateProbingDeleteSteps(
    currentArray: number[],
    val: number,
    tableSize: number
): Generator<ProbingStep> {
    const array = [...currentArray];
    let index = val % tableSize;
    let attempts = 0;

    yield { 
        array: [...array], 
        activeIndex: undefined,
        probingIndex: index,
        message: `Hash(${val}) = ${index} for deletion search`, 
        lineNumber: 1 
    };

    while (attempts < tableSize) {
        if (array[index] === -1) {
            // Empty slot means not found (tombstones don't stop search)
            yield {
                array: [...array],
                probingIndex: index,
                message: `Slot ${index} is empty (-1). Key ${val} not found.`,
                lineNumber: 2
            };
            return;
        } else if (array[index] === val) {
            // Found
            array[index] = -2; // Mark as Deleted (Tombstone)
            yield {
                array: [...array],
                activeIndex: index,
                probingIndex: index,
                message: `Found ${val} at ${index}. Marked as Deleted (-2).`,
                lineNumber: 3
            };
            return;
        } else {
             // Occupied or Tombstone (-2), continue
             yield {
                array: [...array],
                probingIndex: index,
                message: `Slot ${index} has ${array[index]}. Continue search...`,
                lineNumber: 4
            };
            index = (index + 1) % tableSize;
            attempts++;
        }
    }

    yield {
        array: [...array],
        message: `Traversed entire table. Key ${val} not found.`,
        lineNumber: 5
    };
}

// Backward compatibility or multiple ops wrapper if needed, 
// but we only need specialized steps now.
// We can remove the old generic one or keep it as alias to insert if legacy code uses it.
export const generateProbingSteps = generateProbingInsertSteps;
