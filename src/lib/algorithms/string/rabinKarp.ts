
export interface StringSearchStep {
    text: string;
    pattern: string;
    currentIndex: number;
    matchIndex?: number; // Start index of match
    comparing: boolean;
    hashText?: number;
    hashPattern?: number;
    message: string;
    lineNumber?: number;
    found: boolean;
}

export function* generateRabinKarpSteps(text: string, pattern: string): Generator<StringSearchStep> {
    const n = text.length;
    const m = pattern.length;
    const d = 256; // Alphabet size
    const q = 101; // Prime number

    if (m === 0) return;
    if (n < m) {
         yield {
            text, pattern, currentIndex: 0, comparing: false, message: "Text shorter than pattern.", found: false, lineNumber: 1
        };
        return;
    }

    let h = 1;
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }

    let p = 0; // Pattern hash
    let t = 0; // Text hash

    // Calculate initial hashes
    for (let i = 0; i < m; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + text.charCodeAt(i)) % q;
    }

    yield {
        text, pattern, currentIndex: 0, comparing: false, 
        hashPattern: p, hashText: t,
        message: `Initial Hashes: Pattern=${p}, Text[0..${m-1}]=${t}`, 
        found: false, lineNumber: 2
    };

    for (let i = 0; i <= n - m; i++) {
        yield {
            text, pattern, currentIndex: i, comparing: true,
            hashPattern: p, hashText: t,
            message: `Comparing hashes at index ${i}: P=${p} vs T=${t}`,
            found: false, lineNumber: 3
        };

        if (p === t) {
            // Check characters one by one
            let j = 0;
            for (j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                     yield {
                        text, pattern, currentIndex: i, comparing: true,
                        hashPattern: p, hashText: t,
                        message: `Hash Match! But char mismatch at offset ${j} (${text[i+j]} != ${pattern[j]}). Spurious Hit.`,
                        found: false, lineNumber: 4
                    };
                    break;
                }
            }

            if (j === m) {
                 yield {
                    text, pattern, currentIndex: i, matchIndex: i, comparing: false,
                    hashPattern: p, hashText: t,
                    message: `Pattern Found at index ${i}!`,
                    found: true, lineNumber: 5
                };
                // Continue searching? usually yes.
            }
        } else {
             yield {
                text, pattern, currentIndex: i, comparing: true,
                hashPattern: p, hashText: t,
                message: `Hash mismatch.`,
                found: false, lineNumber: 6
            };
        }

        // Calculate hash for next window
        if (i < n - m) {
            t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            if (t < 0) t = t + q;
            
             yield {
                text, pattern, currentIndex: i + 1, comparing: false,
                hashPattern: p, hashText: t,
                message: `Rolling Hash update for next window: New Text Hash=${t}`,
                found: false, lineNumber: 7
            };
        }
    }
    
    yield {
        text, pattern, currentIndex: n, comparing: false, message: "Search Complete.", found: false, lineNumber: 8
    };
}
