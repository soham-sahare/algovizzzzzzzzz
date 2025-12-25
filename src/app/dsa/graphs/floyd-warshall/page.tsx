"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateFloydWarshallSteps, FloydWarshallStep } from "@/lib/algorithms/graph/floydWarshall";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const INF = 999; 

export default function FloydWarshallPage() {
    // Default Graph: 4 nodes
    // 0->1(3), 0->3(7), 1->0(8), 1->2(2), 2->0(5), 2->3(1), 3->0(2)
    // Represented as adj matrix where null = INF
    const defaultMatrix: (number | null)[][] = [
        [0, 3, null, 7],
        [8, 0, 2, null],
        [5, null, 0, 1],
        [2, null, null, 0]
    ];

    const [steps, setSteps] = useState<FloydWarshallStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(300); // Faster default, O(N^3) is long
    const [message, setMessage] = useState("Ready");
    
    useEffect(() => {
        const gen = generateFloydWarshallSteps(defaultMatrix);
        setSteps(Array.from(gen));
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
        } else if (isPlaying && currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps, speed]);

    const step = steps[currentStep];

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    if (!step) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/graphs" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Floyd-Warshall Algorithm</h1>
                 <p className="text-muted-foreground">All-Pairs Shortest Path Dynamic Programming Algorithm.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer: The Matrix */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center overflow-auto">
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${step.matrix.length}, minmax(0, 1fr))` }}>
                            {step.matrix.map((row, r) => 
                                row.map((val, c) => {
                                    const isHighlighted = step.highlightedCells.some(([hr, hc]) => hr === r && hc === c);
                                    const isPivotRow = step.k === r;
                                    const isPivotCol = step.k === c;
                                    const isTarget = step.i === r && step.j === c;
                                    
                                    // Calculate background color
                                    let bgClass = "bg-white dark:bg-zinc-800";
                                    if (isTarget) bgClass = "bg-yellow-100 dark:bg-yellow-900/30";
                                    else if (isHighlighted) bgClass = "bg-indigo-100 dark:bg-indigo-900/30";
                                    else if (isPivotRow || isPivotCol) bgClass = "bg-zinc-100 dark:bg-zinc-800/80";

                                    return (
                                        <motion.div 
                                            key={`${r}-${c}`}
                                            animate={{ scale: isHighlighted ? 1.1 : 1 }}
                                            className={`w-16 h-16 flex items-center justify-center border rounded font-mono text-sm transition-colors ${bgClass} ${isTarget ? 'border-yellow-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                                        >
                                            {val === null ? '∞' : val}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold">Status</h3>
                            <p className="text-sm text-foreground">{step.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                        </div>
                        
                        {step.comparison && (
                            <div className="bg-white dark:bg-zinc-800 p-3 rounded border border-blue-200 dark:border-blue-900 text-sm font-mono">
                                <div className="flex justify-between mb-1">
                                    <span>Direct:</span>
                                    <span>{step.comparison.current ?? '∞'}</span>
                                </div>
                                <div className="flex justify-between font-bold text-indigo-600 dark:text-indigo-400">
                                    <span>Via Node {step.k}:</span>
                                    <span>{step.comparison.viaK}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mt-4">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition">
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                {isPlaying ? "Pause" : "Play"}
                            </button>
                             <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition">
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
