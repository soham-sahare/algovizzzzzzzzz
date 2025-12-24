"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpDown, BarChart3, Shuffle, Layers, SortAsc, Hash, Filter, AlignJustify } from "lucide-react"; // Icons
import BackButton from "@/components/ui/BackButton";

const sortingAlgorithms = [
    {
        name: "Bubble Sort",
        description: "Simple comparison-based algorithm that repeatedly swaps adjacent elements if they are in the wrong order.",
        difficulty: "Easy",
        icon: <ArrowUpDown className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/bubble"
    },
    {
        name: "Selection Sort",
        description: "In-place comparison sort that divides the input list into a sorted and an unsorted region.",
        difficulty: "Easy",
        icon: <Shuffle className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/selection"
    },
    {
        name: "Insertion Sort",
        description: "Builds the final sorted array one item at a time.",
        difficulty: "Easy",
        icon: <AlignJustify className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/insertion"
    },
    {
        name: "Merge Sort",
        description: "Divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
        difficulty: "Medium",
        icon: <Layers className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/merge"
    },
    {
        name: "Quick Sort",
        description: "Divide and conquer algorithm that picks an element as pivot and partitions the given array around the picked pivot.",
        difficulty: "Medium",
        icon: <SortAsc className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/quick"
    },
    {
        name: "Heap Sort",
        description: "Comparison-based sorting technique based on Binary Heap data structure.",
        difficulty: "Medium",
        icon: <BarChart3 className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/heap"
    },
    {
        name: "Counting Sort",
        description: "Integer sorting algorithm that operates by counting the number of objects that have each distinct key value.",
        difficulty: "Medium",
        icon: <Hash className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/counting"
    },
    {
        name: "Radix Sort",
        description: "Non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits.",
        difficulty: "Hard",
        icon: <Filter className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/radix"
    },
    {
        name: "Bucket Sort",
        description: "Distribution sort that distributes elements into buckets, sorts buckets individually, and concatenates.",
        difficulty: "Medium",
        icon: <Layers className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/bucket"
    },
    {
        name: "Shell Sort",
        description: "Optimization of insertion sort that exchanges elements apart to reduce position shifts.",
        difficulty: "Medium",
        icon: <SortAsc className="w-6 h-6" />,
        href: "/dsa/arrays/sorting/shell"
    },
    // Radix, Bucket, Shell will be added here
];

export default function SortingDashboard() {
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
            Sorting Algorithms
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Visualize how different algorithms organize data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortingAlgorithms.map((algo, index) => (
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
