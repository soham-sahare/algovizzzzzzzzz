
export interface TrieNode {
    id: string;
    children: Record<string, TrieNode>;
    isEndOfWord: boolean;
    x?: number;
    y?: number;
}

export type TrieStep = {
    root: TrieNode;
    activeNodeId?: string;
    highlightedPath?: string[]; // IDs of nodes in path
    highlightPath?: string[]; // Alias for backward compatibility if needed, or stick to one
    message: string;
    lineNumber?: number;
}

// Unified step generator
export function* generateTrieInsertSteps(root: TrieNode, word: string): Generator<TrieStep> {
    yield* generateTrieSteps(word, 'INSERT', root);
}
export function* generateTrieSearchSteps(root: TrieNode, word: string): Generator<TrieStep> {
    yield* generateTrieSteps(word, 'SEARCH', root);
}
export function* generateTrieStartsWithSteps(root: TrieNode, word: string): Generator<TrieStep> {
    yield* generateTrieSteps(word, 'STARTS_WITH', root);
}

export function* generateTrieSteps(
    word: string, 
    operation: 'INSERT' | 'SEARCH' | 'STARTS_WITH',
    currentRoot: TrieNode | null
): Generator<TrieStep> {
    // Initialize root if null
    let root = currentRoot;
    if (!root) {
        root = { id: 'root', children: {}, isEndOfWord: false };
        if (operation === 'INSERT') {
            yield { 
                root: JSON.parse(JSON.stringify(root)), 
                message: "Initialize empty Trie Root", 
                lineNumber: 1 
            };
        }
    }

    let currentNode = root!;
    const pathIds: string[] = [currentNode.id];

    yield { 
        root: JSON.parse(JSON.stringify(root)), 
        activeNodeId: currentNode.id,
        highlightedPath: [...pathIds],
        highlightPath: [...pathIds],
        message: `Start at Root for ${operation} "${word}"`, 
        lineNumber: 2 
    };

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        
        if (operation === 'INSERT') {
            if (!currentNode.children[char]) {
                yield { 
                    root: JSON.parse(JSON.stringify(root)), 
                    activeNodeId: currentNode.id,
                    highlightedPath: [...pathIds],
                    highlightPath: [...pathIds],
                    message: `Character '${char}' not found. Creating new node.`, 
                    lineNumber: 3 
                };
                
                currentNode.children[char] = { 
                    id: `${currentNode.id}-${char}`, 
                    children: {}, 
                    isEndOfWord: false 
                };
            } else {
                 yield { 
                    root: JSON.parse(JSON.stringify(root)), 
                    activeNodeId: currentNode.id,
                     highlightedPath: [...pathIds],
                    highlightPath: [...pathIds],
                    message: `Character '${char}' found. Traversing.`, 
                    lineNumber: 4 
                };
            }
            currentNode = currentNode.children[char];
            pathIds.push(currentNode.id);
            
             yield { 
                root: JSON.parse(JSON.stringify(root)), 
                activeNodeId: currentNode.id,
                 highlightedPath: [...pathIds],
                highlightPath: [...pathIds],
                message: `Moved to node '${char}'`, 
                lineNumber: 5 
            };

        } else { // SEARCH or STARTS_WITH
            if (!currentNode.children[char]) {
                yield { 
                    root: JSON.parse(JSON.stringify(root)), 
                    activeNodeId: currentNode.id,
                     highlightedPath: [...pathIds],
                    highlightPath: [...pathIds],
                    message: `Character '${char}' not found. Return False.`, 
                    lineNumber: 3 
                };
                return; // Failed
            }
            currentNode = currentNode.children[char];
            pathIds.push(currentNode.id);
            
            yield { 
                root: JSON.parse(JSON.stringify(root)), 
                activeNodeId: currentNode.id,
                 highlightedPath: [...pathIds],
                highlightPath: [...pathIds],
                message: `Found '${char}'...`, 
                lineNumber: 4 
            };
        }
    }

    if (operation === 'INSERT') {
        currentNode.isEndOfWord = true;
        yield { 
            root: JSON.parse(JSON.stringify(root)), 
            activeNodeId: currentNode.id,
             highlightedPath: [...pathIds],
            highlightPath: [...pathIds], // maintain alias
            message: `Marked end of word "${word}"`, 
            lineNumber: 6 
        };
    } else if (operation === 'SEARCH') {
        if (currentNode.isEndOfWord) {
             yield { 
                root: JSON.parse(JSON.stringify(root)), 
                activeNodeId: currentNode.id,
                 highlightedPath: [...pathIds],
                highlightPath: [...pathIds],
                message: `End of word marked. Found "${word}"!`, 
                lineNumber: 6 
            };
        } else {
             yield { 
                root: JSON.parse(JSON.stringify(root)), 
                activeNodeId: currentNode.id,
                 highlightedPath: [...pathIds],
                highlightPath: [...pathIds],
                message: `Word ends here, but 'isEndOfWord' is false. "${word}" is just a prefix. Return False.`, 
                lineNumber: 7 
            };
        }
    } else if (operation === 'STARTS_WITH') {
         yield { 
            root: JSON.parse(JSON.stringify(root)), 
            activeNodeId: currentNode.id,
             highlightedPath: [...pathIds],
            highlightPath: [...pathIds],
            message: `Prefix "${word}" exists! Return True.`, 
            lineNumber: 6 
        };
    }
}

export function* generateTrieDeleteSteps(root: TrieNode, word: string): Generator<TrieStep> {
    
    // helper to emit
    function* emit(msg: string, activeId: string, path: string[]) {
        yield {
            root: JSON.parse(JSON.stringify(root)),
            activeNodeId: activeId,
            message: msg,
            highlightPath: path,
            highlightedPath: path
        };
    }

    yield* emit(`Starting deletion of "${word}"`, root.id, [root.id]);

    // 1. Find the node and path
    let current = root;
    const stack: { node: TrieNode, char: string }[] = []; // Parent + char to child
    const pathIds: string[] = [root.id];
    
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const nextNode = current.children[char];
        
        if (!nextNode) {
             yield* emit(`Character '${char}' not found. Word "${word}" does not exist.`, current.id, pathIds);
            return;
        }

        stack.push({ node: current, char });
        current = nextNode;
        pathIds.push(current.id);
        
        yield* emit(`Found '${char}'`, current.id, pathIds);
    }

    if (!current.isEndOfWord) {
        yield* emit(`Word "${word}" ends here, but isEndOfWord is false. Not in Trie.`, current.id, pathIds);
        return;
    }

    // 2. Delete logic
    current.isEndOfWord = false;
    yield* emit(`Unmarked end of word for "${word}".`, current.id, pathIds);

    // 3. Prune nodes if they have no other children and are not end of another word
    // Traverse path backwards using stack
    
    // Loop backwards
    while (stack.length > 0) {
        const { node: parent, char } = stack.pop()!;
        const child = parent.children[char];
        
        // Check if child is now useless
        // It is useless if: no children AND isEndOfWord is false
        const hasChildren = Object.keys(child.children).length > 0;
        
        if (!hasChildren && !child.isEndOfWord) {
            delete parent.children[char];
             pathIds.pop(); // Remove child from path view
            yield* emit(`Node for '${char}' has no children and is not a word end. Pruning.`, parent.id, pathIds);
        } else {
            yield* emit(`Node for '${char}' has other children or is a word end. Stop pruning.`, child.id, pathIds);
            break; // Stop pruning up the tree
        }
    }

    yield* emit(`Deletion of "${word}" complete.`, root.id, []);
}
