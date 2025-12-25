"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateRatMazeSteps, RatMazeStep } from "@/lib/algorithms/backtracking/ratMaze";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

export default function RatMazePage() {
    const N = 5;
    const [grid, setGrid] = useState<number[][]>([
        [0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0]
    ]);

    const [steps, setSteps] = useState<RatMazeStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(300);

    useEffect(() => {
        const gen = generateRatMazeSteps(grid);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [grid]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            timer = setTimeout(() => setCurrentStep(prev => prev + 1), speed);
        } else if (isPlaying && currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, steps, speed]);

    const handleRandomize = () => {
        const newGrid = Array.from({length:N}, () => Array.from({length:N}, () => Math.random() > 0.7 ? 1 : 0));
        newGrid[0][0] = 0;
        newGrid[N-1][N-1] = 0;
        setGrid(newGrid);
    };

    const handleCellClick = (r: number, c: number) => {
        if (r===0 && c===0) return;
        if (r===N-1 && c===N-1) return;
        const newGrid = grid.map(row => [...row]);
        newGrid[r][c] = newGrid[r][c] === 0 ? 1 : 0;
        setGrid(newGrid);
    };

    const step = steps[currentStep];
    if (!step) return <div>Loading...</div>;

    const currentGrid = step.grid;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/backtracking" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Rat in a Maze</h1>
                 <p className="text-muted-foreground">Find a path from (0,0) to (N-1, N-1) using Backtracking.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center">
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                            {currentGrid.map((row, r) => 
                                row.map((val, c) => {
                                    const isCurrent = step.currentCell[0] === r && step.currentCell[1] === c;
                                    
                                    let bg = "bg-white dark:bg-zinc-800";
                                    let borderColor = "border-zinc-200 dark:border-zinc-700";
                                    
                                    if (val === 1) { // Wall
                                        bg = "bg-zinc-800 dark:bg-zinc-600";
                                    } else if (val === 2) { // Path
                                        bg = "bg-green-200 dark:bg-green-900/50";
                                        borderColor = "border-green-500";
                                    } else if (val === 3) { // Visited/Backtracked
                                        bg = "bg-red-100 dark:bg-red-900/30";
                                    }

                                    if (r===0 && c===0) borderColor = "border-blue-500 border-4";
                                    if (r===N-1 && c===N-1) borderColor = "border-blue-500 border-4";

                                    return (
                                        <div 
                                            key={`${r}-${c}`}
                                            onClick={() => !isPlaying && handleCellClick(r, c)}
                                            className={`w-16 h-16 flex items-center justify-center border rounded cursor-pointer transition-colors ${bg} ${borderColor} relative`}
                                        >
                                            {isCurrent && (
                                                <motion.div layoutId="rat" className="w-8 h-8 bg-indigo-600 rounded-full" />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-4">Click cells to toggle walls (when stopped).</div>
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
                        <button onClick={handleRandomize} className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition">
                            <Shuffle className="w-4 h-4" /> Randomize Maze
                        </button>
                        <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-sm text-orange-800 dark:text-orange-200">
                        <p className="font-bold mb-1">Legend</p>
                         <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 bg-zinc-800 dark:bg-zinc-600 rounded border"></div> Wall</div>
                         <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 bg-green-200 dark:bg-green-900/50 border border-green-500 rounded"></div> Path</div>
                         <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded border"></div> Backtracked/Visited</div>
                         <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-600 rounded-full"></div> Rat (Current)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
