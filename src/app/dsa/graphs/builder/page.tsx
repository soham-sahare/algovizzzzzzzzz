"use client";

import { useState } from "react";
import BackButton from "@/components/ui/BackButton";
import GraphVisualizer from "@/components/visualizations/GraphVisualizer";
import { Plus, Trash, Settings, ArrowRight } from "lucide-react";

export default function GraphBuilderPage() {
    const [directed, setDirected] = useState(false);
    const [weighted, setWeighted] = useState(false);
    
    // We maintain simplified graph state
    const [nodes, setNodes] = useState<{id: string, label: string, x: number, y: number}[]>([
        { id: "A", label: "A", x: 100, y: 100 },
        { id: "B", label: "B", x: 300, y: 100 },
        { id: "C", label: "C", x: 200, y: 250 },
    ]);
    
    // Edges: { source, target, weight }
    const [edges, setEdges] = useState<{source: string, target: string, weight?: number}[]>([
        { source: "A", target: "B", weight: 5 },
        { source: "B", target: "C", weight: 3 },
        { source: "C", target: "A", weight: 10 },
    ]);

    // Inputs
    const [newNodeLabel, setNewNodeLabel] = useState("D");
    const [edgeSource, setEdgeSource] = useState("A");
    const [edgeTarget, setEdgeTarget] = useState("B");
    const [edgeWeight, setEdgeWeight] = useState(1);
    
    const [nodeToDelete, setNodeToDelete] = useState("");

    // Operations
    const addNode = () => {
        if (nodes.find(n => n.id === newNodeLabel)) return;
        const x = Math.random() * 500 + 50;
        const y = Math.random() * 300 + 50;
        setNodes([...nodes, { id: newNodeLabel, label: newNodeLabel, x, y }]);
        // Setup next label
        setNewNodeLabel(String.fromCharCode(newNodeLabel.charCodeAt(0) + 1));
    };

    const deleteNode = () => {
        if (!nodeToDelete) return;
        setNodes(nodes.filter(n => n.id !== nodeToDelete));
        setEdges(edges.filter(e => e.source !== nodeToDelete && e.target !== nodeToDelete));
        setNodeToDelete("");
    };

    const addEdge = () => {
        // Prevent Self Loops for now or duplicates
        if (edgeSource === edgeTarget) return;
        
        // Remove existing edge if any (replace)
        const newEdges = edges.filter(e => 
            !(e.source === edgeSource && e.target === edgeTarget) &&
            // If Undirected, also check reverse
            !( !directed && e.source === edgeTarget && e.target === edgeSource )
        );
        
        newEdges.push({ source: edgeSource, target: edgeTarget, weight: weighted ? edgeWeight : undefined });
        setEdges(newEdges);
    };

    const removeEdge = () => {
          setEdges(edges.filter(e => 
            !(e.source === edgeSource && e.target === edgeTarget) &&
            !( !directed && e.source === edgeTarget && e.target === edgeSource )
        ));
    };

    // Convert to GraphData
    const graphData = {
        nodes: nodes.map(n => ({ id: n.id, label: n.label, x: n.x, y: n.y })),
        edges: edges.map(e => ({ 
            from: e.source, 
            to: e.target, 
            weight: e.weight,
            isDirected: directed,
            label: weighted ? (e.weight?.toString() || "") : "" 
        }))
    };

    return (
         <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/graphs" />
            
             <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-xl items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-foreground">Graph Builder</h1>
                   <p className="text-muted-foreground">Sandbox. Create nodes, connect edges, toggle types.</p>
                </div>
                <div className="flex gap-4">
                     <button onClick={() => setDirected(!directed)} className={`px-3 py-1 rounded border text-sm ${directed ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white text-zinc-500'}`}>
                         {directed ? "Directed" : "Undirected"}
                     </button>
                      <button onClick={() => setWeighted(!weighted)} className={`px-3 py-1 rounded border text-sm ${weighted ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-white text-zinc-500'}`}>
                         {weighted ? "Weighted" : "Unweighted"}
                     </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                 {/* Visualizer */}
                <div className="lg:col-span-2 border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-[600px] overflow-hidden relative">
                    <GraphVisualizer 
                        nodes={graphData.nodes}
                        edges={graphData.edges}
                        // isDirected is handled by edges internal prop, but if visualizer needs global directed prop:
                        // Looking at GraphVisualizer implementation (read in prev turn):
                        // It doesn't take 'isDirected' global prop, it looks at 'edge.isDirected'.
                        // However, we construct 'edges' with 'isDirected?'.
                        // Wait, 'graphData.edges' construction in this file didn't include 'isDirected'.
                        // We should pass directed-ness to edges.
                    />
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* Add Node */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="font-bold text-zinc-500 uppercase text-xs">Manage Nodes</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                value={newNodeLabel}
                                onChange={(e) => setNewNodeLabel(e.target.value.toUpperCase())}
                                className="px-3 py-2 bg-zinc-50 rounded border"
                                placeholder="Label"
                                maxLength={2}
                            />
                            <button onClick={addNode} className="bg-indigo-600 text-white rounded text-sm font-bold">Add Node</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <select 
                                value={nodeToDelete} 
                                onChange={(e) => setNodeToDelete(e.target.value)}
                                className="px-3 py-2 bg-zinc-50 rounded border text-sm"
                            >
                                <option value="">Select Node</option>
                                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                            </select>
                            <button onClick={deleteNode} className="bg-red-500 text-white rounded text-sm font-bold">Delete Node</button>
                        </div>
                    </div>

                    {/* Manage Edges */}
                     <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="font-bold text-zinc-500 uppercase text-xs">Manage Edges</h3>
                        <div className="grid grid-cols-2 gap-2">
                             <select className="px-2 py-2 bg-zinc-50 rounded border text-sm" value={edgeSource} onChange={e => setEdgeSource(e.target.value)}>
                                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                             </select>
                             <select className="px-2 py-2 bg-zinc-50 rounded border text-sm" value={edgeTarget} onChange={e => setEdgeTarget(e.target.value)}>
                                {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                             </select>
                        </div>
                        
                        {weighted && (
                             <input 
                                type="number" 
                                value={edgeWeight}
                                onChange={(e) => setEdgeWeight(parseInt(e.target.value))}
                                className="w-full px-3 py-2 bg-zinc-50 rounded border text-sm"
                                placeholder="Weight"
                            />
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={addEdge} className="bg-green-600 text-white py-2 rounded text-sm font-bold">Update/Add</button>
                             <button onClick={removeEdge} className="bg-orange-500 text-white py-2 rounded text-sm font-bold">Remove</button>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-zinc-800/50 p-4 rounded text-xs text-blue-700 dark:text-blue-300">
                        Tip: You can use this builder to construct custom graphs before implementing complex algorithms like Dijkstra or BFS/DFS (future).
                    </div>
                </div>
            </div>
        </div>
    );
}
