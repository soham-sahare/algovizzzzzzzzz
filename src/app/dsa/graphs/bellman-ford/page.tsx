"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import GraphVisualizer, { GraphEdge } from "@/components/visualizations/GraphVisualizer";
import { generateBellmanFordSteps, BellmanFordStep } from "@/lib/algorithms/graph/bellmanFord";
import { Play, Pause, RotateCcw } from "lucide-react";

// Graph with negative edges but no negative cycle for success case
const GRAPH_SUCCESS_NODES = ['S', 'A', 'B', 'C', 'D', 'E'];
const GRAPH_SUCCESS_POS: Record<string, {x: number, y: number}> = {
  'S': {x: 100, y: 300},
  'A': {x: 300, y: 100},
  'B': {x: 300, y: 500},
  'C': {x: 500, y: 100},
  'D': {x: 500, y: 500},
  'E': {x: 700, y: 300},
};
const GRAPH_SUCCESS_ADJ = {
    'S': [{from:'S', to:'A', weight: 4}, {from:'S', to:'B', weight: 2}],
    'A': [{from:'A', to:'C', weight: 2}, {from:'A', to:'B', weight: 3}, {from:'A', to:'D', weight: 3}],
    'B': [{from:'B', to:'C', weight: 1}, {from:'B', to:'A', weight: 1}, {from:'B', to:'D', weight: 5}], // B->A weight check this
    'C': [{from:'C', to:'E', weight: -5}], // Negative weight
    'D': [{from:'D', to:'E', weight: 2}],
    'E': []
};

// Graph with negative cycle
const GRAPH_CYCLE_ADJ = {
    'S': [{from:'S', to:'A', weight: 1}],
    'A': [{from:'A', to:'B', weight: 2}],
    'B': [{from:'B', to:'C', weight: -5}],
    'C': [{from:'C', to:'A', weight: 2}], // Sum A->B->C->A = 2-5+2 = -1 < 0
    'D': [],
    'E': []
};

const BF_CODE = `function bellmanFord(edges, start):
  dist[start] = 0, others = Inf
  
  for i from 1 to V-1:
    for each edge (u, v) with weight w:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        
  // Check negative cycle
  for each edge (u, v) with weight w:
    if dist[u] + w < dist[v]:
      error "Negative Cycle"`;

export default function BellmanFordPage() {
    const [scenario, setScenario] = useState<'SUCCESS' | 'CYCLE'>('SUCCESS');
    const [steps, setSteps] = useState<BellmanFordStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    
    // Playback
    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);
    
    const handleRun = () => {
        const adj = scenario === 'SUCCESS' ? GRAPH_SUCCESS_ADJ : GRAPH_CYCLE_ADJ;
        const generator = generateBellmanFordSteps(adj, 'S');
            
        setSteps(Array.from(generator));
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const adj = scenario === 'SUCCESS' ? GRAPH_SUCCESS_ADJ : GRAPH_CYCLE_ADJ;
    
    const stepData = steps.length > 0 ? steps[currentStep] : {
        adj: adj,
        distances: {} as Record<string, number>,
        parents: {},
        activeEdge: undefined,
        changed: false,
        iteration: 0,
        message: "Click Run to Start",
        lineNumber: undefined,
        negativeCycleNode: undefined
    };

    const nodes = Object.keys(adj).map(id => ({
        id,
        // Label shows Distance
        label: `${id}: ${stepData.distances[id] === Infinity ? 'Inf' : stepData.distances[id] !== undefined ? stepData.distances[id] : 'Inf'}`,
        x: GRAPH_SUCCESS_POS[id]?.x || Math.random() * 500,
        y: GRAPH_SUCCESS_POS[id]?.y || Math.random() * 400
    }));

    // Edges
    const edges: GraphEdge[] = [];
    Object.values(adj).flat().forEach(e => {
        edges.push({ ...e, isDirected: true }); // Make sure arrows show
    });

    const highlightedEdges = stepData.activeEdge ? [
        { from: stepData.activeEdge.from, to: stepData.activeEdge.to, color: stepData.changed ? 'green' : 'orange' }
    ] : [];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/graphs" />
            <div className="flex justify-between items-center">
                 <div>
                     <h1 className="text-3xl font-bold text-foreground mb-2">Bellman-Ford Algorithm</h1>
                     <p className="text-muted-foreground">Finds shortest paths from a source node, handling negative edge weights and detecting negative cycles.</p>
                 </div>
                 <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button onClick={() => { setScenario('SUCCESS'); handleReset(); }} className={`px-3 py-1 rounded text-sm font-bold ${scenario === 'SUCCESS' ? 'bg-white shadow text-indigo-600' : 'text-zinc-500'}`}>Success Case</button>
                    <button onClick={() => { setScenario('CYCLE'); handleReset(); }} className={`px-3 py-1 rounded text-sm font-bold ${scenario === 'CYCLE' ? 'bg-white shadow text-indigo-600' : 'text-zinc-500'}`}>Negative Cycle</button>
                 </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[400px] overflow-hidden relative">
                        <GraphVisualizer 
                            nodes={nodes}
                            edges={edges}
                            highlightedEdges={highlightedEdges}
                        />
                         {stepData.negativeCycleNode && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                 <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-xl border-2 border-rose-500">
                                     <h2 className="text-2xl font-bold text-rose-600 mb-2">Negative Cycle Detected!</h2>
                                     <p className="text-zinc-600 dark:text-zinc-300">The distances cannot be resolved because iterating through the cycle reduces the total weight indefinitely.</p>
                                 </div>
                             </div>
                         )}
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
                     <CodeHighlight code={BF_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <p className="text-xs text-zinc-500">
                                    Unlike Dijkstra's, Bellman-Ford relaxes all edges |V|-1 times, allowing it to handle negative weights correctly.
                                </p>
                                
                                <button onClick={handleRun} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition">
                                    <Play className="w-4 h-4" /> Run Bellman-Ford
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
