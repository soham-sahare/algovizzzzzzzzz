"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import TreeVisualizer from "@/components/visualizations/TreeVisualizer";
import { generateHuffmanSteps, HuffmanStep } from "@/lib/algorithms/greedy/huffman";
import { Play, Pause, RotateCcw } from "lucide-react";
import { TreeNode } from "@/lib/algorithms/tree/bst";

const HUFFMAN_CODE = `function huffman(text):
  count frequencies
  pq = createLeafNodes(freqs)
  
  while pq.size > 1:
    left = pq.popMin()
    right = pq.popMin()
    newNode = Node(freq: left + right)
    newNode.left = left
    newNode.right = right
    pq.push(newNode)
    
  return pq.pop() // Root`;

export default function HuffmanPage() {
    const [inputValue, setInputValue] = useState("banana");
    
    const [steps, setSteps] = useState<HuffmanStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1000); // Slow by default
    const [message, setMessage] = useState("Enter text and run");
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
        treeRoot: null,
        frequencies: {},
        codes: {},
        priorityQueue: [],
        message: "Ready",
        lineNumber: undefined
    };

    const handleRun = () => {
        if (!inputValue) {
            setMessage("Please enter text");
            return;
        }
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateHuffmanSteps(inputValue);
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
            <BackButton href="/dsa/greedy" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Huffman Coding</h1>
                 <p className="text-muted-foreground">Lossless data compression using variable-length codes based on frequency.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer - Tree */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 p-8 min-h-[500px] flex flex-col items-center">
                        <div className="w-full flex justify-between mb-4">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Tree Construction</span>
                            <span className="text-xs text-zinc-400">{stepData.message}</span>
                        </div>
                        
                        <TreeVisualizer 
                            root={stepData.treeRoot}
                            width={600}
                            height={400}
                        />

                        {/* Priority Queue State */}
                        <div className="mt-8 w-full">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Priority Queue (Min-Heap)</h4>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {stepData.priorityQueue.map((node: TreeNode) => (
                                    <div key={node.id} className="min-w-[60px] h-14 flex items-center justify-center bg-white dark:bg-zinc-800 border rounded shadow-sm text-xs font-mono">
                                        {node.label || node.value}
                                    </div>
                                ))}
                                {stepData.priorityQueue.length === 0 && <span className="text-xs text-zinc-400 italic">Empty or Finished</span>}
                            </div>
                        </div>
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
                             <div className="flex items-center gap-2">
                                <span className="text-xs">Speed</span>
                                <input 
                                    type="range" 
                                    min="100" 
                                    max="2000" 
                                    step="100"
                                    value={2100 - speed} 
                                    onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                                    className="w-20 h-1 bg-zinc-300 rounded-full appearance-none cursor-pointer"
                                />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <div className="sticky top-6">
                        <CodeHighlight code={HUFFMAN_CODE} activeLine={stepData.lineNumber} />

                        {/* Frequency Table */}
                        <div className="mt-6 border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-semibold">
                                    <tr>
                                        <th className="px-4 py-2">Char</th>
                                        <th className="px-4 py-2">Freq</th>
                                        <th className="px-4 py-2">Code</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                    {Object.entries(stepData.frequencies).map(([char, freq]) => (
                                        <tr key={char} className="bg-white dark:bg-zinc-900">
                                            <td className="px-4 py-2 font-mono">{char}</td>
                                            <td className="px-4 py-2">{freq}</td>
                                            <td className="px-4 py-2 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                                {stepData.codes[char] || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Input Text</label>
                                    <input 
                                        value={inputValue} 
                                        onChange={(e) => {
                                            setInputValue(e.target.value);
                                            handleReset();
                                        }}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder="e.g. banana"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Build Huffman Tree
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
