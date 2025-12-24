"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import GraphVisualizer, { GraphEdge } from "@/components/visualizations/GraphVisualizer";
import { generateTopoSortSteps, TopoSortStep } from "@/lib/algorithms/graph/topologicalSort";
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";

// Adjacency List for default DAG (Directed Acyclic Graph)
const DEFAULT_DAG = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D', 'E'],
    'D': ['F'],
    'E': ['F'],
    'F': []
};

// Nodes layout positions
const NODE_POSITIONS: Record<string, {x: number, y: number}> = {
    'A': {x: 100, y: 250},
    'B': {x: 250, y: 150},
    'C': {x: 250, y: 350},
    'D': {x: 400, y: 200},
    'E': {x: 400, y: 350},
    'F': {x: 550, y: 250}
};

const TOPO_CODE = `function topologicalSort(graph):
  inDegree = { ... }
  queue = [nodes with inDegree 0]
  order = []
  
  while queue not empty:
    u = queue.dequeue()
    order.push(u)
    
    for v in neighbors(u):
      inDegree[v]--
      if inDegree[v] == 0:
        queue.enqueue(v)
        
  return order.length == nodes.length ? order : error`;

export default function TopologicalSortPage() {
    const [graph, setGraph] = useState<Record<string, string[]>>(DEFAULT_DAG);
    
    const [steps, setSteps] = useState<TopoSortStep[]>([]);
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
        adj: graph,
        inDegree: {},
        queue: [],
        sortedOrder: [],
        activeNodeId: undefined,
        highlightedEdges: [],
        description: "Click Run to start",
        lineNumber: undefined
    };

    // Construct Graph Nodes/Edges for Visualizer
    const nodes = Object.keys(graph).map(id => ({
        id,
        label: `${id} (in:${stepData.inDegree[id] ?? '?'})`,
        x: NODE_POSITIONS[id]?.x || Math.random() * 500,
        y: NODE_POSITIONS[id]?.y || Math.random() * 400
    }));

    const edges: GraphEdge[] = [];
    Object.entries(graph).forEach(([source, targets]) => {
        targets.forEach(target => {
            edges.push({
                from: source,
                to: target,
                isDirected: true
            });
        });
    });

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateTopoSortSteps(graph);
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">Topological Sort</h1>
                 <p className="text-muted-foreground">Kahn's Algorithm (BFS) for ordering vertices in a Directed Acyclic Graph (DAG).</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[400px] overflow-hidden relative">
                        <GraphVisualizer 
                            nodes={nodes}
                            edges={edges}
                            highlightedNodes={stepData.activeNodeId ? [stepData.activeNodeId] : []}
                            highlightedEdges={stepData.highlightedEdges}
                            visitingNodeId={stepData.activeNodeId}
                            visitedNodeIds={stepData.sortedOrder}
                            // Need to support labels showing in-degree dynamically if possible
                            // Visualizer usually takes static props but we update 'nodes' state above with new labels.
                        />
                     </div>

                    {/* Queue and Order Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <span className="text-xs uppercase font-bold text-zinc-500 block mb-2">Queue (0 In-Degree)</span>
                            <div className="flex gap-2 min-h-[2rem]">
                                {stepData.queue.map(n => <div key={n} className="w-8 h-8 rounded bg-white dark:bg-zinc-700 flex items-center justify-center border shadow-sm font-bold">{n}</div>)}
                            </div>
                        </div>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                             <span className="text-xs uppercase font-bold text-indigo-500 block mb-2">Sorted Order</span>
                             <div className="flex gap-2 flex-wrap min-h-[2rem]">
                                {stepData.sortedOrder.map((n, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center shadow-sm font-bold">{n}</div>
                                        {i < stepData.sortedOrder.length - 1 && <div className="w-4 h-0.5 bg-indigo-300 mx-1"></div>}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* Status */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{stepData.description}</span></span>
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
                     <CodeHighlight code={TOPO_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <p className="text-xs text-zinc-500">
                                    Currently visualizing a fixed DAG. Use the Graph Builder to create custom graphs, then export logic here (future feature).
                                </p>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run Sort
                                </button>
                                
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </button>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}
