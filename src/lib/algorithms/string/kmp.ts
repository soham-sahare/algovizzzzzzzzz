
import { StringSearchStep } from "./rabinKarp";

export type KMPStep = StringSearchStep & {
    lps?: number[]; // Longest Prefix Suffix array state
    lpsIndex?: number; // current index in pattern while building LPS or searching
}

export function* generateKMPSteps(text: string, pattern: string): Generator<KMPStep> {
    const n = text.length;
    const m = pattern.length;

    if (m === 0) return;
    
    // Step 1: Build LPS Array
    const lps = new Array(m).fill(0);
    let len = 0; // length of previous longest prefix suffix
    let i = 1;

    yield {
        text, pattern, currentIndex: 0, comparing: false, 
        lps: [...lps],
        message: "Building LPS (Longest Prefix Suffix) Array...",
        found: false, lineNumber: 1
    };

    while (i < m) {
        yield {
             text, pattern, currentIndex: 0, comparing: false, 
             lps: [...lps], lpsIndex: i,
             message: `LPS at ${i}: Comparing pattern[${i}] (${pattern[i]}) with pattern[${len}] (${pattern[len]})`,
             found: false, lineNumber: 2
        };

        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
             yield {
                 text, pattern, currentIndex: 0, comparing: false, 
                 lps: [...lps], lpsIndex: i,
                 message: `Match! LPS[${i}] = ${len}`,
                 found: false, lineNumber: 3
            };
            i++;
        } else {
             if (len !== 0) {
                 len = lps[len - 1];
                  yield {
                     text, pattern, currentIndex: 0, comparing: false, 
                     lps: [...lps], lpsIndex: i,
                     message: `Mismatch. Fallback len to LPS[${len-1}] = ${len}`,
                     found: false, lineNumber: 4
                };
             } else {
                 lps[i] = 0;
                  yield {
                     text, pattern, currentIndex: 0, comparing: false, 
                     lps: [...lps], lpsIndex: i,
                     message: `Mismatch and len is 0. LPS[${i}] = 0`,
                     found: false, lineNumber: 5
                };
                 i++;
             }
        }
    }

    // Step 2: Search
    yield {
        text, pattern, currentIndex: 0, comparing: false, 
        lps: [...lps],
        message: "LPS Table Built. Starting Search...",
        found: false, lineNumber: 6
    };

    let j = 0; // index for pattern
    i = 0; // index for text

    while (i < n) {
        yield {
             text, pattern, currentIndex: i, matchIndex: i - j, comparing: true,
             lps: [...lps],
             message: `Comparing Text[${i}] (${text[i]}) with Pattern[${j}] (${pattern[j]})`,
             found: false, lineNumber: 7
        };

        if (pattern[j] === text[i]) {
            j++;
            i++;
        }

        if (j === m) {
             yield {
                 text, pattern, currentIndex: i, matchIndex: i - j, comparing: false,
                 lps: [...lps],
                 message: `Pattern found at index ${i - j}!`,
                 found: true, lineNumber: 8
            };
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
             yield {
                 text, pattern, currentIndex: i, matchIndex: i - j, comparing: true,
                 lps: [...lps],
                 message: `Mismatch. Text[${i}] != Pattern[${j}]`,
                 found: false, lineNumber: 9
            };
             
            if (j !== 0) {
                const oldJ = j;
                j = lps[j - 1];
                 yield {
                     text, pattern, currentIndex: i, matchIndex: i - j, comparing: false,
                     lps: [...lps],
                     message: `Using LPS: Jump pattern index ${oldJ} -> ${j}`,
                     found: false, lineNumber: 10
                };
            } else {
                i++;
            }
        }
    }

    yield {
        text, pattern, currentIndex: n, comparing: false, 
        lps: [...lps],
        message: "Search Complete.",
        found: false, lineNumber: 11
    };
}
