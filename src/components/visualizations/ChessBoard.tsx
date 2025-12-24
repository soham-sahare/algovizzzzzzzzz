"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

interface ChessBoardProps {
    n: number;
    queens: number[]; // Index is row, value is col. -1 means no queen.
    currentRow?: number; // Currently processing row
    currentCol?: number; // Currently processing col
    isValid?: boolean; // Status of current placement
    size?: number;
}

export default function ChessBoard({
    n,
    queens,
    currentRow,
    currentCol,
    isValid,
    size = 400
}: ChessBoardProps) {
    const cellSize = size / n;

    return (
        <div 
            className="border-4 border-zinc-800 dark:border-zinc-200 rounded shadow-2xl overflow-hidden bg-white"
            style={{ width: size, height: size, display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)` }}
        >
            {Array.from({ length: n * n }).map((_, i) => {
                const row = Math.floor(i / n);
                const col = i % n;
                const isBlack = (row + col) % 2 === 1;
                
                // Queen status
                const hasQueen = queens[row] === col;
                const isProcessing = row === currentRow && col === currentCol;
                
                // Color override for visualization state
                let bgColor = isBlack ? "bg-zinc-600" : "bg-zinc-200";
                
                // If this is the specific cell we are checking
                if (isProcessing) {
                    if (isValid === undefined) bgColor = "bg-blue-300"; // Just checking
                    else if (isValid === true) bgColor = "bg-green-400"; // Safe
                    else if (isValid === false) bgColor = "bg-red-400"; // Attack
                }

                return (
                    <div 
                        key={i} 
                        className={`flex items-center justify-center relative ${bgColor} transition-colors duration-200`}
                        style={{ width: cellSize, height: cellSize }}
                    >
                        <AnimatePresence>
                            {(hasQueen || isProcessing) && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Crown 
                                        className={`
                                            ${(isProcessing && isValid === false) ? "text-red-900" : "text-black dark:text-zinc-900"} 
                                            fill-current
                                        `}
                                        size={cellSize * 0.7} 
                                        strokeWidth={1.5}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
