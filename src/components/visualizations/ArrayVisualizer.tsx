"use client";

import { motion } from "framer-motion";

interface ArrayVisualizerProps {
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
}

export default function ArrayVisualizer({
  array,
  comparingIndices,
  swappingIndices,
  sortedIndices,
}: ArrayVisualizerProps) {
  return (
    <div className="flex items-end justify-center h-64 sm:h-96 gap-1 w-full p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
      {array.map((value, index) => {
        let barColor = "bg-zinc-400 dark:bg-zinc-700"; // Light Mode: Zinc-400, Dark Mode: Zinc-700
        
        if (sortedIndices.includes(index)) {
            barColor = "bg-emerald-500"; // Sorted (Green)
        } else if (swappingIndices.includes(index)) {
            barColor = "bg-red-500"; // Swapping (Red)
        } else if (comparingIndices.includes(index)) {
            barColor = "bg-yellow-400"; // Comparing (Yellow - High Contrast)
        }

        return (
          <motion.div
            layout
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${value}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex-1 max-w-[40px] rounded-t-lg mx-0.5 ${barColor} transition-colors duration-100 relative group flex items-end justify-center pb-1`}
          >
            <span className="text-[10px] font-bold text-white/90 select-none">
              {value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
