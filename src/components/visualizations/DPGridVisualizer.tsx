"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DPGridVisualizerProps {
    grid: (number | string)[][];
    rowLabels?: string[];
    colLabels?: string[];
    activeCell?: { r: number, c: number };
    highlightedCells?: { r: number, c: number }[]; // For comparison hint
    comparingCells?: { r: number, c: number }[]; // Different color for sources
    cellSize?: number;
}

export default function DPGridVisualizer({
    grid,
    rowLabels,
    colLabels,
    activeCell,
    highlightedCells = [],
    comparingCells = [],
    cellSize = 50
}: DPGridVisualizerProps) {
    if (!grid || grid.length === 0) return null;

    const rows = grid.length;
    const cols = grid[0].length;

    return (
        <div className="overflow-auto border rounded-lg bg-white dark:bg-zinc-900/50 shadow-inner p-4 inline-block max-w-full">
            <div 
                className="grid gap-1"
                style={{ 
                    gridTemplateColumns: `auto ${colLabels ? `repeat(${cols}, ${cellSize}px)` : `repeat(${cols}, ${cellSize}px)`}`
                }}
            >
                {/* Header Row */}
                <div className="h-8 w-8"></div> {/* Corner */}
                {colLabels?.map((label, i) => (
                    <div key={`col-${i}`} className="flex items-center justify-center font-mono text-xs text-zinc-500 font-bold">
                        {label}
                    </div>
                ))}

                {/* Grid Rows */}
                {grid.map((row, r) => (
                    <React.Fragment key={`row-${r}`}>
                        {/* Row Label */}
                        <div className="flex items-center justify-end pr-2 font-mono text-xs text-zinc-500 font-bold whitespace-nowrap">
                            {rowLabels?.[r] ?? r}
                        </div>

                        {/* Cells */}
                        {row.map((cellValue, c) => {
                            const isActive = activeCell?.r === r && activeCell?.c === c;
                            const isHighlighted = highlightedCells.some(cell => cell.r === r && cell.c === c);
                            const isComparing = comparingCells.some(cell => cell.r === r && cell.c === c);

                            let bgColor = "transparent";
                            let borderColor = "border-zinc-200 dark:border-zinc-800";
                            let textColor = "text-zinc-500 dark:text-zinc-500";

                            if (isActive) {
                                bgColor = "bg-yellow-200 dark:bg-yellow-900/50";
                                borderColor = "border-yellow-500";
                                textColor = "text-yellow-800 dark:text-yellow-200 font-bold";
                            } else if (isComparing) {
                                bgColor = "bg-blue-100 dark:bg-blue-900/30";
                                borderColor = "border-blue-400";
                                textColor = "text-blue-700 dark:text-blue-300";
                            } else if (isHighlighted) {
                                bgColor = "bg-green-100 dark:bg-green-900/30";
                                borderColor = "border-green-400";
                                textColor = "text-green-700 dark:text-green-300";
                            } else if (cellValue !== "" && cellValue !== 0 && cellValue !== -1) {
                                // Has value but not active
                                textColor = "text-zinc-900 dark:text-zinc-100";
                            }

                            return (
                                <motion.div
                                    key={`${r}-${c}`}
                                    initial={false}
                                    animate={{ 
                                        backgroundColor: isActive ? "rgba(253, 224, 71, 0.4)" : isComparing ? "rgba(219, 234, 254, 0.4)" : "transparent",
                                        scale: isActive ? 1.05 : 1
                                    }}
                                    className={`
                                        flex items-center justify-center border rounded 
                                        ${borderColor} ${bgColor} ${textColor}
                                        transition-colors duration-200
                                    `}
                                    style={{ width: cellSize, height: cellSize }}
                                >
                                    <AnimatePresence mode="popLayout">
                                        <motion.span
                                            key={`${r}-${c}-${cellValue}`}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="text-sm"
                                        >
                                            {cellValue}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
