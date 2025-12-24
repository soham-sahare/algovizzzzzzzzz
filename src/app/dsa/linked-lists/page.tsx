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
              name="List Operations (CRUD)" 
              description="Comprehensive Create, Read, Update, Delete for Singly, Doubly, and Circular Lists." 
              href="/dsa/linked-lists/crud"
              difficulty="Easy"
            />
             <AlgorithmCard 
              name="List Operations (CRUD)" 
              description="Comprehensive Create, Read, Update, Delete for Singly, Doubly, and Circular Lists." 
              href="/dsa/linked-lists/crud"
              difficulty="Easy"
            />
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

      <div className="space-y-12 mt-12">
        {/* Advanced Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-foreground">Advanced Algorithms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <AlgorithmCard 
              name="Reversal Algorithms" 
              description="Iterative, recursive, and K-group reversal techniques." 
              href="/dsa/linked-lists/challenges/reversal"
              difficulty="Hard"
            />
            <AlgorithmCard 
              name="Cycle Detection" 
              description="Detect cycles using Floyd's Cycle-Finding Algorithm." 
              href="/dsa/linked-lists/challenges/cycle"
              difficulty="Hard"
            />
             <AlgorithmCard 
              name="Intersection of Two Lists" 
              description="Find the node where two linked lists merge." 
              href="/dsa/linked-lists/challenges/intersection"
              difficulty="Medium"
            />
             <AlgorithmCard 
              name="Union of Two Lists" 
              description="Create a new list with unique elements from two lists." 
              href="/dsa/linked-lists/challenges/union"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Merge Operations" 
              description="Merge sorted lists, K-sorted lists, and alternating merge." 
              href="/dsa/linked-lists/challenges/merge"
              difficulty="Hard"
            />
            <AlgorithmCard 
              name="Palindrome Operations" 
              description="Check palindrome and convert to palindrome." 
              href="/dsa/linked-lists/challenges/palindrome"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Reordering Operations" 
              description="Remove Nth node, Rotate list, Swap pairs, Odd-Even reordering." 
              href="/dsa/linked-lists/challenges/reordering"
              difficulty="Hard"
            />
            <AlgorithmCard 
              name="Sorting Algorithms" 
              description="Merge Sort and Insertion Sort on Linked Lists." 
              href="/dsa/linked-lists/challenges/sorting"
              difficulty="Hard"
            />
            <AlgorithmCard 
              name="Cloning Algorithms" 
              description="Deep Copy and Clone with Random Pointer." 
              href="/dsa/linked-lists/challenges/cloning"
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
