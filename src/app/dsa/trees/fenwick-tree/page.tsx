"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateFenwickTreeBuildSteps, generateFenwickTreeQuerySteps, generateFenwickTreeUpdateSteps, FenwickTreeStep } from "@/lib/algorithms/tree/fenwickTree";
import { Play, Pause, RotateCcw, Search, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function FenwickTreePage() {
    const [inputValue, setInputValue] = useState("1, 2, 3, 4, 5, 6, 7, 8");
    const [arr, setArr] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
    
    // Ops
    const [queryIdx, setQueryIdx] = useState("5");
    const [updateIdx, setUpdateIdx] = useState("3");
    const [updateDelta, setUpdateDelta] = useState("2");

    const [steps, setSteps] = useState<FenwickTreeStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    // Initial Build
    useEffect(() => {
        const gen = generateFenwickTreeBuildSteps(arr);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [arr]);

    // Playback
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
        } else if (isPlaying && currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps, speed]);

    const handleUpdateArray = () => {
        const a = inputValue.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (a.length > 0) setArr(a);
    };

    const runQuery = () => {
        const qi = parseInt(queryIdx);
        if (isNaN(qi)) return;
        
        const lastStep = steps[steps.length-1];
        if(!lastStep) return;

        const gen = generateFenwickTreeQuerySteps(lastStep.tree, lastStep.array, qi);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const runUpdate = () => {
        const idx = parseInt(updateIdx);
        const delta = parseInt(updateDelta);
        if (isNaN(idx) || isNaN(delta)) return;

        const lastStep = steps[steps.length-1];
        if(!lastStep) return;

        const gen = generateFenwickTreeUpdateSteps(lastStep.tree, lastStep.array, idx, delta);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const step = steps[currentStep];
    if (!step) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/trees" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Fenwick Tree (BIT)</h1>
                 <p className="text-muted-foreground">Binary Indexed Tree for efficient Prefix Sums and Updates.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center gap-8">
                         
                         {/* Tree Array */}
                         <div>
                            <p className="text-xs uppercase font-bold text-muted-foreground mb-2">Internal Tree Array (1-based)</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {step.tree.map((val, i) => {
                                    if (i === 0) return null; // Skip 0 index for BIT visualization usually
                                    const isHighlighted = step.highlightedIndices.includes(i);
                                    
                                    return (
                                        <div key={i} className="flex flex-col items-center">
                                            <motion.div 
                                                animate={{ 
                                                    scale: isHighlighted ? 1.2 : 1,
                                                    backgroundColor: isHighlighted ? "#dbeafe" : "#ffffff",
                                                    borderColor: isHighlighted ? "#3b82f6" : "#e4e4e7"
                                                }}
                                                className={`w-10 h-10 border-2 rounded flex items-center justify-center text-sm font-mono dark:bg-zinc-800 dark:text-zinc-200`}
                                            >
                                                {val}
                                            </motion.div>
                                            <span className="text-[10px] text-zinc-400">{i}</span>
                                        </div>
                                    );
                                })}
                            </div>
                         </div>
                         
                         {/* Conceptual Links ? Hard to draw dynamically without canvas/svg. */}
                         <div className="text-xs text-muted-foreground max-w-lg text-center">
                             BIT Index `i` covers range `[i - (i&-i) + 1, i]`. <br/>
                             Parent for update: `i += i & -i`. Parent for query: `i -= i & -i`.
                         </div>

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
                        {/* Initial Array */}
                        <div>
                            <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Init Array</label>
                             <div className="flex gap-2">
                                <input 
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-sm"
                                    value={inputValue} onChange={e=>setInputValue(e.target.value)}
                                />
                                <button onClick={handleUpdateArray} className="bg-zinc-200 px-3 rounded text-sm hover:bg-zinc-300">Set</button>
                             </div>
                        </div>

                        <hr className="border-zinc-200 dark:border-zinc-700"/>

                        {/* Query */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase text-zinc-500 font-bold">Prefix Sum Query</label>
                            <div className="flex gap-2">
                                <input className="w-full p-1 rounded border text-sm" placeholder="Index (0-based)" value={queryIdx} onChange={e=>setQueryIdx(e.target.value)} />
                                <button onClick={runQuery} className="flex-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex items-center justify-center gap-1 px-4">
                                    <Search className="w-3 h-3"/> Sum(0..i)
                                </button>
                            </div>
                        </div>

                        {/* Update */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase text-zinc-500 font-bold">Update (Add Delta)</label>
                            <div className="flex gap-2">
                                <input className="w-16 p-1 rounded border text-sm" placeholder="Idx" value={updateIdx} onChange={e=>setUpdateIdx(e.target.value)} />
                                <input className="w-16 p-1 rounded border text-sm" placeholder="Delta" value={updateDelta} onChange={e=>setUpdateDelta(e.target.value)} />
                                <button onClick={runUpdate} className="flex-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1">
                                    <Edit className="w-3 h-3"/> Add
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
