"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import GraphVisualizer, { GraphNode, GraphEdge } from "@/components/visualizations/GraphVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateBFSSteps, GraphStep } from "@/lib/algorithms/graph/bfs";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BFS_CODE = `function bfs(start):
  q = [start]
  visited = {start}
  while q:
    curr = q.dequeue()
    visit(curr)
    for neighbor in adj[curr]:
      if neighbor not in visited:
        visited.add(neighbor)
        q.enqueue(neighbor)`;

// Default Graph
const DEFAULT_NODES: GraphNode[] = [
    { id: "A", x: 400, y: 50 },
    { id: "B", x: 250, y: 150 },
    { id: "C", x: 550, y: 150 },
    { id: "D", x: 150, y: 300 },
    { id: "E", x: 350, y: 300 },
    { id: "F", x: 500, y: 300 },
    { id: "G", x: 650, y: 300 },
];
const DEFAULT_EDGES: GraphEdge[] = [
    { from: "A", to: "B" }, { from: "A", to: "C" },
    { from: "B", to: "D" }, { from: "B", to: "E" },
    { from: "C", to: "F" }, { from: "C", to: "G" },
    { from: "E", to: "F" } // Cross edge
];
// Adjacency List for Logic
const DEFAULT_ADJ = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F", "G"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
    "G": ["C"]
};

export default function BFSPage() {
    const [steps, setSteps] = useState<GraphStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("Ready to run BFS");
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
                        setMessage("Traversal Complete");
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        visitingNodeId: undefined, 
        visitedNodeIds: [],
        highlightedNodeIds: [],
        highlightedEdges: [],
        queue: [],
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateBFSSteps(DEFAULT_ADJ, "A");
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
            <BackButton href="/dsa/graphs" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Breadth-First Search (BFS)</h1>
                 <p className="text-muted-foreground">Explores the neighbor nodes first, before moving to the next level neighbors.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="flex justify-center">
                        <GraphVisualizer 
                            nodes={DEFAULT_NODES}
                            edges={DEFAULT_EDGES}
                            highlightedNodes={stepData.highlightedNodeIds}
                            highlightedEdges={stepData.highlightedEdges}
                            visitingNodeId={stepData.visitingNodeId}
                            visitedNodeIds={stepData.visitedNodeIds}
                            width={700}
                            height={400}
                        />
                     </div>

                     {/* Queue Visualization */}
                     <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Queue</h4>
                        <div className="flex gap-2 min-h-[40px] overflow-x-auto">
                            <AnimatePresence>
                                {stepData.queue?.map((item, i) => (
                                    <motion.div
                                        key={`${i}-${item}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="w-10 h-10 flex items-center justify-center rounded bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200"
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {(!stepData.queue || stepData.queue.length === 0) && <span className="text-sm text-zinc-400 italic flex items-center">Empty</span>}
                        </div>
                     </div>

                    {/* Status & Playback */}
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
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                        <CodeHighlight code={BFS_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run BFS Node 'A'
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
