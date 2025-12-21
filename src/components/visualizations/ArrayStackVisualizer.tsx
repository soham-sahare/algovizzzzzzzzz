
import { motion, AnimatePresence } from "framer-motion";

type ArrayStackVisualizerProps = {
    array: (number | null)[];
    top: number;
    highlightedIndices: number[];
};

export default function ArrayStackVisualizer({ array, top, highlightedIndices }: ArrayStackVisualizerProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
            <div className="flex flex-col-reverse gap-2"> 
                <AnimatePresence mode="popLayout">
                    {array.map((value, index) => {
                        const isHighlighted = highlightedIndices.includes(index);
                        const isTop = index === top;
                        // Determine if this slot is 'empty' (null) or has a value
                        const hasValue = value !== null;

                        return (
                            <div key={index} className="relative flex items-center">
                                {/* Index Label */}
                                <span className="absolute -left-8 text-xs font-mono text-zinc-400 w-6 text-right">
                                    {index}
                                </span>

                                {/* Array Cell */}
                                <motion.div
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ 
                                        scale: 1, 
                                        opacity: 1,
                                        backgroundColor: isHighlighted 
                                            ? "rgb(251 146 60)" // orange-400
                                            : hasValue 
                                                ? "rgb(255 255 255)" 
                                                : "rgba(255, 255, 255, 0.05)",
                                        borderColor: isHighlighted
                                            ? "rgb(234 88 12)" // orange-600
                                            : "rgb(63 63 70)", // zinc-700
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className={`
                                        w-24 h-12 border-2 rounded-lg flex items-center justify-center font-bold text-lg
                                        shadow-sm
                                        ${hasValue ? "text-zinc-900 dark:text-zinc-900" : ""}
                                    `}
                                >
                                    {hasValue ? value : ""}
                                </motion.div>

                                {/* Top Pointer */}
                                {isTop && (
                                    <motion.div 
                                        layoutId="top-pointer"
                                        className="absolute -right-16 flex items-center gap-2 text-indigo-500 font-bold text-sm"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    >
                                        <div className="w-8 h-0.5 bg-indigo-500" />
                                        TOP
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </AnimatePresence>
            </div>
            
            {/* Base of Stack */}
            <div className="mt-2 w-28 h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            <div className="text-xs text-zinc-500 mt-1">Stack (Capacity: {array.length})</div>
        </div>
    );
}
