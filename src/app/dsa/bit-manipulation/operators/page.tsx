"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import BitVisualizer, { BitData } from "@/components/visualizations/BitVisualizer";
import { generateBitwiseSteps, BitStep } from "@/lib/algorithms/bit/basics";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function BitOperatorsPage() {
    const [numA, setNumA] = useState(5);
    const [numB, setNumB] = useState(3);
    const [op, setOp] = useState<'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT'>('AND');
    
    const [steps, setSteps] = useState<BitStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
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
        rows: [
            { id: 'a', label: 'A', value: numA },
            ...(op !== 'NOT' ? [{ id: 'b', label: op.includes('SHIFT') ? 'Shift' : 'B', value: numB }] : [])
        ],
        message: "Select numbers and operator",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        const gen = generateBitwiseSteps(numA, numB, op);
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">Bitwise Operators</h1>
                 <p className="text-muted-foreground">Visualize how bitwise operators manipulate binary data.</p>
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
                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {['AND', 'OR', 'XOR', 'NOT', 'LSHIFT', 'RSHIFT'].map((o) => (
                                        <button 
                                            key={o}
                                            onClick={() => { setOp(o as any); handleReset(); }} 
                                            className={`text-xs font-bold py-2 rounded border ${op === o ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white text-zinc-500'}`}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                                <hr className="border-zinc-200 dark:border-zinc-700" />
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Number A</label>
                                    <input 
                                        type="number"
                                        value={numA} 
                                        onChange={(e) => {
                                            setNumA(parseInt(e.target.value));
                                            handleReset();
                                        }}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                {op !== 'NOT' && (
                                    <div>
                                        <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">
                                            {op.includes('SHIFT') ? 'Shift Amount' : 'Number B'}
                                        </label>
                                        <input 
                                            type="number"
                                            value={numB} 
                                            onChange={(e) => {
                                                setNumB(parseInt(e.target.value));
                                                handleReset();
                                            }}
                                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                            disabled={isProcessing}
                                        />
                                    </div>
                                )}
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run Operation
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
