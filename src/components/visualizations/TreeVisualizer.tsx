"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeNode } from "@/lib/algorithms/tree/bst";

interface TreeVisualizerProps {
    root: TreeNode | null;
    highlightedNodes?: string[];
    activeNodeId?: string;
    height?: number;
    width?: number;
}

// Simple Layout Algorithm:
// Inorder traversal to determine X coordinate (rank).
// Depth determines Y coordinate.
// This guarantees no overlapping X for binary trees and looks decent.
// Scale X and Y to fit container.

type NodeWithPos = TreeNode & { x: number; y: number };

const calculateLayout = (root: TreeNode | null, width: number, height: number): NodeWithPos[] => {
    if (!root) return [];
    
    // 1. Determine relative positions (Grid coords)
    const nodes: { node: TreeNode; depth: number; col: number }[] = [];
    let counter = 0;
    let maxDepth = 0;

    const traverse = (node: TreeNode | null, depth: number) => {
        if (!node) return;
        traverse(node.left, depth + 1);
        nodes.push({ node, depth, col: counter++ }); // Inorder for X
        maxDepth = Math.max(maxDepth, depth);
        traverse(node.right, depth + 1);
    };

    traverse(root, 0);

    // 2. Scale to pixels
    // Margin
    const mx = 40;
    const my = 40;
    const availableW = width - 2 * mx;
    const availableH = height - 2 * my;

    // If only one node
    if (nodes.length === 0) return [];

    const xStep = nodes.length > 1 ? availableW / (nodes.length - 1) : 0;
    const yStep = maxDepth > 0 ? availableH / maxDepth : 0;

    return nodes.map(({ node, depth, col }) => ({
        ...node,
        // If single node, center it
        x: nodes.length === 1 ? width / 2 : mx + col * xStep,
        y: maxDepth === 0 ? my : my + depth * yStep
    }));
};

export default function TreeVisualizer({ 
    root, 
    highlightedNodes = [], 
    activeNodeId,
    height = 500,
    width = 800 
}: TreeVisualizerProps) {
    
    const layoutNodes = useMemo(() => calculateLayout(root, width, height), [root, width, height]);

    // Create a map for easy parent lookup to draw edges
    // Actually, edges are best drawn by traversing the structure again, knowing Parent Pos and Child Pos.
    // We can map ID -> Pos
    const posMap = useMemo(() => {
        const map = new Map<string, { x: number, y: number }>();
        layoutNodes.forEach(n => map.set(n.id, { x: n.x, y: n.y }));
        return map;
    }, [layoutNodes]);

    // Generate edges
    const edges: Array<{ id: string; x1: number; y1: number; x2: number; y2: number }> = [];
    const traverseEdges = (node: TreeNode | null) => {
        if (!node) return;
        const parentPos = posMap.get(node.id);
        if (!parentPos) return;

        if (node.left) {
            const childPos = posMap.get(node.left.id);
            if (childPos) {
                edges.push({
                    id: `${node.id}-${node.left.id}`,
                    x1: parentPos.x,
                    y1: parentPos.y,
                    x2: childPos.x,
                    y2: childPos.y
                });
                traverseEdges(node.left);
            }
        }
        if (node.right) {
            const childPos = posMap.get(node.right.id);
            if (childPos) {
                 edges.push({
                    id: `${node.id}-${node.right.id}`,
                    x1: parentPos.x,
                    y1: parentPos.y,
                    x2: childPos.x,
                    y2: childPos.y
                });
                traverseEdges(node.right);
            }
        }
    };
    traverseEdges(root);

    return (
        <div className="relative border rounded-lg bg-white dark:bg-zinc-900/50 shadow-inner overflow-hidden" style={{ width, height }}>
            
            {/* Standard SVG for edges */}
            <svg width={width} height={height} className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                    {edges.map(edge => (
                        <motion.line
                            key={edge.id}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-zinc-300 dark:text-zinc-700"
                        />
                    ))}
                </AnimatePresence>
            </svg>

            {/* Nodes */}
            <AnimatePresence>
                {layoutNodes.map(node => {
                    const isHighlighted = highlightedNodes.includes(node.id);
                    const isActive = activeNodeId === node.id;
                    
                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                                x: node.x - 20, // Center the 40px node
                                y: node.y - 20,
                                scale: 1, 
                                opacity: 1,
                                backgroundColor: isActive ? "#FCD34D" : isHighlighted ? "#D1FAE5" : "#FFFFFF"
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
                                border: `2px solid ${isActive ? "#F59E0B" : isHighlighted ? "#10B981" : "#E4E4E7"}`,
                                color: isActive ? "#78350F" : isHighlighted ? "#064E3B" : "#18181B",
                                fontWeight: "bold",
                                zIndex: 10
                            }}
                            className="text-sm shadow-sm dark:text-black" // Force text black for visibility on white/light nodes in dark mode if needed
                        >
                            {node.label ?? node.value}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
