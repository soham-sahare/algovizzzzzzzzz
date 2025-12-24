"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import GraphVisualizer, { GraphEdge } from "@/components/visualizations/GraphVisualizer";
import { generatePrimSteps, generateKruskalSteps, MSTStep } from "@/lib/algorithms/graph/mst";
import { Play, Pause, RotateCcw, GitBranch } from "lucide-react";

const NODE_POSITIONS: Record<string, {x: number, y: number}> = {
    'A': {x: 100, y: 300},
    'B': {x: 300, y: 100},
    'C': {x: 300, y: 500},
    'D': {x: 500, y: 100},
    'E': {x: 500, y: 500},
    'F': {x: 700, y: 300}
};

const DEFAULT_GRAPH: Record<string, any[]> = {
    'A': [{from:'A', to:'B', weight: 4}, {from:'A', to:'C', weight: 2}],
    'B': [{from:'B', to:'A', weight: 4}, {from:'B', to:'C', weight: 1}, {from:'B', to:'D', weight: 5}],
    'C': [{from:'C', to:'A', weight: 2}, {from:'C', to:'B', weight: 1}, {from:'C', to:'D', weight: 8}, {from:'C', to:'E', weight: 10}],
    'D': [{from:'D', to:'B', weight: 5}, {from:'D', to:'C', weight: 8}, {from:'D', to:'E', weight: 2}, {from:'D', to:'F', weight: 6}],
    'E': [{from:'E', to:'C', weight: 10}, {from:'E', to:'D', weight: 2}, {from:'E', to:'F', weight: 3}],
    'F': [{from:'F', to:'D', weight: 6}, {from:'F', to:'E', weight: 3}]
};

const PRIM_CODE = `function prim(start):
  visited = {start}
  pq = getEdges(start)
  mst = []
  
  while pq not empty:
    edge = pq.extractMin()
    if edge.to in visited: continue
    
    visited.add(edge.to)
    mst.add(edge)
    pq.add(getEdges(edge.to))`;

const KRUSKAL_CODE = `function kruskal(edges):
  mst = []
  uf = UnionFind(nodes)
  sort(edges)
  
  for edge in edges:
    if uf.find(u) != uf.find(v):
      uf.union(u, v)
      mst.add(edge)`;

export default function MSTPage() {
    const [algorithm, setAlgorithm] = useState<'PRIM' | 'KRUSKAL'>('PRIM');
    const [steps, setSteps] = useState<MSTStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [message, setMessage] = useState("Ready");
    
    // Playback
    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        setMessage("Complete");
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);
    
    const handleRun = () => {
        const generator = algorithm === 'PRIM' 
            ? generatePrimSteps(DEFAULT_GRAPH, 'A')
            : generateKruskalSteps(DEFAULT_GRAPH);
            
        setSteps(Array.from(generator));
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setMessage("Reset");
    };

    const stepData = steps.length > 0 ? steps[currentStep] : {
        adj: DEFAULT_GRAPH,
        mstEdges: [],
        visitedNodes: [],
        activeEdge: undefined,
        candidateEdges: [],
        message: "Click Run to Start",
        lineNumber: undefined,
        totalWeight: 0
    };

    const nodes = Object.keys(DEFAULT_GRAPH).map(id => ({
        id,
        label: id,
        x: NODE_POSITIONS[id]?.x || Math.random() * 500,
        y: NODE_POSITIONS[id]?.y || Math.random() * 400
    }));

    // Convert adjacency to full edge list for visualizer base state
    let baseEdges: GraphEdge[] = [];
    const seen = new Set();
    Object.values(DEFAULT_GRAPH).flat().forEach(e => {
        const key = [e.from, e.to].sort().join('-');
        if(!seen.has(key)) {
            seen.add(key);
            baseEdges.push({ ...e, color: 'gray' }); // default color
        }
    });

    // Merge base edges with active/MST edges for coloring
    const visualizedEdges = baseEdges.map(e => {
        const isMST = stepData.mstEdges.some(mse => 
            (mse.from === e.from && mse.to === e.to) || (mse.from === e.to && mse.to === e.from)
        );
        const isActive = stepData.activeEdge && (
            (stepData.activeEdge.from === e.from && stepData.activeEdge.to === e.to) || 
            (stepData.activeEdge.from === e.to && stepData.activeEdge.to === e.from)
        );
        
        // For coloring, GraphVisualizer usually expects separate highlightedEdges prop depending on implementation.
        // Or we can assume we pass edges directly. 
        // The standard GraphVisualizer prop `edges` determines structure.
        // It supports `highlightedEdges`.
        return e;
    });

    const highlightedEdges = [
        ...stepData.mstEdges.map(e => ({ from: e.from, to: e.to, color: 'green' })), // MST edges
        ...(stepData.activeEdge ? [{ from: stepData.activeEdge.from, to: stepData.activeEdge.to, color: 'orange' }] : [])
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/graphs" />
            <div className="flex justify-between items-center">
                 <div>
                     <h1 className="text-3xl font-bold text-foreground mb-2">Minimum Spanning Tree</h1>
                     <p className="text-muted-foreground">Find the subset of edges that connects all vertices with minimum total weight.</p>
                 </div>
                 <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button onClick={() => { setAlgorithm('PRIM'); handleReset(); }} className={`px-3 py-1 rounded text-sm font-bold ${algorithm === 'PRIM' ? 'bg-white shadow text-indigo-600' : 'text-zinc-500'}`}>Prim's</button>
                    <button onClick={() => { setAlgorithm('KRUSKAL'); handleReset(); }} className={`px-3 py-1 rounded text-sm font-bold ${algorithm === 'KRUSKAL' ? 'bg-white shadow text-indigo-600' : 'text-zinc-500'}`}>Kruskal's</button>
                 </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[400px] overflow-hidden relative">
                        <GraphVisualizer 
                            nodes={nodes}
                            edges={visualizedEdges}
                            highlightedNodes={stepData.visitedNodes}
                            highlightedEdges={highlightedEdges}
                        />
                         <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 p-2 rounded backdrop-blur border text-sm font-mono">
                             Total Weight: {stepData.totalWeight}
                         </div>
                     </div>

                    {/* Status */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{stepData.message}</span></span>
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full"
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
                     <CodeHighlight code={algorithm === 'PRIM' ? PRIM_CODE : KRUSKAL_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <p className="text-xs text-zinc-500">
                                    {algorithm === 'PRIM' 
                                        ? "Prim's builds graph node by node, always picking the smallest edge connected to the growing tree." 
                                        : "Kruskal's builds graph edge by edge, picking smallest edges globally unless they form a cycle."}
                                </p>
                                
                                <button onClick={handleRun} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition">
                                    <Play className="w-4 h-4" /> Run {algorithm === 'PRIM' ? "Prim's" : "Kruskal's"}
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
