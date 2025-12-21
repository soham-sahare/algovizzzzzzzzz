"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ArrayOperationsVisualizerProps {
  array: (number | null)[];
  capacity: number;
  highlightIndex?: number;
  highlightType?: "access" | "insert" | "delete" | "search"; // Color coding
}

export default function ArrayOperationsVisualizer({
  array,
  capacity,
  highlightIndex,
  highlightType,
}: ArrayOperationsVisualizerProps) {
  // Create an array representing the full capacity
  const displayArray = Array.from({ length: capacity }, (_, i) => {
    return i < array.length ? array[i] : null;
  });

  const getBarColor = (index: number) => {
    if (index === highlightIndex) {
      if (highlightType === "insert") return "bg-green-500 border-green-500 text-white";
      if (highlightType === "delete") return "bg-red-500 border-red-500 text-white";
      if (highlightType === "access") return "bg-yellow-500 border-yellow-500 text-black";
      if (highlightType === "search") return "bg-blue-500 border-blue-500 text-white";
    }
    // Used slot
    if (index < array.length) return "bg-zinc-800 border-zinc-700 text-zinc-100";
    
    // Empty slot (capacity)
    return "bg-transparent border-dashed border-zinc-700 text-zinc-600";
  };

  return (
    <div className="flex items-center justify-start gap-2 p-6 bg-zinc-950 rounded-xl border border-zinc-800 overflow-x-auto min-h-[140px]">
      <AnimatePresence mode="popLayout">
        {displayArray.map((value, index) => (
          <motion.div
            key={index} // Using index as key here is acceptable as we want to visualize slots 0..N
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`
              relative flex items-center justify-center w-16 h-16 rounded-lg border-2 text-xl font-bold font-mono transition-colors duration-200 flex-shrink-0
              ${getBarColor(index)}
            `}
          >
             {/* Content */}
             {value !== null ? value : "∅"}

             {/* Index Label */}
             <span className="absolute -bottom-6 text-xs text-zinc-500 font-sans font-normal">
                {index}
             </span>
             
             {/* Highlight Label */}
            {index === highlightIndex && (
             <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: -20 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold bg-white text-black px-2 py-0.5 rounded shadow-lg"
             >
                {highlightType?.toUpperCase()}
             </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
