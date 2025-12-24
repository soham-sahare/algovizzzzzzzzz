"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GraphNode {
    id: string;
    label?: string;
    x: number;
    y: number;
}

export interface GraphEdge {
    from: string;
    to: string;
    weight?: number;
    isDirected?: boolean;
}

interface GraphVisualizerProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    highlightedNodes?: string[]; // IDs
    highlightedEdges?: { from: string; to: string }[];
    visitingNodeId?: string; // Currently active
    visitedNodeIds?: string[]; // Completed
    width?: number;
    height?: number;
}

export default function GraphVisualizer({
    nodes,
    edges,
    highlightedNodes = [],
    highlightedEdges = [],
    visitingNodeId,
    visitedNodeIds = [],
    width = 800,
    height = 500
}: GraphVisualizerProps) {

    // Helper to find node pos
    const getNodePos = (id: string) => nodes.find(n => n.id === id) || { x: 0, y: 0 };

    return (
        <div className="relative border rounded-lg bg-white dark:bg-zinc-900/50 shadow-inner overflow-hidden select-none" style={{ width, height }}>
            
            <svg width={width} height={height} className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                    {edges.map((edge, i) => {
                        const start = getNodePos(edge.from);
                        const end = getNodePos(edge.to);
                        
                        const isHighlighted = highlightedEdges.some(
                            e => (e.from === edge.from && e.to === edge.to) || (!edge.isDirected && e.from === edge.to && e.to === edge.from)
                        );

                        const midX = (start.x + end.x) / 2;
                        const midY = (start.y + end.y) / 2;
                        
                        return (
                            <React.Fragment key={`${edge.from}-${edge.to}-${i}`}>
                                <motion.line
                                    initial={{ opacity: 0 }}
                                    animate={{ 
                                        opacity: 1,
                                        stroke: isHighlighted ? "#F59E0B" : "currentColor"
                                    }}
                                    x1={start.x}
                                    y1={start.y}
                                    x2={end.x}
                                    y2={end.y}
                                    strokeWidth={isHighlighted ? 3 : 2}
                                    className={!isHighlighted ? "text-zinc-300 dark:text-zinc-700" : ""}
                                />
                                {edge.weight !== undefined && (
                                    <motion.g
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <rect 
                                            x={midX - 10} 
                                            y={midY - 10} 
                                            width={20} 
                                            height={20} 
                                            rx={4} 
                                            fill="var(--background)" 
                                            className="fill-white dark:fill-zinc-900"
                                        />
                                        <text
                                            x={midX}
                                            y={midY}
                                            dy={4}
                                            textAnchor="middle"
                                            className="text-[10px] font-bold fill-zinc-600 dark:fill-zinc-400"
                                        >
                                            {edge.weight}
                                        </text>
                                    </motion.g>
                                )}
                            </React.Fragment>
                        );
                    })}
                </AnimatePresence>
            </svg>

            {/* Nodes */}
            <AnimatePresence>
                {nodes.map(node => {
                    const isVisiting = visitingNodeId === node.id;
                    const isVisited = visitedNodeIds.includes(node.id);
                    const isHighlighted = highlightedNodes.includes(node.id);
                    
                    let bgColor = "#FFFFFF"; // Default
                    let borderColor = "#E4E4E7";
                    let textColor = "#18181B";

                    if (isVisiting) {
                        bgColor = "#FCD34D"; // Yellow
                        borderColor = "#F59E0B";
                        textColor = "#78350F";
                    } else if (isVisited) {
                        bgColor = "#D1FAE5"; // Green
                        borderColor = "#10B981";
                        textColor = "#064E3B";
                    } else if (isHighlighted) {
                        bgColor = "#DBEAFE"; // Blue check
                        borderColor = "#3B82F6";
                    }

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0 }}
                            animate={{ 
                                x: node.x - 24, // Center (48px / 2)
                                y: node.y - 24,
                                scale: 1, 
                                backgroundColor: bgColor,
                                borderColor: borderColor
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{ 
                                position: "absolute",
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 2,
                                borderStyle: "solid",
                                color: textColor,
                                fontWeight: "bold",
                                zIndex: 10,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                            }}
                        >
                            {node.label || node.id}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
