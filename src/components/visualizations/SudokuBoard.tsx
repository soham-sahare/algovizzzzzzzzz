"use client";

import React from "react";
import { motion } from "framer-motion";

interface SudokuBoardProps {
    grid: number[][];
    initialGrid: number[][];
    activeCell?: { r: number, c: number };
    isValid?: boolean;
}

export default function SudokuBoard({
    grid,
    initialGrid,
    activeCell,
    isValid
}: SudokuBoardProps) {
    return (
        <div className="inline-grid grid-cols-9 gap-0.5 bg-black border-4 border-black dark:border-zinc-700">
            {grid.map((row, r) => 
                row.map((val, c) => {
                    const isInitial = initialGrid[r][c] !== 0;
                    const isActive = activeCell?.r === r && activeCell?.c === c;
                    
                    // Borders for 3x3 subgrids
                    const borderRight = (c + 1) % 3 === 0 && c !== 8 ? "border-r-2 border-r-black dark:border-r-zinc-500" : "";
                    const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? "border-b-2 border-b-black dark:border-b-zinc-500" : "";
                    
                    let bg = "bg-white dark:bg-zinc-800";
                    let text = "text-zinc-900 dark:text-zinc-100";

                    if (isInitial) {
                        bg = "bg-zinc-100 dark:bg-zinc-900";
                        text = "text-black dark:text-white font-bold";
                    } else if (isActive) {
                        if (isValid === true) bg = "bg-green-200 dark:bg-green-900";
                        else if (isValid === false) bg = "bg-red-200 dark:bg-red-900";
                        else bg = "bg-blue-100 dark:bg-blue-900";
                    } else if (val !== 0) {
                        // Filled by algorithm
                        text = "text-blue-600 dark:text-blue-400";
                    }

                    return (
                        <div 
                            key={`${r}-${c}`}
                            className={`
                                w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg
                                ${bg} ${text} ${borderRight} ${borderBottom}
                            `}
                        >
                            {isActive && val !== 0 ? (
                                <motion.span
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={`active-${val}`}
                                >
                                    {val}
                                </motion.span>
                            ) : (
                                val !== 0 ? val : ""
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
