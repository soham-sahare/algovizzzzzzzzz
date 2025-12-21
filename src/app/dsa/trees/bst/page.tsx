"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import TreeVisualizer from "@/components/visualizations/TreeVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    TreeNode, 
    generateBSTInsertSteps, 
    generateBSTSearchSteps, 
    generateInorderTraversal,
    TreeStep 
} from "@/lib/algorithms/tree/bst";
import { Play, Pause, Search, Plus, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const INSERT_CODE = `function insert(root, val):
  if !root: return new Node(val)
  if val < root.val:
    root.left = insert(root.left, val)
  else:
    root.right = insert(root.right, val)
  return root`;

const SEARCH_CODE = `function search(root, val):
  if !root or root.val == val:
    return root
  if val < root.val:
    return search(root.left, val)
  return search(root.right, val)`;

const TRAVERSE_CODE = `function inorder(root):
  if !root: return
  inorder(root.left)
  visit(root)
  inorder(root.right)`;

export default function BSTPage() {
    // Initial Tree
    const [root, setRoot] = useState<TreeNode | null>(null);
    
    // Playback State
    const [steps, setSteps] = useState<TreeStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Tree is empty.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeCode, setActiveCode] = useState(INSERT_CODE);
    
    const [inputValue, setInputValue] = useState("10");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initial build for demo
        // Let's keep it empty initially or build a small one
    }, []);

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
                        // Apply final state
                        if (steps.length > 0) {
                            const last = steps[steps.length - 1];
                            // Only update root if it changed structure
                            if (last.root !== undefined) setRoot(last.root);
                            setMessage("Done");
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
    
    // Step visualizer
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
        setActiveCode(INSERT_CODE);
        executeOperation(generateBSTInsertSteps(root, val));
        // Randomize next input for convenience
         setInputValue((Math.floor(Math.random() * 50) + 1).toString());
    };

    const handleSearch = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        setActiveCode(SEARCH_CODE);
        executeOperation(generateBSTSearchSteps(root, val));
    };

    const handleTraverse = () => {
        setActiveCode(TRAVERSE_CODE);
        executeOperation(generateInorderTraversal(root));
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">Binary Search Tree (BST)</h1>
                 <p className="text-muted-foreground">Ordered binary tree where Left {'<'} Root {'<='} Right.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="flex justify-center">
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
                        <CodeHighlight code={activeCode} activeLine={stepData.lineNumber} />

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
                                
                                <button onClick={handleTraverse} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    Inorder Traversal
                                </button>

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
