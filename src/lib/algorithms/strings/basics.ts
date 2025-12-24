
export type StringStep = {
    chars: string[];
    pointers: { index: number, label: string, color: string }[];
    highlights: number[];
    message: string;
    lineNumber?: number;
    isValid?: boolean; // For palindrome result
}

export function* generateReverseSteps(input: string): Generator<StringStep> {
    const chars = input.split('');
    let left = 0;
    let right = chars.length - 1;

    yield { 
        chars: [...chars], 
        pointers: [
            { index: left, label: "L", color: "bg-blue-500" },
            { index: right, label: "R", color: "bg-purple-500" }
        ],
        highlights: [],
        message: "Start: Left at 0, Right at end.", 
        lineNumber: 1 
    };

    while (left < right) {
        yield { 
            chars: [...chars], 
            pointers: [
                { index: left, label: "L", color: "bg-blue-500" },
                { index: right, label: "R", color: "bg-purple-500" }
            ],
            highlights: [left, right],
            message: `Swapping ${chars[left]} and ${chars[right]}`, 
            lineNumber: 3 
        };

        const temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;

        left++;
        right--;

        yield { 
            chars: [...chars], 
            pointers: [
                { index: left, label: "L", color: "bg-blue-500" },
                { index: right, label: "R", color: "bg-purple-500" }
            ],
            highlights: [], // Clear highlight after swap
            message: "Swapped! Moving pointers inward.", 
            lineNumber: 4 
        };
    }

    yield { 
        chars: [...chars], 
        pointers: [],
        highlights: [],
        message: "Reversal Complete.", 
        lineNumber: 5 
    };
}

export function* generatePalindromeSteps(input: string): Generator<StringStep> {
    const chars = input.split('');
    let left = 0;
    let right = chars.length - 1;

    yield { 
        chars: [...chars], 
        pointers: [
            { index: left, label: "L", color: "bg-blue-500" },
            { index: right, label: "R", color: "bg-purple-500" }
        ],
        highlights: [],
        message: "Start: Left at 0, Right at end.", 
        lineNumber: 1 
    };

    while (left < right) {
        yield { 
            chars: [...chars], 
            pointers: [
                { index: left, label: "L", color: "bg-blue-500" },
                { index: right, label: "R", color: "bg-purple-500" }
            ],
            highlights: [left, right],
            message: `Comparing ${chars[left]} vs ${chars[right]}`, 
            lineNumber: 3 
        };

        if (chars[left] !== chars[right]) {
            yield { 
                chars: [...chars], 
                pointers: [
                    { index: left, label: "L", color: "bg-blue-500" },
                    { index: right, label: "R", color: "bg-purple-500" }
                ],
                highlights: [left, right],
                isValid: false,
                message: `Mismatch! '${chars[left]}' != '${chars[right]}'. Not a palindrome.`, 
                lineNumber: 6 
            };
            return;
        }

        left++;
        right--;

        yield { 
            chars: [...chars], 
            pointers: [
                { index: left, label: "L", color: "bg-blue-500" },
                { index: right, label: "R", color: "bg-purple-500" }
            ],
            highlights: [],
            message: "Match! Moving pointers inward.", 
            lineNumber: 4 
        };
    }

    yield { 
        chars: [...chars], 
        pointers: [],
        highlights: [],
        isValid: true,
        message: "All checks passed. It IS a palindrome!", 
        lineNumber: 7 
    };
}
