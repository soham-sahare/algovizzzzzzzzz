"use client";

import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { motion } from "framer-motion";
import { Calculator, Package, Grid } from "lucide-react";

const dpImplementations = [
  { 
      name: "Fibonacci Sequence", 
      description: "Classic introduction to DP. Compare Recursion, Memoization, and Tabulation.", 
      icon: <Calculator className="w-6 h-6" />, 
      href: "/dsa/dynamic-programming/fibonacci" 
  },
  { 
      name: "0/1 Knapsack Problem", 
      description: "Maximize value within a weight limit. Visualized using a tabulation grid.", 
      icon: <Package className="w-6 h-6" />, 
      href: "/dsa/dynamic-programming/knapsack" 
  },
  { 
      name: "Longest Common Subsequence", 
      description: "Find the longest subsequence present in two sequences. Grid visualization.", 
      icon: <Grid className="w-6 h-6" />, 
      href: "/dsa/dynamic-programming/lcs" 
  },
  { 
      name: "Longest Increasing Subsequence", 
      description: "Find the length of the longest strictly increasing subsequence.", 
      icon: <Grid className="w-6 h-6" />, 
      href: "/dsa/dynamic-programming/lis" 
  },
  { 
      name: "Coin Change Problem", 
      description: "Find minimum number of coins to make a distinct amount.", 
      icon: <Grid className="w-6 h-6" />, 
      href: "/dsa/dynamic-programming/coin-change" 
  },
  { 
      name: "Edit Distance (Levenshtein)", 
      description: "Calculate minimum operations to transform one string into another.", 
      icon: <Grid className="w-6 h-6" />, 
      href: "/dsa/dynamic-programming/edit-distance" 
  },
];

export default function DPDashboard() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <BackButton href="/dsa" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Dynamic Programming
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
             Optimization by breaking problems into simpler sub-problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {dpImplementations.map((impl, index) => (
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
