"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HashChainingVisualizerProps {
    buckets: number[][]; // Array of arrays
    activeBucketIndex?: number;
    highlightedNodeIndex?: number; // Valid only if activeBucketIndex is set
}

export default function HashChainingVisualizer({
    buckets,
    activeBucketIndex,
    highlightedNodeIndex
}: HashChainingVisualizerProps) {
    return (
        <div className="flex flex-col gap-2 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
            {buckets.map((bucket, i) => {
                const isActiveBucket = activeBucketIndex === i;

                return (
                    <div key={i} className="flex items-center h-16">
                        {/* Bucket Index */}
                        <div 
                            className={`
                                w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded-l-lg border-y border-l
                                ${isActiveBucket ? "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 text-yellow-800 dark:text-yellow-200" : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500"}
                                transition-colors duration-300 relative
                            `}
                        >
                            {i}
                            {/* Connector if has items */}
                            {bucket.length > 0 && (
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-zinc-400">
                                    <ArrowRight size={16} />
                                </div>
                            )}
                        </div>

                        {/* Linked List Items */}
                        <div className="flex items-center gap-1 ml-4 overflow-x-auto">
                            <AnimatePresence>
                                {bucket.map((val, nodeIdx) => {
                                    const isHighlighted = isActiveBucket && highlightedNodeIndex === nodeIdx;
                                    
                                    return (
                                        <motion.div
                                            key={`${i}-${nodeIdx}-${val}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ 
                                                opacity: 1, 
                                                x: 0,
                                                scale: isHighlighted ? 1.1 : 1,
                                                backgroundColor: isHighlighted ? "#dbeafe" : "#ffffff"
                                            }}
                                            className={`
                                                flex items-center gap-1
                                            `}
                                        >
                                            <div className={`
                                                w-10 h-10 flex items-center justify-center rounded-full border shadow-sm text-sm font-semibold
                                                ${isHighlighted 
                                                    ? "border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-200" 
                                                    : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"}
                                            `}>
                                                {val}
                                            </div>
                                            {nodeIdx < bucket.length - 1 && (
                                                <ArrowRight size={14} className="text-zinc-300" />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
