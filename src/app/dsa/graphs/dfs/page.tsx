"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import GraphVisualizer, { GraphNode, GraphEdge } from "@/components/visualizations/GraphVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateDFSSteps, } from "@/lib/algorithms/graph/dfs";
import { GraphStep } from "@/lib/algorithms/graph/bfs";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DFS_CODE = `function dfs(start):
  stack = [start]
  visited = set()
  while stack:
    curr = stack.pop()
    if curr not in visited:
      visit(curr)
      visited.add(curr)
      for neighbor in reverse(adj[curr]):
        if neighbor not in visited:
          stack.push(neighbor)`;

// Default Graph (Same as BFS for comparison)
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
    { from: "E", to: "F" }
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

export default function DFSPage() {
    const [steps, setSteps] = useState<GraphStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("Ready to run DFS");
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
        stack: [],
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateDFSSteps(DEFAULT_ADJ, "A");
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">Depth-First Search (DFS)</h1>
                 <p className="text-muted-foreground">Explores as far as possible along each branch before backtracking.</p>
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

                     {/* Stack Visualization */}
                     <div className="bg-white dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Stack</h4>
                        <div className="flex gap-2 min-h-[40px] overflow-x-auto flex-col-reverse max-h-[100px] flex-wrap items-start">
                            <div className="flex gap-2">
                                <AnimatePresence>
                                    {stepData.stack?.map((item, i) => (
                                        <motion.div
                                            key={`${i}-${item}`}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="w-10 h-10 flex items-center justify-center rounded bg-purple-100 text-purple-700 font-bold border border-purple-200 dark:bg-purple-900/30 dark:text-purple-200"
                                        >
                                            {item}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {(!stepData.stack || stepData.stack.length === 0) && <span className="text-sm text-zinc-400 italic flex items-center">Empty</span>}
                            </div>
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
                        <CodeHighlight code={DFS_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run DFS Node 'A'
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
