"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import DPGridVisualizer from "@/components/visualizations/DPGridVisualizer";
import { generateLCSSteps } from "@/lib/algorithms/dp/lcs";
import { GridStep } from "@/lib/algorithms/dp/knapsack";
import { Play, Pause, RotateCcw } from "lucide-react";

const LCS_CODE = `function lcs(s1, s2):
  m, n = len(s1), len(s2)
  dp = table(m+1, n+1, 0)
  
  for i from 1 to m:
    for j from 1 to n:
      if s1[i-1] == s2[j-1]:
        dp[i][j] = 1 + dp[i-1][j-1]
      else:
        dp[i][j] = max(
          dp[i-1][j], 
          dp[i][j-1]
        )
        
  return dp[m][n]`;

export default function LCSPage() {
    const [str1, setStr1] = useState("ABDACE");
    const [str2, setStr2] = useState("BABCE");
    
    const [steps, setSteps] = useState<GridStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [message, setMessage] = useState("Ready to run");
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
        grid: [],
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        
        try {
            const s1 = str1.trim();
            const s2 = str2.trim();
            
            if (!s1 || !s2) {
                setMessage("Please enter characters");
                setIsProcessing(false);
                return;
            }

            const gen = generateLCSSteps(s1, s2);
            const newSteps = Array.from(gen);
            setSteps(newSteps);
            setCurrentStep(0);
            setIsPlaying(true);
        } catch (e) {
            setMessage("Error");
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Reset");
    };

    // Prepare labels
    const s1Chars = str1.trim().split("");
    const s2Chars = str2.trim().split("");
    const rowLabels = ["-", ...s1Chars];
    const colLabels = ["-", ...s2Chars];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/dynamic-programming" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Longest Common Subsequence</h1>
                 <p className="text-muted-foreground">Find longest subsequence common to both strings.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="flex justify-center border rounded-lg bg-zinc-50 dark:bg-zinc-900/50 p-4 min-h-[400px]">
                        {stepData.grid.length > 0 ? (
                            <div className="overflow-x-auto w-full">
                                <DPGridVisualizer 
                                    grid={stepData.grid}
                                    rowLabels={rowLabels}
                                    colLabels={colLabels}
                                    activeCell={stepData.activeCell}
                                    highlightedCells={stepData.highlightedCells}
                                    comparingCells={stepData.comparingCells}
                                    cellSize={40}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center text-zinc-400">
                                Enter inputs and click Run
                            </div>
                        )}
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
                        <CodeHighlight code={LCS_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-zinc-500 font-bold">String 1</label>
                                    <input 
                                        value={str1} 
                                        onChange={(e) => setStr1(e.target.value)}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-zinc-500 font-bold">String 2</label>
                                    <input 
                                        value={str2} 
                                        onChange={(e) => setStr2(e.target.value)}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run Algorithm
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
