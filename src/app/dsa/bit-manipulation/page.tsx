"use client";

import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { motion } from "framer-motion";
import { Binary, Calculator } from "lucide-react";

const bitImplementations = [
  { 
      name: "Bitwise Operators", 
      description: "Visualizing standard binary operators: AND, OR, XOR, NOT, Left Shift, Right Shift.", 
      icon: <Binary className="w-6 h-6" />, 
      href: "/dsa/bit-manipulation/operators" 
  },
  { 
      name: "Number Properties", 
      description: "Algorithms to count set bits and check if a number is a power of two using bit tricks.", 
      icon: <Calculator className="w-6 h-6" />, 
      href: "/dsa/bit-manipulation/properties" 
  },
];

export default function BitDashboard() {
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
            Bit Manipulation
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
             Operating directly on binary representations of data for efficiency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {bitImplementations.map((impl, index) => (
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
