"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import TreeVisualizer from "@/components/visualizations/TreeVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    TreeNode, 
    generateBSTSearchSteps, 
    TreeStep 
} from "@/lib/algorithms/tree/bst";
import { 
    generateAVLInsertSteps 
} from "@/lib/algorithms/tree/avl";
import { Play, Pause, Search, Plus, RotateCcw } from "lucide-react";

const INSERT_CODE = `function insert(node, key):
  if !node: return newNode(key)
  if key < node.key: node.left = insert(node.left, key)
  else: node.right = insert(node.right, key)
  
  balance = getBalance(node)
  
  // Left Left
  if balance > 1 and key < node.left.key:
    return rotateRight(node)
  // Right Right
  if balance < -1 and key > node.right.key:
    return rotateLeft(node)
  // Left Right
  if balance > 1 and key > node.left.key:
    node.left = rotateLeft(node.left)
    return rotateRight(node)
  // Right Left
  if balance < -1 and key < node.right.key:
    node.right = rotateRight(node.right)
    return rotateLeft(node)
    
  return node`;

export default function AVLPage() {
    // Initial Tree
    const [root, setRoot] = useState<TreeNode | null>(null);
    
    // Playback State
    const [steps, setSteps] = useState<TreeStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("AVL Tree Empty");
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [inputValue, setInputValue] = useState("30");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Playback
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        setIsProcessing(false);
                        // Apply final
                        if (steps.length > 0) {
                            const last = steps[steps.length - 1];
                            if (last.root !== undefined) setRoot(last.root);
                            setMessage("Operation Complete");
                        }
                        return prev;
                    }
                });
            }, speed);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
             if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, speed, steps]);
    
    const stepData = steps.length > 0 && currentStep < steps.length 
        ? steps[currentStep] 
        : { root: root, highlightedNodes: [], activeNodeId: undefined, message };

    const executeOperation = (generator: Generator<TreeStep>) => {
        if (isProcessing) return;
        setIsProcessing(true);
        const newSteps = Array.from(generator);
        if (newSteps.length === 0) {
            setIsProcessing(false);
            return;
        }
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleInsert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        executeOperation(generateAVLInsertSteps(root, val));
        setInputValue((Math.floor(Math.random() * 50) + 1).toString());
    };

    const handleSearch = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        executeOperation(generateBSTSearchSteps(root, val)); // Search is same as BST
    };

    const handleReset = () => {
        setRoot(null);
        setSteps([]);
        setMessage("Tree cleared.");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/trees" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">AVL Tree (Self-Balancing)</h1>
                 <p className="text-muted-foreground">Self-balancing BST using rotations to maintain O(log n) height.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="flex justify-center min-h-[500px]">
                        <TreeVisualizer 
                            root={stepData.root} 
                            highlightedNodes={stepData.highlightedNodes} 
                            activeNodeId={stepData.activeNodeId}
                            width={700}
                            height={500}
                        />
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
                        <CodeHighlight code={INSERT_CODE} activeLine={stepData.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={inputValue} 
                                        onChange={(e) => setInputValue(e.target.value)} 
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder="Val"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={handleInsert} disabled={isProcessing} className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                       <Plus className="w-4 h-4" /> Insert
                                    </button>
                                     <button onClick={handleSearch} disabled={isProcessing} className="flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                       <Search className="w-4 h-4" /> Search
                                    </button>
                                </div>
                                
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Clear Tree
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
