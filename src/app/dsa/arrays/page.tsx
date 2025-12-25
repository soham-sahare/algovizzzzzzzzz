"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Search, Sliders } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function ArraysPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <BackButton label="Back to Dashboard" />
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Arrays</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">Fundamental collection of elements stored at contiguous memory locations.</p>
      </div>

      <div className="space-y-12">
        {/* Fundamentals Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-foreground">Fundamentals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <AlgorithmCard 
              name="Basic Operations" 
              description="Visualize Insert, Delete, Update, and Search operations on dynamic arrays." 
              href="/dsa/arrays/basics"
              difficulty="Easy"
            />
          </div>
        </section>
        {/* Sorting Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-foreground">Sorting Algorithms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <AlgorithmCard 
              name="Bubble Sort" 
              description="Simple comparison-based sorting algorithm." 
              href="/dsa/arrays/sorting/bubble"
              difficulty="Easy"
            />
            <AlgorithmCard 
              name="Selection Sort" 
              description="Repeatedly finds the minimum element and puts it at the beginning." 
              href="/dsa/arrays/sorting/selection"
              difficulty="Easy"
            />
             <AlgorithmCard 
              name="Insertion Sort" 
              description="Builds the sorted array one item at a time." 
              href="/dsa/arrays/sorting/insertion"
              difficulty="Easy"
            />
            <AlgorithmCard 
              name="Quick Sort" 
              description="Efficient divide-and-conquer sorting algorithm." 
              href="/dsa/arrays/sorting/quick"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Merge Sort" 
              description="Stable divide-and-conquer sorting algorithm." 
              href="/dsa/arrays/sorting/merge"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Heap Sort" 
              description="Comparison-based sorting technique based on Binary Heap." 
              href="/dsa/arrays/sorting/heap"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Counting Sort" 
              description="Integer sorting algorithm that counts number of objects." 
              href="/dsa/arrays/sorting/counting"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Radix Sort" 
              description="Non-comparative integer sorting algorithm." 
              href="/dsa/arrays/sorting/radix"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Bucket Sort" 
              description="Distribution sort that scatters elements into buckets." 
              href="/dsa/arrays/sorting/bucket"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Shell Sort" 
              description="Generalization of insertion sort using gaps." 
              href="/dsa/arrays/sorting/shell"
              difficulty="Medium"
            />
          </div>
        </section>

        {/* Searching Section */}
        <section>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-foreground">Searching Algorithms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AlgorithmCard 
              name="Linear Search" 
              description="Sequentially checks each element of the list." 
              href="/dsa/arrays/searching/linear"
              difficulty="Easy"
            />
            <AlgorithmCard 
              name="Binary Search" 
              description="Search a sorted array by repeatedly dividing the search interval in half." 
              href="/dsa/arrays/searching/binary"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Jump Search" 
              description="Searching in sorted arrays by jumping fixed steps." 
              href="/dsa/arrays/searching/jump"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Interpolation Search" 
              description="Improved binary search for uniformly distributed data." 
              href="/dsa/arrays/searching/interpolation"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Exponential Search" 
              description="Find range where element is present, then binary search." 
              href="/dsa/arrays/searching/exponential"
              difficulty="Medium"
            />
          </div>
        </section>

         {/* Techniques Section */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-foreground">Algorithms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AlgorithmCard 
              name="Two Pointers" 
              description="Use two pointers to iterate the array." 
              href="/dsa/arrays/techniques/two-pointers"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Sliding Window" 
              description="Efficiently find subarrays with specific properties." 
              href="/dsa/arrays/techniques/sliding-window"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Kadane's Algorithm" 
              description="Find the maximum sum contiguous subarray in O(n) time." 
              href="/dsa/arrays/techniques/kadanes"
              difficulty="Medium"
            />
            <AlgorithmCard 
              name="Prefix Sum" 
              description="Precompute sums to allow O(1) range sum queries." 
              href="/dsa/arrays/techniques/prefix-sum"
              difficulty="Easy"
            />
             <AlgorithmCard 
              name="Dutch National Flag" 
              description="Sort an array of 0s, 1s, and 2s in one pass." 
              href="/dsa/arrays/techniques/dnf"
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
