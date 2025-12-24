"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StringData {
    id: string;
    label?: string;
    value: string; // The string content
}

export interface StringPointer {
    id: string; // Unique ID for key
    stringId: string; // Which string it points to
    index: number;
    label: string;
    color?: string; // Tailwind color class e.g. "bg-red-500"
}

export interface StringHighlight {
    stringId: string;
    indices: number[];
    color?: string; // hex or tailwind class
}

interface StringVisualizerProps {
    strings: StringData[];
    pointers?: StringPointer[];
    highlights?: StringHighlight[];
    className?: string;
}

export default function StringVisualizer({
    strings,
    pointers = [],
    highlights = [],
    className = ""
}: StringVisualizerProps) {
    return (
        <div className={`flex flex-col gap-12 ${className}`}>
            {strings.map((strData) => {
                const myPointers = pointers.filter(p => p.stringId === strData.id);
                const myHighlights = highlights.find(h => h.stringId === strData.id);
                
                return (
                    <div key={strData.id} className="relative">
                        {strData.label && (
                            <div className="absolute -top-6 left-0 text-xs font-bold text-zinc-500 uppercase">
                                {strData.label}
                            </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                            {strData.value.split('').map((char, idx) => {
                                const isHighlighted = myHighlights?.indices.includes(idx);
                                const highlightColor = myHighlights?.color || "bg-yellow-200 dark:bg-yellow-900/50";
                                
                                return (
                                    <div key={idx} className="relative flex flex-col items-center gap-1">
                                        <motion.div
                                            className={`
                                                w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded text-lg font-mono font-bold
                                                ${isHighlighted ? `${highlightColor} border-yellow-500` : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"}
                                            `}
                                            initial={false}
                                            animate={{
                                                backgroundColor: isHighlighted ? (myHighlights?.color === "red" ? "#fee2e2" : "#fef08a") : "#ffffff", // Simplified animation logic, ideal would be full color support
                                                borderColor: isHighlighted ? "#eab308" : "#d4d4d8",
                                                scale: isHighlighted ? 1.05 : 1
                                            }}
                                        >
                                            {char}
                                        </motion.div>
                                        <span className="text-[10px] text-zinc-400 font-mono">{idx}</span>

                                        {/* Pointers */}
                                        {myPointers.filter(p => p.index === idx).map(p => (
                                            <motion.div
                                                layoutId={`pointer-${p.id}`}
                                                key={p.id}
                                                className="absolute top-14 flex flex-col items-center z-10"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] ${p.color?.replace('bg-', 'border-b-') || "border-b-blue-500"}`} />
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${p.color || "bg-blue-500"}`}>
                                                    {p.label}
                                                </span>
                                            </motion.div>
                                        ))}
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
