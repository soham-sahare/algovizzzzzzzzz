"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateFibTabulationSteps, DPStep } from "@/lib/algorithms/dp/fibonacci";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FIB_CODE = `function fib(n):
  dp = [0] * (n + 1)
  dp[1] = 1
  for i from 2 to n:
    dp[i] = dp[i-1] + dp[i-2]
  return dp[n]`;

export default function FibonacciPage() {
    const [n, setN] = useState(6);
    const [steps, setSteps] = useState<DPStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("Ready to run Fibonacci");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Playback
    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        setIsProcessing(false);
                        setMessage("Complete");
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        table: new Array(n + 1).fill(0),
        activeIndices: [],
        highlightedIndices: [],
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateFibTabulationSteps(n);
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Reset");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/dynamic-programming" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Fibonacci Sequence</h1>
                 <p className="text-muted-foreground">Generating the Nth Fibonacci number using Bottom-Up Tabulation.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="flex justify-center flex-wrap gap-2 border rounded-lg bg-white dark:bg-zinc-900/50 p-8 min-h-[300px] items-end">
                        <AnimatePresence>
                            {stepData.table.map((val, i) => {
                                const isActive = stepData.activeIndices?.includes(i);
                                const isHighlighted = stepData.highlightedIndices?.includes(i);
                                
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ 
                                            opacity: 1, 
                                            height: Math.max(40, val * 10), // Scale height
                                            backgroundColor: isActive ? "#FCD34D" : isHighlighted ? "#A7F3D0" : "#E5E7EB"
                                        }}
                                        className="w-12 rounded-t-lg bg-zinc-200 dark:bg-zinc-800 flex flex-col justify-end items-center pb-2 relative border border-zinc-300 dark:border-zinc-700"
                                    >
                                        <span className={`font-bold ${isActive ? "text-yellow-800" : isHighlighted ? "text-green-800" : "text-zinc-600 dark:text-zinc-400"}`}>
                                            {val}
                                        </span>
                                        <span className="absolute -bottom-6 text-xs text-zinc-400">
                                            {i}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                     </div>

                    {/* Status */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{stepData.message || message}</span></span>
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                disabled={!isProcessing} 
                                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full disabled:opacity-50"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                             <div className="flex items-center gap-2">
                                <span className="text-xs">Speed</span>
                                <input 
                                    type="range" 
                                    min="100" 
                                    max="1000" 
                                    step="100"
                                    value={1100 - speed} 
                                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                                    className="w-20 h-1 bg-zinc-300 rounded-full appearance-none cursor-pointer"
                                />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <div className="sticky top-6">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                        <CodeHighlight code={FIB_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">N (Example Size)</label>
                                    <input 
                                        type="number" 
                                        min="2" 
                                        max="15" 
                                        value={n} 
                                        onChange={(e) => setN(Math.min(15, Math.max(2, parseInt(e.target.value) || 2)))}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run Tabulation
                                </button>
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
