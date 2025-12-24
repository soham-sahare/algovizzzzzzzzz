"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import BitVisualizer from "@/components/visualizations/BitVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateCountSetBitsSteps, generatePowerOfTwoSteps, BitStep } from "@/lib/algorithms/bit/basics";
import { Play, Pause, RotateCcw } from "lucide-react";

const COUNT_BITS_CODE = `function countSetBits(n):
  count = 0
  while n > 0:
    n = n & (n - 1)
    count++
  return count`;

const POWER_TWO_CODE = `function isPowerOfTwo(n):
  if n <= 0: return false
  return (n & (n - 1)) == 0`;

export default function BitPropertiesPage() {
    const [num, setNum] = useState(7);
    const [mode, setMode] = useState<'COUNT' | 'POWER'>('COUNT');
    
    const [steps, setSteps] = useState<BitStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
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
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        rows: [{ id: 'n', label: 'N', value: num }],
        message: "Enter a number and run",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = mode === 'COUNT' ? generateCountSetBitsSteps(num) : generatePowerOfTwoSteps(num);
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
            <BackButton href="/dsa/bit-manipulation" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Number Properties</h1>
                 <p className="text-muted-foreground">Common bit manipulation tricks and properties.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[400px] flex items-center justify-center">
                        <BitVisualizer 
                            data={stepData.rows}
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
                         <div className="flex gap-2 mb-4">
                            <button 
                                onClick={() => { setMode('COUNT'); handleReset(); }} 
                                className={`flex-1 py-2 text-xs font-bold rounded border ${mode === 'COUNT' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white text-zinc-500'}`}
                            >
                                COUNT SET BITS
                            </button>
                            <button 
                                onClick={() => { setMode('POWER'); handleReset(); }} 
                                className={`flex-1 py-2 text-xs font-bold rounded border ${mode === 'POWER' ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-white text-zinc-500'}`}
                            >
                                POWER OF TWO
                            </button>
                         </div>

                        <CodeHighlight code={mode === 'COUNT' ? COUNT_BITS_CODE : POWER_TWO_CODE} activeLine={stepData.lineNumber} />

                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Number N</label>
                                    <input 
                                        type="number"
                                        value={num} 
                                        onChange={(e) => {
                                            setNum(parseInt(e.target.value));
                                            handleReset();
                                        }}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run Check
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
