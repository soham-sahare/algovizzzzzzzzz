"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import GraphVisualizer, { GraphNode, GraphEdge } from "@/components/visualizations/GraphVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateDijkstraSteps, DijkstraStep } from "@/lib/algorithms/graph/dijkstra";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const DIJKSTRA_CODE = `function dijkstra(start):
  dist = {all: Infinity, start: 0}
  pq = [(0, start)]
  
  while pq:
    curr_dist, curr = pq.pop_min()
    
    if curr in visited: continue
    visited.add(curr)
    
    for neighbor, weight in adj[curr]:
      new_dist = curr_dist + weight
      if new_dist < dist[neighbor]:
        dist[neighbor] = new_dist
        pq.push((new_dist, neighbor))`;

// Weighted Graph
const NODES: GraphNode[] = [
    { id: "A", x: 100, y: 200 },
    { id: "B", x: 300, y: 100 },
    { id: "C", x: 300, y: 300 },
    { id: "D", x: 500, y: 200 },
    { id: "E", x: 650, y: 200 },
];

const EDGES: GraphEdge[] = [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "C", to: "B", weight: 1 }, // Directed C->B helps find shorter path to B (2+1=3 < 4)
    { from: "B", to: "D", weight: 5 },
    { from: "C", to: "D", weight: 8 },
    { from: "D", to: "E", weight: 6 },
    { from: "B", to: "E", weight: 10 },
];

// Adjacency List (Directed)
const ADJ: Record<string, GraphEdge[]> = {
    "A": [{ from: "A", to: "B", weight: 4 }, { from: "A", to: "C", weight: 2 }],
    "B": [{ from: "B", to: "D", weight: 5 }, { from: "B", to: "E", weight: 10 }],
    "C": [{ from: "C", to: "B", weight: 1 }, { from: "C", to: "D", weight: 8 }],
    "D": [{ from: "D", to: "E", weight: 6 }],
    "E": []
};

export default function DijkstraPage() {
    const [steps, setSteps] = useState<DijkstraStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(800);
    const [message, setMessage] = useState("Ready to run Dijkstra");
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
        visitingNodeId: undefined, 
        visitedNodeIds: [],
        highlightedNodeIds: [],
        highlightedEdges: [],
        distances: { "A": 0, "B": Infinity, "C": Infinity, "D": Infinity, "E": Infinity },
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        // Generate
        const gen = generateDijkstraSteps(ADJ, "A", ["A", "B", "C", "D", "E"]);
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">Dijkstra's Algorithm</h1>
                 <p className="text-muted-foreground">Shortest path in weighted graphs using a greedy approach.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="flex justify-center border rounded-lg bg-zinc-50 dark:bg-zinc-900/50 p-4">
                        <GraphVisualizer 
                            nodes={NODES}
                            edges={EDGES}
                            highlightedNodes={stepData.highlightedNodeIds}
                            highlightedEdges={stepData.highlightedEdges}
                            visitingNodeId={stepData.visitingNodeId}
                            visitedNodeIds={stepData.visitedNodeIds}
                            width={700}
                            height={400}
                        />
                     </div>

                     {/* Distances Table */}
                     <div className="bg-white dark:bg-zinc-900 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Node</th>
                                    <th className="px-4 py-3">A</th>
                                    <th className="px-4 py-3">B</th>
                                    <th className="px-4 py-3">C</th>
                                    <th className="px-4 py-3">D</th>
                                    <th className="px-4 py-3">E</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t border-zinc-200 dark:border-zinc-800">
                                    <td className="px-4 py-3 font-semibold">Min Dist</td>
                                    {["A", "B", "C", "D", "E"].map(node => (
                                        <td key={node} className="px-4 py-3">
                                            {stepData.distances[node] === Infinity ? "∞" : stepData.distances[node]}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
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
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <div className="sticky top-6">
                        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Logic</h3>
                        <CodeHighlight code={DIJKSTRA_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run Dijkstra from 'A'
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
