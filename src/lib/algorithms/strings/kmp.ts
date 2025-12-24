
export type KMPStep = {
    text: string;
    pattern: string;
    lps: number[]; // Array content
    pointers: { 
        id: string,
        stringId: string, // 'text' | 'pattern' | 'lps'
        index: number, 
        label: string, 
        color: string 
    }[];
    highlights: {
        stringId: string,
        indices: number[],
        color: string
    }[];
    message: string;
    lineNumber?: number;
}

export function* generateKMPSteps(text: string, pattern: string): Generator<KMPStep> {
    const M = pattern.length;
    const N = text.length;
    const lps: number[] = new Array(M).fill(0);

    // Phase 1: Build LPS Array
    yield { 
        text, pattern, lps: [...lps], 
        pointers: [], highlights: [], 
        message: "Step 1: Build LPS (Longest Prefix Suffix) Array", 
        lineNumber: 1 
    };

    let len = 0; // length of previous longest prefix suffix
    let i = 1;
    lps[0] = 0; // Always 0

    while (i < M) {
        yield { 
            text, pattern, lps: [...lps], 
            pointers: [
                { id: 'p-i', stringId: 'pattern', index: i, label: `i:${i}`, color: "bg-blue-500" },
                { id: 'p-len', stringId: 'pattern', index: len, label: `len:${len}`, color: "bg-purple-500" },
                { id: 'p-lps', stringId: 'lps', index: i, label: '?', color: "bg-green-500" }
            ],
            highlights: [
                { stringId: 'pattern', indices: [i, len], color: "bg-yellow-200" }
            ],
            message: `Comparing pattern[i] ('${pattern[i]}') with pattern[len] ('${pattern[len]}')`, 
            lineNumber: 2
        };

        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            yield { 
                text, pattern, lps: [...lps], 
                pointers: [
                    { id: 'p-i', stringId: 'pattern', index: i, label: `i`, color: "bg-blue-500" },
                    { id: 'p-lps', stringId: 'lps', index: i, label: `${len}`, color: "bg-green-500" }
                ],
                highlights: [{ stringId: 'lps', indices: [i], color: "bg-green-200" }],
                message: `Match! lps[${i}] = ${len}. Increment both.`, 
                lineNumber: 3
            };
            i++;
        } else {
            if (len !== 0) {
                yield { 
                    text, pattern, lps: [...lps], 
                    pointers: [{ id: 'p-len', stringId: 'pattern', index: len, label: `len`, color: "bg-purple-500" }],
                    highlights: [],
                    message: `Mismatch. Fallback len to lps[${len-1}] (${lps[len-1]})`, 
                    lineNumber: 4
                };
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                yield { 
                    text, pattern, lps: [...lps], 
                    pointers: [{ id: 'p-lps-0', stringId: 'lps', index: i, label: `0`, color: "bg-green-500" }],
                    highlights: [{ stringId: 'lps', indices: [i], color: "bg-green-200" }],
                    message: `Mismatch and len is 0. lps[${i}] = 0. Increment i.`, 
                    lineNumber: 5
                };
                i++;
            }
        }
    }

    // Phase 2: Search
    yield { 
        text, pattern, lps: [...lps], 
        pointers: [], highlights: [], 
        message: "Step 2: Search Text using LPS Array", 
        lineNumber: 6 
    };

    let ti = 0; // index for text
    let pi = 0; // index for pattern

    while (ti < N) {
        yield { 
            text, pattern, lps: [...lps], 
            pointers: [
                { id: 't-i', stringId: 'text', index: ti, label: `text`, color: "bg-blue-500" },
                { id: 'p-j', stringId: 'pattern', index: pi, label: `pat`, color: "bg-purple-500" }
            ],
            highlights: [
                { stringId: 'text', indices: [ti], color: "bg-yellow-200" },
                { stringId: 'pattern', indices: [pi], color: "bg-yellow-200" }
            ],
            message: `Compare '${text[ti]}' vs '${pattern[pi]}'`, 
            lineNumber: 7
        };

        if (pattern[pi] === text[ti]) {
            ti++;
            pi++;
            if (pi === M) {
                yield { 
                    text, pattern, lps: [...lps], 
                    pointers: [
                        { id: 'found', stringId: 'text', index: ti - pi, label: `FOUND`, color: "bg-green-600" }
                    ],
                    highlights: [
                        { stringId: 'text', indices: Array.from({length: M}, (_, k) => ti - M + k), color: "bg-green-200" }
                    ],
                    message: `Pattern found at index ${ti - pi}!`, 
                    lineNumber: 8
                };
                // Continue searching? Usually KMP finds all.
                pi = lps[pi - 1];
            }
        } else {
            if (pi !== 0) {
                 yield { 
                    text, pattern, lps: [...lps], 
                    pointers: [
                        { id: 'old-pi', stringId: 'pattern', index: pi, label: `old`, color: "bg-red-400" },
                         { id: 'next-pi', stringId: 'lps', index: pi - 1, label: `next`, color: "bg-green-500" }
                    ],
                    highlights: [],
                    message: `Mismatch. Shift pattern using LPS: pi becomes lps[${pi-1}] (${lps[pi-1]})`, 
                    lineNumber: 9
                };
                pi = lps[pi - 1];
            } else {
                 yield { 
                    text, pattern, lps: [...lps], 
                    pointers: [{ id: 'skip', stringId: 'text', index: ti, label: `skip`, color: "bg-blue-500" }],
                    highlights: [],
                    message: `Mismatch at start. Move text pointer.`, 
                    lineNumber: 10
                };
                ti++;
            }
        }
    }

    yield { 
        text, pattern, lps: [...lps], 
        pointers: [], highlights: [], 
        message: "Search Complete.", 
        lineNumber: 11
    };
}
