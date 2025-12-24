"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import StringVisualizer from "@/components/visualizations/StringVisualizer"; // Reusing generic visualizer
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateArrayCRUDSteps, ArrayCRUDStep } from "@/lib/algorithms/arrays/crud";
import { Play, Pause, RotateCcw, Plus, Trash, Edit } from "lucide-react";

export default function ArrayCRUDPage() {
    const [array, setArray] = useState<number[]>([12, 45, 7, 23, 56]);
    const [inputIndex, setInputIndex] = useState(1);
    const [inputValue, setInputValue] = useState(99);
    
    // UI Mode tracking, not algo mode
    const [mode, setMode] = useState<'INSERT' | 'DELETE' | 'UPDATE'>('INSERT');

    const [steps, setSteps] = useState<ArrayCRUDStep[]>([]);
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
                        // Update the persistent array
                        const finalArr = steps[steps.length - 1].array.filter((n): n is number => n !== null);
                        setArray(finalArr);
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        array: array,
        highlightIndices: [],
        pointers: [],
        message: "Select an operation",
        lineNumber: undefined
    };

    const handleRun = (op: 'INSERT' | 'UPDATE' | 'DELETE_INDEX' | 'DELETE_VALUE') => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateArrayCRUDSteps(array, op, op === 'DELETE_VALUE' ? inputValue : inputIndex, inputValue);
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setArray([12, 45, 7, 23, 56]);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Reset Array");
    };

    // Reusing StringVisualizer by converting numbers to strings for display is easiest
    const visData = stepData.array.map(n => n === null ? "" : n.toString());
    
    // We need to map string visualizer highlights properly
    const highlights = stepData.highlightIndices.length > 0 ? [{ stringId: 'arr', indices: stepData.highlightIndices }] : [];
    const pointers = stepData.pointers.map(p => ({ ...p, id: p.label, stringId: 'arr' })); // Added ID

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/arrays" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Array Operations (CRUD)</h1>
                 <p className="text-muted-foreground">Visualize Insertion, Deletion, and Updates in a contiguous memory block.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[300px] flex items-center justify-center overflow-auto">
                         {/* We construct a "string" where each char is actually an element. 
                             Wait, StringVisualizer splits by char. That won't work for multi-digit numbers.
                             I need to make StringVisualizer accept an array of strings/numbers, OR just map generic divs here. 
                             I'll map generic divs here for simplicity as I don't want to refactor StringVisualizer again.
                         */}
                         <div className="flex gap-2">
                             {stepData.array.map((val, idx) => {
                                 const isHighlighted = stepData.highlightIndices.includes(idx);
                                 const ptr = stepData.pointers.find(p => p.index === idx);
                                 
                                 return (
                                     <div key={idx} className="relative flex flex-col items-center gap-1">
                                          <div 
                                            className={`
                                                w-12 h-12 flex items-center justify-center border-2 rounded text-lg font-bold shadow-sm transition-all
                                                ${val === null ? "bg-zinc-200 border-dashed border-zinc-400" : (isHighlighted ? "bg-yellow-100 border-yellow-500 scale-110" : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700")}
                                            `}
                                          >
                                              {val}
                                          </div>
                                          <span className="text-xs font-mono text-zinc-400">{idx}</span>
                                          {ptr && (
                                              <div className={`absolute -top-8 text-xs font-bold px-1 rounded text-white ${ptr.color} animate-bounce`}>
                                                  {ptr.label}
                                              </div>
                                          )}
                                     </div>
                                 )
                             })}
                         </div>
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
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Value</label>
                                    <input 
                                        type="number"
                                        value={inputValue} 
                                        onChange={(e) => setInputValue(parseInt(e.target.value))}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Index</label>
                                    <input 
                                        type="number"
                                        value={inputIndex} 
                                        onChange={(e) => setInputIndex(parseInt(e.target.value))}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={() => handleRun('INSERT')} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Plus className="w-4 h-4" /> Insert at Index
                                </button>
                                <button onClick={() => handleRun('UPDATE')} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Edit className="w-4 h-4" /> Update at Index
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleRun('DELETE_INDEX')} disabled={isProcessing} className="flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-xs font-medium transition disabled:opacity-50">
                                        <Trash className="w-3 h-3" /> Del Index
                                    </button>
                                    <button onClick={() => handleRun('DELETE_VALUE')} disabled={isProcessing} className="flex items-center justify-center gap-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded text-xs font-medium transition disabled:opacity-50">
                                        <Trash className="w-3 h-3" /> Del Value
                                    </button>
                                </div>
                                
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset Array
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
