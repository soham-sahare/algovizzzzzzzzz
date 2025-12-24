
export interface ChainingNode {
    value: number;
    highlight?: boolean;
}

export type ChainingStep = {
    buckets: ChainingNode[][];
    activeBucket?: number | null;
    activeNode?: { bucketIndex: number, nodeIndex: number };
    message: string;
    lineNumber?: number;
}

export function* generateChainingInsertSteps(
    currentBuckets: ChainingNode[][], 
    val: number, 
    tableSize: number
): Generator<ChainingStep> {
    const buckets: ChainingNode[][] = JSON.parse(JSON.stringify(currentBuckets));
    const index = val % tableSize;

    yield { 
        buckets: JSON.parse(JSON.stringify(buckets)), 
        activeBucket: index,
        message: `Hash(${val}) = ${val} % ${tableSize} = ${index}`, 
        lineNumber: 1 
    };

    // Check collision
    if (buckets[index].length > 0) {
        yield { 
            buckets: JSON.parse(JSON.stringify(buckets)), 
            activeBucket: index,
            message: `Collision at Index ${index}. Appending to list.`, 
            lineNumber: 2 
        };
    }

    buckets[index].push({ value: val });

    yield { 
        buckets: JSON.parse(JSON.stringify(buckets)), 
        activeBucket: index,
        activeNode: { bucketIndex: index, nodeIndex: buckets[index].length - 1 },
        message: `Inserted ${val} at Index ${index}`, 
        lineNumber: 3 
    };
}

export function* generateChainingDeleteSteps(
    currentBuckets: ChainingNode[][], 
    key: number, 
    tableSize: number
): Generator<ChainingStep> {
    const buckets: ChainingNode[][] = JSON.parse(JSON.stringify(currentBuckets));
    const index = key % tableSize;
    
    yield {
        buckets: JSON.parse(JSON.stringify(buckets)),
        activeBucket: index,
        message: `Calculating hash: ${key} % ${tableSize} = ${index}`,
        lineNumber: 1
    };

    const bucket = buckets[index];
    if (bucket.length === 0) {
        yield {
            buckets: JSON.parse(JSON.stringify(buckets)),
            activeBucket: index,
            message: `Bucket ${index} is empty. Key ${key} not found.`,
            lineNumber: 2
        };
        return;
    }

    let found = false;
    for (let i = 0; i < bucket.length; i++) {
        yield {
            buckets: JSON.parse(JSON.stringify(buckets)),
            activeBucket: index,
            activeNode: { bucketIndex: index, nodeIndex: i },
            message: `Checking node at index ${i}: Value ${bucket[i].value}`,
            lineNumber: 3
        };

        if (bucket[i].value === key) {
            found = true;
            bucket.splice(i, 1); // Remove
            yield {
                buckets: JSON.parse(JSON.stringify(buckets)),
                activeBucket: index,
                message: `Found key ${key}! Deleting node.`,
                lineNumber: 4
            };
            break;
        }
    }

    if (!found) {
        yield {
            buckets: JSON.parse(JSON.stringify(buckets)),
            activeBucket: index,
            message: `Key ${key} not found in bucket ${index}.`,
            lineNumber: 5
        };
    } else {
        yield {
            buckets: JSON.parse(JSON.stringify(buckets)),
            activeBucket: index,
            message: `Deletion complete.`,
            lineNumber: 6
        };
    }
}
