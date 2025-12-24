"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
// Reuse TreeVisualizer but adapt props if needed or use a generic one?
// TreeVisualizer expects `TreeNode` structure. Our logic converts array to it.
// Let's check TreeVisualizer import.
import TreeVisualizer from "@/components/visualizations/TreeVisualizer"; 
import { TreeNode } from "@/lib/algorithms/tree/bst";
import { generateHeapInsertSteps, generateHeapExtractSteps, HeapStep } from "@/lib/algorithms/tree/heap";
import { Play, Pause, RotateCcw, Plus, ArrowUp, ArrowDown } from "lucide-react";

const HEAP_CODE = `function insert(val):
  arr.push(val)
  bubbleUp(arr.length - 1)

function bubbleUp(i):
  while i > 0 && arr[i] < arr[parent(i)]:
    swap(arr[i], arr[parent(i)])
    i = parent(i)

function extractMin():
  root = arr[0]
  arr[0] = arr.pop()
  bubbleDown(0)
  return root`;

export default function HeapsPage() {
    const [inputValue, setInputValue] = useState("");
    const [heapType, setHeapType] = useState<'MIN' | 'MAX'>('MIN');
    const [array, setArray] = useState<number[]>([]);
    
    const [steps, setSteps] = useState<HeapStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
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
                        // Persist
                        if (steps.length > 0) {
                            setArray(steps[steps.length - 1].array);
                        }
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        array: array,
        treeNodes: [], // Need initial tree view?
        comparingIndices: [],
        swappingIndices: [],
        message: "Empty Heap",
        lineNumber: undefined
    };

    const handleInsert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        if (isProcessing) return;
        setIsProcessing(true);
        
        const gen = generateHeapInsertSteps(array, val, heapType);
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
        setInputValue("");
    };

    const handleExtract = () => {
        if (array.length === 0) return;
        if (isProcessing) return;
        setIsProcessing(true);

        const gen = generateHeapExtractSteps(array, heapType);
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setArray([]);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Heap Cleared");
    };

    // Helper to rebuild tree from array
    const buildTreeFromArray = (arr: number[], index: number = 0): TreeNode | null => {
        if (index >= arr.length) return null;
        
        const node: TreeNode = {
            id: index.toString(),
            value: arr[index],
            left: null,
            right: null,
            highlighted: stepData.comparingIndices.includes(index) || stepData.swappingIndices.includes(index)
        };
        
        node.left = buildTreeFromArray(arr, 2 * index + 1);
        node.right = buildTreeFromArray(arr, 2 * index + 2);
        
        return node;
    };

    const rootNode = buildTreeFromArray(stepData.array);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/trees" />
            <div className="flex justify-between items-center">
                 <div>
                     <h1 className="text-3xl font-bold text-foreground mb-2">Binary Heaps</h1>
                     <p className="text-muted-foreground">Priority Queue implementation using arrays. Supports {heapType === 'MIN' ? 'Min' : 'Max'} Heap property.</p>
                 </div>
                 <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button onClick={() => { setHeapType('MIN'); handleReset(); }} className={`px-3 py-1 rounded text-sm font-bold ${heapType === 'MIN' ? 'bg-white shadow text-indigo-600' : 'text-zinc-500'}`}>Min Heap</button>
                    <button onClick={() => { setHeapType('MAX'); handleReset(); }} className={`px-3 py-1 rounded text-sm font-bold ${heapType === 'MAX' ? 'bg-white shadow text-indigo-600' : 'text-zinc-500'}`}>Max Heap</button>
                 </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                        
                        {/* Tree View */}
                        {rootNode && (
                             <TreeVisualizer 
                                 root={rootNode}
                                 width={800}
                                 height={400}
                             />
                        )}
                        {/* If array is empty show message */}
                         {array.length === 0 && steps.length === 0 && <span className="text-zinc-400">Heap is Empty</span>}
                         
                         {/* Array View at bottom */}
                         <div className="mt-8 flex gap-1">
                             {stepData.array.map((v, i) => (
                                 <div key={i} className={`w-8 h-8 flex items-center justify-center border rounded text-xs ${stepData.comparingIndices.includes(i) ? 'bg-yellow-200 border-yellow-500' : stepData.swappingIndices.includes(i) ? 'bg-indigo-200 border-indigo-500' : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'}`}>
                                     {v}
                                 </div>
                             ))}
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
                     <CodeHighlight code={HEAP_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div className="flex gap-2">
                                     <input 
                                        type="number"
                                        value={inputValue} 
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder="Value"
                                        disabled={isProcessing}
                                    />
                                    <button onClick={handleInsert} disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                        Insert
                                    </button>
                                </div>
                                
                                <button onClick={handleExtract} disabled={isProcessing || array.length === 0} className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <ArrowUp className="w-4 h-4" /> Extract {heapType === 'MIN' ? 'Min' : 'Max'}
                                </button>
                                
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Clear
                                </button>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}
