"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Layers, 
  GitBranch, 
  Database, 
  Server, 
  Trees, 
  Network, 
  Hash, 
  Cpu, 
  Type, 
  Binary, 
  Share2, 
  RefreshCcw 
} from "lucide-react";

const categories = [
  { name: "Arrays", description: "Static & dynamic arrays, sorting, searching techniques.", icon: <Layers />, href: "/dsa/arrays" },
  { name: "Linked Lists", description: "Singly, doubly, circular lists and their operations.", icon: <GitBranch />, href: "/dsa/linked-lists" },
  { name: "Stacks", description: "LIFO structures, expression parsing, recursion simulations.", icon: <Database />, href: "/dsa/stacks" },
  { name: "Queues", description: "FIFO structures, priority queues, circular buffers.", icon: <Server />, href: "/dsa/queues" },
  { name: "Trees", description: "Binary trees, BST, AVL, heaps, tries and traversals.", icon: <Trees />, href: "/dsa/trees" },
  { name: "Graphs", description: "BFS, DFS, shortest paths, MST, network flow.", icon: <Network />, href: "/dsa/graphs" },
  { name: "Hashing", description: "Hash tables, collision resolution, caching strategies.", icon: <Hash />, href: "/dsa/hashing" },
  { name: "Dynamic Programming", description: "Optimization problems, memoization, tabulation.", icon: <Cpu />, href: "/dsa/dynamic-programming" },
  { name: "Strings", description: "Pattern matching, manipulation, parsing algorithms.", icon: <Type />, href: "/dsa/strings" },
  { name: "Greedy Algorithms", description: "Local optimization strategies, Huffman coding.", icon: <Share2 />, href: "/dsa/greedy" },
  { name: "Backtracking", description: "Sudoku, N-Queens, combinatorial search problems.", icon: <RefreshCcw />, href: "/dsa/backtracking" },
  { name: "Bit Manipulation", description: "Bitwise operators, binary optimization tricks.", icon: <Binary />, href: "/dsa/bit-manipulation" },
];

export default function DSAPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            DSA Library
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore our comprehensive collection of data structures and algorithms. 
            Select a category to start visualizing and learning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ category, index }: { category: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Link href={category.href}>
        <div className="group h-full p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground">
              {category.icon}
            </div>
            <h2 className="text-lg font-semibold text-foreground group-hover:underline decoration-zinc-400 underline-offset-4 decoration-2">
              {category.name}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {category.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
