"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import HashProbingVisualizer from "@/components/visualizations/HashProbingVisualizer";
import { generateProbingInsertSteps, generateProbingDeleteSteps, ProbingStep } from "@/lib/algorithms/hashing/openAddressing";
import { Play, Pause, RotateCcw, Plus, Trash } from "lucide-react";

const CODES = {
    insert: `function insert(arr, val):
  index = val % size
  while arr[index] is occupied:
    index = (index + 1) % size
  arr[index] = val`,
    delete: `function delete(arr, val):
  index = val % size
  while arr[index] != empty:
    if arr[index] == val:
      arr[index] = TOMBSTONE
      return
    index = (index + 1) % size`
};

export default function OpenAddressingPage() {
    const [inputValue, setInputValue] = useState("");
    const [tableSize, setTableSize] = useState(11);
    const [array, setArray] = useState<number[]>(Array(11).fill(-1));
    const [mode, setMode] = useState<'INSERT' | 'DELETE'>('INSERT');
    
    const [steps, setSteps] = useState<ProbingStep[]>([]);
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
                         // Persist final state
                         const finalArr = steps[steps.length - 1].array;
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
        activeIndex: undefined,
        probingIndex: undefined,
        message: "Enter a value",
        lineNumber: undefined
    };

    const handleRun = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        
        if (isProcessing) return;
        setIsProcessing(true);
        
        const gen = mode === 'INSERT' 
            ? generateProbingInsertSteps(array, val, tableSize) 
            : generateProbingDeleteSteps(array, val, tableSize);
            
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setArray(Array(tableSize).fill(-1));
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Table Reset");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/hashing" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Linear Probing</h1>
                 <p className="text-muted-foreground">Collision resolution using linear search and tombstones for deletion.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[300px] flex items-center justify-center">
                        <HashProbingVisualizer 
                            array={stepData.array}
                            activeIndex={stepData.activeIndex}
                            probingIndex={stepData.probingIndex}
                        />
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
                         
                         <div className="flex gap-2 mb-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                            {(['INSERT', 'DELETE'] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => { setMode(m); setSteps([]); setIsPlaying(false); setIsProcessing(false); }}
                                    className={`flex-1 p-2 rounded-md flex justify-center items-center gap-2 text-xs font-bold transition ${mode === m ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                                >
                                    {m === 'INSERT' ? <Plus className="w-4 h-4"/> : <Trash className="w-4 h-4"/>}
                                    {m}
                                </button>
                            ))}
                        </div>

                        <CodeHighlight code={CODES[mode.toLowerCase() as keyof typeof CODES]} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Value</label>
                                     <input 
                                        value={inputValue} 
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder="Enter number"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50 ${mode === 'INSERT' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                    <Play className="w-4 h-4" /> Run {mode}
                                </button>
                                
                                <hr className="border-zinc-200 dark:border-zinc-700/50" />

                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Table Size</label>
                                    <input 
                                        type="number" 
                                        min="3" 
                                        max="20" 
                                        value={tableSize} 
                                        onChange={(e) => {
                                            const s = Math.min(20, Math.max(3, parseInt(e.target.value) || 7));
                                            setTableSize(s);
                                            handleReset();
                                        }}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        disabled={isProcessing}
                                    />
                                </div>
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
