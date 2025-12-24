"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import DPGridVisualizer from "@/components/visualizations/DPGridVisualizer";
import { generateKnapsackSteps, GridStep } from "@/lib/algorithms/dp/knapsack";
import { Play, Pause, RotateCcw } from "lucide-react";

const KNAPSACK_CODE = `function knapsack(W, wt, val, n):
  dp = table(n+1, W+1, 0)
  
  for i from 1 to n:
    for w from 0 to W:
      if wt[i-1] <= w:
        dp[i][w] = max(
          val[i-1] + dp[i-1][w-wt[i-1]], 
          dp[i-1][w]
        )
      else:
        dp[i][w] = dp[i-1][w]
        
  return dp[n][W]`;

export default function KnapsackPage() {
    const [weights, setWeights] = useState("1, 3, 4, 5");
    const [values, setValues] = useState("1, 4, 5, 7");
    const [capacity, setCapacity] = useState(7);
    
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
            const wArr = weights.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
            const vArr = values.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
            
            if (wArr.length !== vArr.length) {
                setMessage("Error: Weights and Values count mismatch");
                setIsProcessing(false);
                return;
            }

            const gen = generateKnapsackSteps(wArr, vArr, capacity);
            const newSteps = Array.from(gen);
            setSteps(newSteps);
            setCurrentStep(0);
            setIsPlaying(true);
        } catch (e) {
            setMessage("Invalid Input");
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
    const wArr = weights.split(",").map(x => x.trim());
    const rowLabels = ["-", ...wArr.map((w, i) => `Item ${i+1} (${w}kg)`)];
    const colLabels = Array.from({ length: capacity + 1 }, (_, i) => `${i}`);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/dynamic-programming" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">0/1 Knapsack Problem</h1>
                 <p className="text-muted-foreground">Maximize total value in a knapsack of capacity W.</p>
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
                        <CodeHighlight code={KNAPSACK_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-zinc-500 font-bold">Weights (comma sep)</label>
                                    <input 
                                        value={weights} 
                                        onChange={(e) => setWeights(e.target.value)}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-zinc-500 font-bold">Values (comma sep)</label>
                                    <input 
                                        value={values} 
                                        onChange={(e) => setValues(e.target.value)}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-zinc-500 font-bold">Capacity</label>
                                    <input 
                                        type="number"
                                        value={capacity} 
                                        onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
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
