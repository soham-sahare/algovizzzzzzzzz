"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import { generateUnionFindSteps, UnionFindStep } from "@/lib/algorithms/graph/unionFind";
import { Play, Pause, RotateCcw, Plus, Link as LinkIcon, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function UnionFindPage() {
    const [size, setSize] = useState(8);
    const [inputA, setInputA] = useState("0");
    const [inputB, setInputB] = useState("1");
    const [steps, setSteps] = useState<UnionFindStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Initialized. Ready for ops.");
    const [description, setDescription] = useState("Union Find data structure.");
    
    // Maintain a list of committed operations to replay the whole sequence if needed
    // Actually, for UF, we often just want step-by-step of *latest* operation or full history?
    // Let's do a simple "Run one operation" model on top of current state, but pure state requires re-running from scratch?
    // Complex state management. Let's simplfy: We accumulate a list of operations, and every time we add an op, we regenerate steps for EVERYTHING?
    // No, that's slow.
    // Better: We just generate steps for the *single* new operation based on *current* visual state? 
    // But our generator needs "current internal state". 
    // The generator `generateUnionFindSteps` above takes a LIST of ops.
    // So let's maintain a list of ops.
    interface Op { type: 'UNION' | 'FIND', a: number, b?: number }
    const [ops, setOps] = useState<Op[]>([]);
    
    // When ops change, regenerate ALL steps, but fast-forward to the start of the NEW op?
    // Or just generating steps for the new op starting from current state is tricky unless we persist internal arrays.
    // Let's stick to the "Full Replay" pattern for correctness, but maybe optimize if needed. 
    // For < 20 ops and size < 20, full replay is instant.
    
    useEffect(() => {
        const gen = generateUnionFindSteps(size, ops);
        const allSteps = Array.from(gen);
        setSteps(allSteps);
        // Auto-fast-forward to end of previous ops if we just added one?
        // Actually, let's just jump to the *start* of the new op's steps if we added one.
        // But tracking which index that is is hard.
        // Simplified: Just update steps. If playing, it continues. 
        // If we just added an op, we probably want to visualize IT.
        if (ops.length > 0) {
             // Find roughly where the last op starts? 
             // We'll just let the user scrub or play.
             // Actually, better UX: Jump to `steps.length - (steps_for_last_op)`.
             // Hard to know. Let's just set to end if not playing?
             // No, let's just update steps and maybe set currentStep to 0 if it was empty, or stay put?
             // If we add an op, we want to see it.
             // Let's set current step to steps.length - 1 (finished) if we are "building".
             // BUT we want to visualize.
             // Let's just set steps.
        }
    }, [ops, size]);

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

    const handleUnion = () => {
        const a = parseInt(inputA);
        const b = parseInt(inputB);
        if (isNaN(a) || isNaN(b) || a < 0 || a >= size || b < 0 || b >= size) return;
        
        const newOps = [...ops, { type: 'UNION', a, b } as Op];
        setOps(newOps);
        // We know we want to see this new op.
        // We can't easily know where it starts in the new `steps` array without re-running logic.
        // Hack: temporarily set to end?
        // Let's just set isPlaying true and hope it catches up or we manually jump.
        // Actually, re-generating all steps every time is fine.
        // To auto-play only the new part:
        // We need to know previous length.
        const prevLen = steps.length;
        // Wait for effect to update steps?
        // Use a ref or just accept manual control for now.
        setTimeout(() => {
             setCurrentStep(prevLen); // Jump to where new steps start
             setIsPlaying(true);
        }, 100);
    };

    const handleFind = () => {
        const a = parseInt(inputA);
         if (isNaN(a) || a < 0 || a >= size) return;
        setOps([...ops, { type: 'FIND', a } as Op]);
         const prevLen = steps.length;
        setTimeout(() => {
             setCurrentStep(prevLen);
             setIsPlaying(true);
        }, 100);
    };

    const handleReset = () => {
        setOps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const step = steps[currentStep] || { 
        parents: Array.from({length: size}, (_, i) => i),
        ranks: new Array(size).fill(0),
        message: "Start", 
        description: "",
        highlightedNodes: [],
        highlightedEdges: []
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/graphs" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Union Find (Disjoint Set)</h1>
                 <p className="text-muted-foreground">Visualize set merging and path compression.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Render Nodes as a forest of trees */}
                        {/* This is tricky to layout automatically.
                            Simple approach: Render nodes in grid/circle, draw arrow to parent.
                        */}
                        <div className="flex flex-wrap gap-8 justify-center">
                            {step.parents.map((p, i) => (
                                <UserInfoNode 
                                    key={i} 
                                    index={i} 
                                    parent={p} 
                                    rank={step.ranks[i]} 
                                    isHighlighted={step.highlightedNodes.includes(i)}
                                />
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
                        <h3 className="font-semibold text-sm uppercase text-muted-foreground">Operations</h3>
                        
                        <div className="flex gap-2">
                            <input 
                                type="number" value={inputA} onChange={e => setInputA(e.target.value)}
                                className="w-16 p-2 rounded border bg-background" placeholder="A"
                            />
                            <input 
                                type="number" value={inputB} onChange={e => setInputB(e.target.value)}
                                className="w-16 p-2 rounded border bg-background" placeholder="B"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <button onClick={handleUnion} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition">
                                <LinkIcon className="w-4 h-4" /> Union(A, B)
                            </button>
                            <button onClick={handleFind} className="flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition">
                                <Search className="w-4 h-4" /> Find(A)
                            </button>
                            <button onClick={handleReset} className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded text-sm font-medium transition">
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserInfoNode({ index, parent, rank, isHighlighted }: { index: number, parent: number, rank: number, isHighlighted: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 relative">
             <motion.div 
                animate={{ 
                    scale: isHighlighted ? 1.2 : 1,
                    borderColor: isHighlighted ? "#ef4444" : (parent === index ? "#22c55e" : "#e4e4e7")
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-white dark:bg-zinc-800 border-2 relative z-10 transition-colors ${parent === index ? "border-green-500" : "border-zinc-200 dark:border-zinc-700"}`}
             >
                {index}
             </motion.div>
             
             {/* Rank Badge */}
             <div className="text-xs text-muted-foreground">Rank: {rank}</div>
             
             {/* Parent Pointer Visual */}
             {parent !== index && (
                 <div className="text-xs font-mono text-zinc-400">
                     Parent: {parent}
                 </div>
             )}
        </div>
    );
}
