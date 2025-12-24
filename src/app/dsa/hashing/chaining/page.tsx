"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import HashChainingVisualizer from "@/components/visualizations/HashChainingVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { ChainingNode, ChainingStep, generateChainingInsertSteps, generateChainingDeleteSteps } from "@/lib/algorithms/hashing/separateChaining";
import { Play, Pause, RotateCcw, Plus, Trash } from "lucide-react";

export default function SeparateChainingPage() {
    // ... setup ...
    const [tableSize, setTableSize] = useState(7);
    const [buckets, setBuckets] = useState<ChainingNode[][]>(Array.from({ length: 7 }, () => []));
    const [inputVal, setInputVal] = useState(10);
    const [mode, setMode] = useState<'INSERT' | 'DELETE'>('INSERT');

    const [steps, setSteps] = useState<ChainingStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("Ready");
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
                        // Persist
                        setBuckets(steps[steps.length - 1].buckets);
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const handleRun = (op: 'INSERT' | 'DELETE') => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = op === 'INSERT' 
            ? generateChainingInsertSteps(buckets, inputVal, tableSize) 
            : generateChainingDeleteSteps(buckets, inputVal, tableSize);
        
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setBuckets(Array.from({ length: tableSize }, () => []));
        setSteps([]);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Table Reset");
    };

    const stepData = steps.length > 0 ? steps[currentStep] : {
        buckets: buckets,
        activeBucket: null,
        activeNode: undefined,
        message: "Enter a number",
        lineNumber: undefined
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/hashing" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Separate Chaining</h1>
                 <p className="text-muted-foreground">Collision resolution technique using linked lists in each bucket.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[400px]">
                        <HashChainingVisualizer 
                            buckets={stepData.buckets}
                            activeBucket={stepData.activeBucket}
                            activeNode={stepData.activeNode}
                        />
                     </div>

                    {/* Status */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-purple-600 dark:text-purple-400 font-bold">{stepData.message || message}</span></span>
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
                         
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Key (Number)</label>
                                    <input 
                                        type="number"
                                        value={inputVal} 
                                        onChange={(e) => setInputVal(parseInt(e.target.value))}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={() => handleRun('INSERT')} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Plus className="w-4 h-4" /> Insert
                                </button>
                                <button onClick={() => handleRun('DELETE')} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Trash className="w-4 h-4" /> Delete
                                </button>
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset Table
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
