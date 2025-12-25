"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateSegmentTreeSteps, generateSegmentTreeQuerySteps, generateSegmentTreeUpdateSteps, SegmentTreeStep } from "@/lib/algorithms/tree/segmentTree";
import { Play, Pause, RotateCcw, Search, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function SegmentTreePage() {
    const [inputValue, setInputValue] = useState("1, 3, 5, 7, 9, 11");
    const [arr, setArr] = useState<number[]>([1, 3, 5, 7, 9, 11]);
    
    // Ops
    const [queryStart, setQueryStart] = useState("1");
    const [queryEnd, setQueryEnd] = useState("3");
    const [updateIdx, setUpdateIdx] = useState("2");
    const [updateVal, setUpdateVal] = useState("6");

    const [steps, setSteps] = useState<SegmentTreeStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    // Initial Build
    useEffect(() => {
        const gen = generateSegmentTreeSteps(arr);
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
        const qs = parseInt(queryStart);
        const qe = parseInt(queryEnd);
        if (isNaN(qs) || isNaN(qe)) return;
        
        // Use current state from last step as base?
        const lastStep = steps[steps.length-1];
        if(!lastStep) return;

        const gen = generateSegmentTreeQuerySteps(lastStep.tree, lastStep.array, qs, qe);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const runUpdate = () => {
        const idx = parseInt(updateIdx);
        const val = parseInt(updateVal);
        if (isNaN(idx) || isNaN(val)) return;

        const lastStep = steps[steps.length-1];
        if(!lastStep) return;

        const gen = generateSegmentTreeUpdateSteps(lastStep.tree, lastStep.array, idx, val);
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">Segment Tree</h1>
                 <p className="text-muted-foreground">Range Queries and Point Updates in O(log N).</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center overflow-auto relative">
                         {/* Tree Visualization: Simple Layered approach */}
                         <div className="flex flex-col items-center gap-8">
                            {/* Render levels? Hard without calculating depth. */}
                            {/* Simple Hack: Grid layout or just render all nodes that are non-null */}
                            {/* Better: Render the array representation with index labels */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {step.tree.map((val, i) => {
                                    if (val === null) return null;
                                    const isHighlighted = step.highlightedNodes.includes(i);
                                    return (
                                        <div key={i} className="flex flex-col items-center">
                                            <motion.div 
                                                animate={{ 
                                                    scale: isHighlighted ? 1.2 : 1,
                                                    borderColor: isHighlighted ? "#ef4444" : "#e4e4e7"
                                                }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white dark:bg-zinc-800 text-xs font-bold transition-colors`}
                                            >
                                                {val}
                                            </motion.div>
                                            <span className="text-[10px] text-muted-foreground">{i}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">Tree Concept (Array Representation)</p>
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
                            <label className="text-xs uppercase text-zinc-500 font-bold">Range Sum Query</label>
                            <div className="flex gap-2">
                                <input className="w-16 p-1 rounded border text-sm" placeholder="Start" value={queryStart} onChange={e=>setQueryStart(e.target.value)} />
                                <input className="w-16 p-1 rounded border text-sm" placeholder="End" value={queryEnd} onChange={e=>setQueryEnd(e.target.value)} />
                                <button onClick={runQuery} className="flex-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex items-center justify-center gap-1">
                                    <Search className="w-3 h-3"/> Query
                                </button>
                            </div>
                        </div>

                        {/* Update */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs uppercase text-zinc-500 font-bold">Point Update</label>
                            <div className="flex gap-2">
                                <input className="w-16 p-1 rounded border text-sm" placeholder="Idx" value={updateIdx} onChange={e=>setUpdateIdx(e.target.value)} />
                                <input className="w-16 p-1 rounded border text-sm" placeholder="Val" value={updateVal} onChange={e=>setUpdateVal(e.target.value)} />
                                <button onClick={runUpdate} className="flex-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1">
                                    <Edit className="w-3 h-3"/> Update
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
