"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateLISSteps, LISStep } from "@/lib/algorithms/dp/lis";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function LISPage() {
    const [inputValue, setInputValue] = useState("10, 9, 2, 5, 3, 7, 101, 18");
    const [nums, setNums] = useState<number[]>([10, 9, 2, 5, 3, 7, 101, 18]);
    
    const [steps, setSteps] = useState<LISStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    
    useEffect(() => {
        const gen = generateLISSteps(nums);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [nums]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
        } else if (isPlaying && currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps, speed]);

    const handleSetArray = () => {
        const arr = inputValue.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (arr.length > 0) {
            setNums(arr);
        }
    };

    const step = steps[currentStep];

    if (!step) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/dynamic-programming" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Longest Increasing Subsequence (LIS)</h1>
                 <p className="text-muted-foreground">Find the length of the longest subsequence that is strictly increasing.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center gap-8">
                        
                        {/* Array Visualization */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {step.array.map((val, idx) => {
                                const isActive = step.activeIndices.includes(idx);
                                const isHighlighted = step.highlightedIndices.includes(idx);
                                const isCurrent = step.currentIndex === idx;
                                const isCompare = step.compareIndex === idx;
                                const inFinalPath = step.lisPath?.includes(idx);

                                let borderColor = "border-zinc-300 dark:border-zinc-600";
                                let bgColor = "bg-white dark:bg-zinc-800";
                                
                                if (inFinalPath) {
                                    borderColor = "border-green-500";
                                    bgColor = "bg-green-100 dark:bg-green-900/30";
                                } else if (isCurrent) {
                                    borderColor = "border-indigo-500";
                                    bgColor = "bg-indigo-100 dark:bg-indigo-900/30";
                                } else if (isCompare) {
                                    borderColor = "border-yellow-500";
                                    bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
                                }

                                return (
                                    <div key={idx} className="flex flex-col items-center gap-1">
                                        <motion.div 
                                            animate={{ scale: isActive ? 1.1 : 1 }}
                                            className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg font-bold text-lg ${borderColor} ${bgColor}`}
                                        >
                                            {val}
                                        </motion.div>
                                        <div className="text-xs text-muted-foreground">{idx}</div>
                                        {/* DP Value */}
                                        <div className="w-8 h-6 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded text-xs">
                                            {step.dp[idx]}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-xs text-muted-foreground">Row 1: Values | Row 2: Index | Row 3: LIS Length ending here</div>

                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground">{step.message}</span>
                            <span className="text-xs text-muted-foreground">{step.description}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <input 
                                type="range" 
                                min="100" max="1000" step="100" 
                                value={1100 - speed} 
                                onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                                className="w-20"
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Input Array</label>
                        <textarea 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm font-mono h-24 resize-none"
                        />
                        <button onClick={handleSetArray} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition">
                            Update Array
                        </button>
                        <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-bold mb-1">Complexity</p>
                        <p>Time: O(N²)</p>
                        <p>Space: O(N)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
