"use client";

import { motion } from "framer-motion";

interface CodeHighlightProps {
  code: string;
  activeLine?: number;
}

export default function CodeHighlight({ code, activeLine }: CodeHighlightProps) {
  const lines = code.split("\n");

  return (
    <div className="font-mono text-sm bg-white dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-x-auto shadow-sm dark:shadow-none">
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const isActive = activeLine === lineNumber;

        return (
          <div key={index} className="relative flex">
            {isActive && (
              <motion.div
                layoutId="active-line"
                className="absolute inset-0 bg-yellow-500/10 border-l-2 border-yellow-500"
                transition={{ duration: 0.1 }}
              />
            )}
            <span className="w-8 text-zinc-400 dark:text-zinc-600 select-none text-right pr-4 flex-shrink-0">
              {lineNumber}
            </span>
            <span className={`${isActive ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-500 dark:text-zinc-500"} whitespace-pre`}>
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
}
