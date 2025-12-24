"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, Activity, Percent, ChevronsRight } from "lucide-react"; 
import BackButton from "@/components/ui/BackButton";

const searchingAlgorithms = [
    {
        name: "Linear Search",
        description: "Simple search algorithm that checks every element in the list sequentially.",
        difficulty: "Easy",
        icon: <ArrowRight className="w-6 h-6" />,
        href: "/dsa/arrays/searching/linear"
    },
    {
        name: "Binary Search",
        description: "Efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.",
        difficulty: "Medium",
        icon: <Search className="w-6 h-6" />,
        href: "/dsa/arrays/searching/binary"
    },
    {
        name: "Jump Search",
        description: "Searching algorithm for sorted arrays. The basic idea is to check fewer elements by jumping ahead by fixed steps.",
        difficulty: "Medium",
        icon: <ChevronsRight className="w-6 h-6" />,
        href: "/dsa/arrays/searching/jump"
    },
    {
        name: "Interpolation Search",
        description: "Improved variant of Binary Search for uniformly distributed data. Probes position based on value.",
        difficulty: "Medium",
        icon: <Percent className="w-6 h-6" />,
        href: "/dsa/arrays/searching/interpolation"
    },
    {
        name: "Exponential Search",
        description: "Finds range where element is present, then performs Binary Search. Useful for unbounded arrays.",
        difficulty: "Hard",
        icon: <Activity className="w-6 h-6" />,
        href: "/dsa/arrays/searching/exponential"
    }
];

export default function SearchingDashboard() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <BackButton href="/dsa/arrays" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Searching Algorithms
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore different techniques to find data efficiently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchingAlgorithms.map((algo, index) => (
            <motion.div
              key={algo.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Link href={algo.href}>
                <div className="group h-full p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition">
                      {algo.icon}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                        algo.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" :
                        algo.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" :
                        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
                    }`}>
                        {algo.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:underline decoration-zinc-400 underline-offset-4 decoration-2">
                    {algo.name}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                    {algo.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
