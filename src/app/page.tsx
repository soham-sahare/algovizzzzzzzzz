"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Zap, ChevronRight, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-background to-background dark:from-zinc-900/20 dark:via-background dark:to-background">
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
             <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                Master Algorithms <br />
                <span className="text-zinc-400 dark:text-zinc-500">
                   Visually & Interactively
                </span>
             </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A developer-first platform to visualize, debug, and understand complex data structures. Built for specific, high-performance learning.
          </motion.p>

          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <Link 
              href="/dsa" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium text-sm transition-transform hover:scale-105"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
             <Link 
              href="/about" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground rounded-full font-medium text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              How it works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-5 h-5 text-foreground" />}
              title="Real-time Visualization"
              description="High-performance animations running at 60fps. Visualize sorting, graph traversals, and tree operations instantly."
            />
            <FeatureCard 
              icon={<Terminal className="w-5 h-5 text-foreground" />}
              title="Interactive Code"
              description="Write custom test cases and see line-by-line execution. Bridge the gap between theory and implementation."
            />
            <FeatureCard 
              icon={<Cpu className="w-5 h-5 text-foreground" />}
              title="Deep Dive Mode"
              description="Access detailed time complexity analysis (Big O), edge cases, and memory usage patterns for every algorithm."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-sm text-muted-foreground">
          Created with <span className="text-red-500">♥</span> by{" "}
          <Link 
            href="https://sohamsahare.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            sohamsahare
          </Link>
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="mb-4 p-2 bg-zinc-100 dark:bg-zinc-900 rounded-md w-fit border border-zinc-200 dark:border-zinc-800">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
