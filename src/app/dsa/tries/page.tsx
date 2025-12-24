"use client";

import { useEffect, useState } from "react";
import BackButton from "@/components/ui/BackButton";
import TrieVisualizer from "@/components/visualizations/TrieVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { TrieNode, generateTrieInsertSteps, generateTrieSearchSteps, generateTrieDeleteSteps, TrieStep, generateTrieStartsWithSteps } from "@/lib/algorithms/tree/trie";
import { Play, Pause, RotateCcw, Plus, Search, Trash, Type } from "lucide-react";

// ... existing code snippet map ...
const CODES = {
    insert: `function insert(word):
  node = root
  for char in word:
    if char not in node.children:
      node.children[char] = new Node()
    node = node.children[char]
  node.isEndOfWord = true`,
    search: `function search(word):
  node = root
  for char in word:
    if char not in node.children:
      return false
    node = node.children[char]
  return node.isEndOfWord`,
    startsWith: `function startsWith(prefix):
  node = root
  for char in prefix:
    if char not in node.children:
      return false
    node = node.children[char]
  return true`,
    delete: `function delete(word):
  find node for word
  if not found or not endOfWord: return
  unmark endOfWord
  prune nodes upwards if empty`
};

export default function TriePage() {
    const [trieRoot, setTrieRoot] = useState<TrieNode>({ id: "root", value: "", children: {}, isEndOfWord: false });
    const [inputValue, setInputValue] = useState("");
    const [mode, setMode] = useState<'INSERT' | 'SEARCH' | 'STARTSWITH' | 'DELETE'>('INSERT');

    const [steps, setSteps] = useState<TrieStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
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
                        // Persist final state
                        const finalRoot = steps[steps.length - 1].root;
                        setTrieRoot(finalRoot);
                        return prev;
                    }
                });
            }, speed);
            return () => clearInterval(timer);
        }
    }, [isPlaying, speed, steps]);

    const handleRun = () => {
        if (!inputValue || isProcessing) return;
        
        setIsProcessing(true);
        let gen;
        if (mode === 'INSERT') gen = generateTrieInsertSteps(trieRoot, inputValue);
        else if (mode === 'SEARCH') gen = generateTrieSearchSteps(trieRoot, inputValue);
        else if (mode === 'STARTSWITH') gen = generateTrieStartsWithSteps(trieRoot, inputValue);
        else gen = generateTrieDeleteSteps(trieRoot, inputValue);

        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setTrieRoot({ id: "root", value: "", children: {}, isEndOfWord: false });
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsProcessing(false);
        setMessage("Reset Trie");
    };

    const stepData = steps.length > 0 ? steps[currentStep] : { 
        root: trieRoot, 
        activeNodeId: null,
        message: "Enter text to start",
        highlightPath: undefined 
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/tries" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Trie (Prefix Tree)</h1>
                 <p className="text-muted-foreground">Efficiently store and retrieve keys in a dataset of strings.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-[500px] overflow-hidden relative">
                         <div className="absolute inset-0 overflow-auto">
                            <TrieVisualizer 
                                root={stepData.root}
                                activeNodeId={stepData.activeNodeId}
                                highlightPath={stepData.highlightPath}
                            />
                         </div>
                     </div>

                    {/* Status */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stepData.message || message}</span></span>
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
                         {/* Controls */}
                        <div className="flex gap-2 mb-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                            {[
                                { m: 'INSERT', icon: Plus }, 
                                { m: 'SEARCH', icon: Search },
                                { m: 'STARTSWITH', icon: Type },
                                { m: 'DELETE', icon: Trash }
                            ].map(item => (
                                <button
                                    key={item.m}
                                    onClick={() => { setMode(item.m as any); setSteps([]); setIsPlaying(false); setIsProcessing(false); }}
                                    className={`flex-1 p-2 rounded-md flex justify-center items-center transition ${mode === item.m ? 'bg-white dark:bg-zinc-700 shadow text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                                    title={item.m}
                                >
                                    <item.icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>

                        <CodeHighlight code={CODES[mode.toLowerCase() as keyof typeof CODES]} />

                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div>
                                    <label className="text-xs uppercase text-zinc-500 font-bold mb-2 block">Word / Prefix</label>
                                    <input 
                                        type="text"
                                        value={inputValue} 
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder={mode === 'STARTSWITH' ? "Enter prefix..." : "Enter word..."}
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Run {mode}
                                </button>
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset Trie
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
