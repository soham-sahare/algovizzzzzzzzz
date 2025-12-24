"use client";

import React from "react";
import { motion } from "framer-motion";

export interface BitData {
    id: string;
    label: string;
    value: number;
    bitLength?: number; // default 8
    highlightIndices?: number[];
    color?: string; // Base color for 1s
}

interface BitVisualizerProps {
    data: BitData[];
    className?: string;
}

export default function BitVisualizer({
    data,
    className = ""
}: BitVisualizerProps) {
    return (
        <div className={`flex flex-col gap-6 ${className}`}>
            {data.map((row) => {
                const bits: number[] = [];
                const len = row.bitLength || 8;
                for (let i = len - 1; i >= 0; i--) {
                    bits.push((row.value >> i) & 1);
                }

                return (
                    <div key={row.id} className="flex items-center gap-4">
                        <div className="w-24 text-right font-bold text-sm text-zinc-500 uppercase">
                            {row.label}
                            <span className="block text-xs font-mono text-zinc-400">dec: {row.value}</span>
                        </div>
                        
                        <div className="flex gap-1">
                            {bits.map((bit, idx) => {
                                const bitIndex = len - 1 - idx; // Actual bit position (0 is LSB)
                                const isHighlighted = row.highlightIndices?.includes(bitIndex);
                                
                                return (
                                    <div key={bitIndex} className="flex flex-col items-center">
                                         <span className="text-[10px] text-zinc-300 font-mono mb-1">{bitIndex}</span>
                                        <motion.div
                                            className={`
                                                w-8 h-10 md:w-10 md:h-12 flex items-center justify-center border-2 rounded text-lg font-mono font-bold
                                                ${bit === 1 
                                                    ? (row.color || "bg-indigo-100 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300") 
                                                    : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"}
                                            `}
                                            animate={{
                                                scale: isHighlighted ? 1.1 : 1,
                                                borderColor: isHighlighted ? "#eab308" : (bit === 1 ? (row.color ? "" : "#6366f1") : "#e4e4e7"),
                                                backgroundColor: isHighlighted ? "#fef08a" : (bit === 1 ? "" : ""),
                                            }}
                                        >
                                            {bit}
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
