"use client";

import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { motion } from "framer-motion";
import { GitBranch, Network, Layers } from "lucide-react";

const treeImplementations = [
  { 
      name: "Binary Heaps", 
      description: "Priority queue implementation using arrays (Min/Max Heap).", 
      icon: <Layers className="w-6 h-6" />, 
      href: "/dsa/trees/heaps" 
  },
  { 
      name: "Binary Search Tree (BST)", 
      description: "Ordered binary tree allowing fast search, insert, and delete operations.", 
      icon: <Network className="w-6 h-6" />, 
      href: "/dsa/trees/bst" 
  },
  { 
      name: "AVL Tree", 
      description: "Self-balancing BST that maintains O(log n) height.", 
      icon: <GitBranch className="w-6 h-6" />, 
      href: "/dsa/trees/avl" 
  },
  { 
      name: "Segment Tree", 
      description: "Tree data structure for storing intervals or segments.", 
      icon: <GitBranch className="w-6 h-6" />, 
      href: "/dsa/trees/segment-tree" 
  },
  { 
      name: "Fenwick Tree (BIT)", 
      description: "Data structure that can efficiently update elements and calculate prefix sums.", 
      icon: <GitBranch className="w-6 h-6" />, 
      href: "/dsa/trees/fenwick-tree" 
  },
];

export default function TreesDashboard() {
  return (
    <div className="min-h-screen px-4 py-12">
      {/* Trees Configuration */}
      <div className="max-w-7xl mx-auto">
        <BackButton href="/dsa" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Tree Data Structures
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Visualize hierarchical data structures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {treeImplementations.map((impl, index) => (
            <motion.div
              key={impl.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Link href={impl.href}>
                <div className="group h-full p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition">
                      {impl.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground group-hover:underline decoration-zinc-400 underline-offset-4 decoration-2">
                      {impl.name}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {impl.description}
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
