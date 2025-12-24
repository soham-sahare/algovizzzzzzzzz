"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrieNode } from "@/lib/algorithms/tree/trie";

interface TrieVisualizerProps {
    root: TrieNode | null;
    activeNodeId?: string;
    highlightedPath?: string[];
    width?: number;
    height?: number;
}

// Basic Tree Layout Algorithm for N-ary Tree
// Calculates x,y for all nodes recursively
const calculateLayout = (root: TrieNode | null, width: number, height: number) => {
    if (!root) return [];
    
    const nodes: (TrieNode & { x: number, y: number, parentX?: number, parentY?: number, edgeLabel?: string })[] = [];
    const levels: Record<number, number> = {}; // Count nodes per level to space them out
    
    // We need a more sophisticated layout than just "count per level" because subtree widths vary.
    // Reingold-Tilford is ideal, but let's do a simplified recursive width-based layout.
    
    const getSubtreeWidth = (node: TrieNode): number => {
        const children = Object.values(node.children);
        if (children.length === 0) return 1;
        return children.reduce((acc, child) => acc + getSubtreeWidth(child), 0);
    };

    const traverse = (node: TrieNode, depth: number, xStart: number, availableWidth: number, parentX?: number, parentY?: number, edgeLabel?: string) => {
        const myX = xStart + availableWidth / 2;
        const myY = 40 + depth * 80;
        
        nodes.push({ ...node, x: myX, y: myY, parentX, parentY, edgeLabel });

        const children = Object.entries(node.children).sort((a,b) => a[0].localeCompare(b[0])); // Sort by char
        if (children.length === 0) return;

        const totalUnits = children.reduce((acc, [_, child]) => acc + getSubtreeWidth(child), 0);
        let currentX = xStart;
        
        children.forEach(([char, child]) => {
            const childUnits = getSubtreeWidth(child);
            const childWidth = (childUnits / totalUnits) * availableWidth;
            traverse(child, depth + 1, currentX, childWidth, myX, myY, char);
            currentX += childWidth;
        });
    };

    traverse(root, 0, 0, width, undefined, undefined, undefined);
    return nodes;
};

export default function TrieVisualizer({ 
    root, 
    activeNodeId, 
    highlightedPath = [],
    width = 800, 
    height = 600 
}: TrieVisualizerProps) {
    const layoutNodes = useMemo(() => calculateLayout(root, width, height), [root, width, height]);

    return (
        <div className="relative border rounded-lg bg-zinc-50 dark:bg-zinc-900 overflow-hidden shadow-inner" style={{ width, height }}>
            <svg width={width} height={height} className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                    {layoutNodes.map(node => {
                        if (node.parentX === undefined || node.parentY === undefined) return null;
                        return (
                            <motion.g key={`edge-${node.id}`}>
                                <motion.line
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    x1={node.parentX}
                                    y1={node.parentY + 20} // Bottom of parent
                                    x2={node.x}
                                    y2={node.y - 20} // Top of child
                                    stroke="#cbd5e1"
                                    strokeWidth="2"
                                />
                                {/* Edge Label */}
                                <motion.text
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    x={(node.parentX + node.x) / 2}
                                    y={(node.parentY + 20 + node.y - 20) / 2}
                                    dy={-5}
                                    textAnchor="middle"
                                    className="text-xs fill-zinc-500 font-mono font-bold bg-white"
                                    style={{ textShadow: "0px 0px 4px white" }} // Outline for readability
                                >
                                    {node.edgeLabel}
                                </motion.text>
                            </motion.g>
                        );
                    })}
                </AnimatePresence>
            </svg>

            <AnimatePresence>
                {layoutNodes.map(node => {
                    const isActive = activeNodeId === node.id;
                    const isHighlighted = highlightedPath.includes(node.id);
                    const isEnd = node.isEndOfWord;

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                x: node.x - 20, 
                                y: node.y - 20, 
                                scale: 1, 
                                opacity: 1,
                                backgroundColor: isActive ? "#FCD34D" : isHighlighted ? "#bfdbfe" : "#ffffff",
                                borderColor: isEnd ? "#ef4444" : (isActive ? "#f59e0b" : "#e2e8f0")
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{ 
                                position: "absolute",
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `solid`,
                                borderWidth: isEnd ? "3px" : "2px",
                                zIndex: 10
                            }}
                            className="shadow-sm"
                        >
                            {/* Inner dot if end of word */}
                            {node.id === 'root' ? (
                                <span className="text-xs font-bold text-zinc-400">ROOT</span>
                             ) : (
                                isEnd && <div className="w-2 h-2 bg-red-500 rounded-full" />
                             )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>
                    <span className="text-zinc-500">End of Word</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                    <span className="text-zinc-500">Active</span>
                </div>
            </div>
        </div>
    );
}
