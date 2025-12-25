"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateEditDistanceSteps, EditDistanceStep } from "@/lib/algorithms/dp/editDistance";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function EditDistancePage() {
    const [s1Input, setS1Input] = useState("horse");
    const [s2Input, setS2Input] = useState("ros");
    
    const [s1, setS1] = useState("horse");
    const [s2, setS2] = useState("ros");

    const [steps, setSteps] = useState<EditDistanceStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    useEffect(() => {
        const gen = generateEditDistanceSteps(s1, s2);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [s1, s2]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
        } else if (isPlaying && currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps, speed]);

    const handleUpdate = () => {
        if(s1Input && s2Input) {
            setS1(s1Input);
            setS2(s2Input);
        }
    };

    const step = steps[currentStep];
    if (!step) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/dynamic-programming" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Edit Distance (Levenshtein)</h1>
                 <p className="text-muted-foreground">Minimum operations (Insert, Delete, Replace) to transform one string to another.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center overflow-auto">
                        {/* Headers */}
                        <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${step.str2.length + 1}, minmax(0, 1fr))` }}>
                            {/* Top Header Row for S2 */}
                            <div className="w-10 h-10"></div> {/* Corner */}
                            <div className="w-10 h-10 flex items-center justify-center font-bold text-muted-foreground">""</div>
                            {step.str2.split("").map((char, i) => (
                                <div key={i} className="w-10 h-10 flex items-center justify-center font-bold">{char}</div>
                            ))}

                            {/* Matrix Rows */}
                            {step.dp.map((row, r) => (
                                <>
                                    {/* Left Header Col for S1 */}
                                    <div className="w-10 h-10 flex items-center justify-center font-bold">
                                        {r === 0 ? '""' : step.str1[r-1]}
                                    </div>
                                    
                                    {/* Cells */}
                                    {row.map((val, c) => {
                                        const isHighlighted = step.highlightedCells.some(([hr, hc]) => hr === r && hc === c);
                                        const isCurrent = step.currentCell && step.currentCell[0] === r && step.currentCell[1] === c;
                                        
                                        let bg = "bg-white dark:bg-zinc-800";
                                        let border = "border-zinc-200 dark:border-zinc-700";
                                        if (isCurrent) {
                                            border = "border-indigo-500 border-2";
                                            bg = "bg-indigo-50 dark:bg-indigo-900/30";
                                        } else if (isHighlighted) {
                                            bg = "bg-yellow-100 dark:bg-yellow-900/30";
                                        }

                                        return (
                                            <div key={c} className={`w-10 h-10 flex items-center justify-center border rounded text-sm ${bg} ${border}`}>
                                                {val}
                                            </div>
                                        );
                                    })}
                                </>
                            ))}
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
                        <div>
                            <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">String 1 (Rows)</label>
                            <input 
                                value={s1Input} onChange={e=>setS1Input(e.target.value)}
                                className="w-full p-2 rounded border bg-background"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase text-zinc-500 font-bold mb-1 block">String 2 (Cols)</label>
                            <input 
                                value={s2Input} onChange={e=>setS2Input(e.target.value)}
                                className="w-full p-2 rounded border bg-background"
                            />
                        </div>
                        <button onClick={handleUpdate} className="w-full bg-zinc-900 text-white rounded py-2 text-sm hover:bg-zinc-800 transition">
                            Update Strings
                        </button>
                        <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
