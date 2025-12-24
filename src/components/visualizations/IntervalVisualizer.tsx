"use client";

import React from "react";
import { motion } from "framer-motion";

interface IntervalVisualizerProps {
    activities: { id: number, start: number, end: number }[];
    currentActivityId?: number;
    selectedIds: number[];
    rejectedIds: number[];
    maxTime?: number;
}

export default function IntervalVisualizer({
    activities,
    currentActivityId,
    selectedIds,
    rejectedIds,
    maxTime = 20
}: IntervalVisualizerProps) {
    // Determine scale: width / maxTime
    // Let's assume container is 100%, we use percentages.
    
    // Sort visually by index just to keep them stable
    // But logic sends them sorted by end time, so we render in that order
    
    return (
        <div className="w-full space-y-2 relative pt-8 pb-4">
            {/* Timeline Axis */}
            <div className="absolute top-0 left-0 w-full h-6 flex justify-between text-xs text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                {Array.from({ length: maxTime + 1 }).map((_, i) => (
                   <div key={i} className="relative h-full flex flex-col justify-end items-center" style={{ left: `${(i / maxTime) * 100}%`, position: 'absolute' }}>
                       <span className="mb-1">{i}</span>
                       <div className="h-1 w-px bg-zinc-300 dark:bg-zinc-600"></div>
                   </div> 
                ))}
            </div>

            {/* Activities */}
            {activities.map((activity, i) => {
                const isSelected = selectedIds.includes(activity.id);
                const isRejected = rejectedIds.includes(activity.id);
                const isCurrent = currentActivityId === activity.id;

                let bg = "bg-zinc-200 dark:bg-zinc-700";
                let border = "border-zinc-300 dark:border-zinc-600";
                let text = "text-zinc-500";
                let opacity = 0.7;

                if (isSelected) {
                    bg = "bg-green-200 dark:bg-green-900/50";
                    border = "border-green-500";
                    text = "text-green-800 dark:text-green-200 font-bold";
                    opacity = 1;
                } else if (isRejected) {
                    bg = "bg-red-100 dark:bg-red-900/30";
                    border = "border-red-300 dark:border-red-700";
                    text = "text-red-800 dark:text-red-300";
                    opacity = 0.4;
                } else if (isCurrent) {
                    bg = "bg-yellow-200 dark:bg-yellow-900/50";
                    border = "border-yellow-500";
                    text = "text-yellow-800 dark:text-yellow-200 font-bold";
                    opacity = 1;
                }

                const widthPercent = ((activity.end - activity.start) / maxTime) * 100;
                const leftPercent = (activity.start / maxTime) * 100;

                return (
                    <motion.div
                        key={activity.id}
                        layout // Animate position changes if array passes reordered
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity, x: 0 }}
                        className="relative h-10 w-full"
                    >
                        <div 
                            className={`
                                absolute top-1 h-8 rounded-md border-l-4 flex items-center px-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300
                                ${bg} ${border} ${text}
                            `}
                            style={{ 
                                left: `${leftPercent}%`, 
                                width: `${widthPercent}%` 
                            }}
                        >
                            <span className="mr-2 font-mono">#{activity.id}</span>
                            <span>({activity.start} - {activity.end})</span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
