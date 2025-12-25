"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateKosarajuSteps, KosarajuStep } from "@/lib/algorithms/graph/kosaraju";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function SCCPage() {
    // 5 Nodes. 
    // 0->1, 1->2, 2->0 (SCC 0,1,2)
    // 1->3, 3->4 (SCC 3, 4 each? No wait. 3->4. 4->None. So {3}, {4} are SCCs if no cycles.)
    // Let's make it interesting.
    // 0->1, 1->2, 2->0 (Cycle)
    // 2->3
    // 3->4, 4->3 (Cycle)
    // So SCCs: {0,1,2}, {3,4}
    const [initialAdj, setInitialAdj] = useState<number[][]>([
        [1],    // 0
        [2],    // 1
        [0, 3], // 2->0, 2->3
        [4],    // 3
        [3]     // 4
    ]);

    const [steps, setSteps] = useState<KosarajuStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    useEffect(() => {
        const gen = generateKosarajuSteps(initialAdj);
        setSteps(Array.from(gen));
        setCurrentStep(0);
        setIsPlaying(false);
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
    if (!step) return <div>Loading...</div>;

    // Helper to get edge color
    // If we are in transpose phase, edges are reversed. The step.adj has the current edges.
    
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/graphs" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Strongly Connected Components</h1>
                 <p className="text-muted-foreground">Kosaraju's Algorithm (2-Pass DFS).</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center relative">
                        {/* 
                            Simple Graph Render:
                            Node 0: (100, 100)
                            Node 1: (200, 50)
                            Node 2: (200, 150)
                            Node 3: (350, 100)
                            Node 4: (450, 100)
                         */}
                         <div className="relative w-[500px] h-[300px]">
                            {/* Edges - Naive Line Drawing */}
                            {step.adj.map((neighbors, u) => 
                                neighbors.map(v => {
                                    // Coords map
                                    const coords = [
                                        {x: 100, y: 150},
                                        {x: 200, y: 80},
                                        {x: 200, y: 220},
                                        {x: 350, y: 150},
                                        {x: 450, y: 150},
                                    ];
                                    const start = coords[u];
                                    const end = coords[v];
                                    
                                    return (
                                        <svg key={`${u}-${v}`} className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                                            <line 
                                                x1={start.x} y1={start.y} 
                                                x2={end.x} y2={end.y} 
                                                stroke={step.isTransposePhase ? "#fca5a5" : "#94a3b8"} 
                                                strokeWidth="2" 
                                                strokeDasharray={step.isTransposePhase ? "4" : "0"}
                                                markerEnd="url(#arrowhead)"
                                            />
                                        </svg>
                                    );
                                })
                            )}
                            <svg className="absolute w-0 h-0"><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#888" /></marker></defs></svg>

                            {[0,1,2,3,4].map(idx => {
                                const coords = [
                                    {x: 100, y: 150},
                                    {x: 200, y: 80},
                                    {x: 200, y: 220},
                                    {x: 350, y: 150},
                                    {x: 450, y: 150},
                                ];
                                const pos = coords[idx];
                                const isHighlighted = step.highlightedNodes.includes(idx);
                                const isCurrent = step.currentNode === idx;
                                const isVisited = step.visited[idx];
                                
                                // Color based on sccList if algorithm done? 
                                // Or based on currentSCC if building?
                                let borderColor = "border-zinc-300 dark:border-zinc-600";
                                let bg = "bg-white dark:bg-zinc-800";
                                
                                if (isCurrent) borderColor = "border-indigo-500 border-4";
                                
                                return (
                                    <motion.div 
                                        key={idx}
                                        style={{ left: pos.x - 24, top: pos.y - 24 }}
                                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 font-bold transition-colors ${borderColor} ${bg}`}
                                        animate={{ scale: isHighlighted ? 1.2 : 1 }}
                                    >
                                        {idx}
                                    </motion.div>
                                );
                            })}
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
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-bold">Stack (Finish Times)</h3>
                            <div className="flex gap-1 flex-wrap min-h-[40px] items-center p-2 bg-white dark:bg-zinc-900 rounded border">
                                {step.stack.map(n => (
                                    <div key={n} className="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs">
                                        {n}
                                    </div>
                                ))}
                            </div>
                        </div>

                         <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-bold">Identified SCCs</h3>
                            <div className="flex flex-col gap-2 min-h-[40px]">
                                {step.sccList.map((scc, i) => (
                                    <div key={i} className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 text-xs">
                                        Component {i+1}: {'{ '}{scc.join(", ")}{' }'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
