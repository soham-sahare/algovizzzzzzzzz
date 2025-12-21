"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

export interface LinkedListNode {
  id: string; // Unique ID for key
  value: number;
}

interface LinkedListVisualizerProps {
  nodes: LinkedListNode[];
  highlightedNodes?: string[]; // IDs of nodes to highlight
  pointers?: { [nodeId: string]: string }; // Map node ID to pointer label (e.g. "Head", "Curr")
  mode?: "singly" | "doubly" | "circular";
}

export default function LinkedListVisualizer({
  nodes,
  highlightedNodes = [],
  pointers = {},
  mode = "singly",
}: LinkedListVisualizerProps) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 p-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50 min-h-[16rem] overflow-x-auto">
      <AnimatePresence mode="popLayout">
        {nodes.length === 0 ? (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="w-full flex justify-center text-zinc-400 font-mono text-sm"
           >
             NULL
           </motion.div>
        ) : (
          nodes.map((node, index) => {
            const isHighlighted = highlightedNodes.includes(node.id);
            const pointerLabel = pointers[node.id];

            return (
              <motion.div
                layout
                key={node.id}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center"
              >
                {/* Node Container */}
                <div className="relative group">
                  {/* Pointer Label */}
                  {pointerLabel && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 flex flex-col items-center"
                    >
                        <span className="px-2 py-0.5 text-xs font-bold bg-zinc-800 dark:bg-white text-white dark:text-black rounded shadow-sm">
                            {pointerLabel}
                        </span>
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-zinc-800 dark:border-t-white mt-[-1px]"></div>
                    </motion.div>
                  )}

                  {/* Node Circle */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 shadow-sm
                      transition-colors duration-300
                      ${isHighlighted 
                        ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-700 dark:text-yellow-400 ring-4 ring-yellow-500/20" 
                        : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100"}
                    `}
                  >
                    {node.value}
                  </div>
                  
                  {/* Address/Index (Optional aesthetic) */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 font-mono">
                     0x{node.id.slice(0, 3)}
                  </div>
                </div>

                {/* Arrow to next */}
                {index < nodes.length && ( 
                   <div className="mx-2 flex flex-col items-center gap-0.5 text-zinc-400 dark:text-zinc-600">
                      {(mode === "singly" || mode === "circular") ? (
                          <ArrowRight className="w-5 h-5" />
                      ) : (
                          <>
                            <ArrowRight className="w-4 h-4 text-emerald-500/70" />
                            <ArrowLeft className="w-4 h-4 text-blue-500/70" />
                          </>
                      )}
                   </div>
                )}
                
                {/* Explicit NULL for last node */}
                {index === nodes.length - 1 && (
                    <div className="text-sm font-mono text-zinc-400 dark:text-zinc-600">NULL</div>
                )}
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
