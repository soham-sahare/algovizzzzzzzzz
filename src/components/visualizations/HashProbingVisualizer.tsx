"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HashProbingVisualizerProps {
    array: number[];
    activeIndex?: number; // Where something was newly inserted
    probingIndex?: number; // Where we are currently looking
}

export default function HashProbingVisualizer({
    array,
    activeIndex,
    probingIndex
}: HashProbingVisualizerProps) {
    return (
        <div className="flex flex-wrap gap-2 p-4 justify-center items-center">
            {array.map((val, i) => {
                const isProbing = probingIndex === i;
                const isActive = activeIndex === i;
                const isEmpty = val === -1;

                let borderColor = "border-zinc-300 dark:border-zinc-600";
                let bgColor = "bg-white dark:bg-zinc-800";
                let textColor = "text-zinc-500";

                if (isActive) {
                    borderColor = "border-green-500";
                    bgColor = "bg-green-100 dark:bg-green-900/50";
                    textColor = "text-green-800 dark:text-green-200 font-bold";
                } else if (isProbing) {
                    borderColor = "border-blue-500 scale-110 shadow-lg";
                    bgColor = "bg-blue-100 dark:bg-blue-900/30";
                    textColor = "text-blue-800 dark:text-blue-200";
                } else if (!isEmpty) {
                    textColor = "text-zinc-900 dark:text-zinc-300 font-semibold";
                }

                return (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <motion.div
                            animate={{ 
                                scale: isProbing ? 1.1 : 1,
                                borderColor: isActive ? "#22c55e" : isProbing ? "#3b82f6" : "rgba(82, 82, 91, 0.5)",
                                backgroundColor: isActive ? "rgba(220, 252, 231, 1)" : isProbing ? "rgba(219, 234, 254, 1)" : "rgba(255, 255, 255, 0)"
                            }}
                            className={`
                                w-12 h-16 flex items-center justify-center border-2 rounded-lg text-lg transition-colors duration-200 relative
                            `}
                        >
                            <AnimatePresence mode="wait">
                                {!isEmpty && (
                                    <motion.span
                                        key={val}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={textColor}
                                    >
                                        {val}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Probing Indicator */}
                            {isProbing && (
                                <motion.div 
                                    layoutId="probe-indicator"
                                    className="absolute -top-3 w-2 h-2 rounded-full bg-blue-500"
                                />
                            )}
                        </motion.div>
                        <span className="text-xs font-mono text-zinc-400">{i}</span>
                    </div>
                );
            })}
        </div>
    );
}
