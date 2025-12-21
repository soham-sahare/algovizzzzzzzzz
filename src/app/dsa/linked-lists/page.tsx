"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function LinkedListsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <BackButton label="Back to Dashboard" />
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Linked Lists</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">Linear data structures where elements are stored in nodes, connected by pointers.</p>
      </div>

      <div className="space-y-12">
        {/* Types Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-foreground">Types</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <AlgorithmCard 
              name="Singly Linked List" 
              description="Basic linked list with unidirectional pointers." 
              href="/dsa/linked-lists/singly"
              difficulty="Easy"
            />
            <AlgorithmCard 
              name="Doubly Linked List" 
              description="Linked list with bidirectional pointers (prev/next)." 
              href="/dsa/linked-lists/doubly"
              difficulty="Medium"
            />
             <AlgorithmCard 
              name="Circular Linked List" 
              description="Last node points back to the first node." 
              href="/dsa/linked-lists/circular"
              difficulty="Medium"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function AlgorithmCard({ name, description, href, difficulty }: { name: string, description: string, href: string, difficulty: "Easy" | "Medium" | "Hard" }) {
  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -2 }}
        className="h-full p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:border-foreground/50 transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            {difficulty}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm font-medium text-foreground opacity-60 group-hover:opacity-100 transition-opacity">
          Visualize <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
}
