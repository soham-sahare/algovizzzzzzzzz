"use client";

import { useEffect, useState } from "react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import BackButton from "@/components/ui/BackButton";
import { Play, Pause, Search } from "lucide-react";
import { SearchingStep } from "@/lib/algorithms/searching/linearSearch";
import { generateExponentialSearchSteps } from "@/lib/algorithms/searching/exponentialSearch";

const exponentialSearchCode = `function exponentialSearch(arr, x):
  if arr[0] == x: return 0
  i = 1
  while i < n and arr[i] <= x:
    i *= 2
  return binarySearch(arr, i/2, min(i, n-1), x)`;

export default function ExponentialSearchPage() {
    const [array, setArray] = useState<number[]>([]);
    const [target, setTarget] = useState("");
    const [steps, setSteps] = useState<SearchingStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Enter target and search");

    useEffect(() => {
        generateSortedArray();
    }, []);

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

    const generateSortedArray = () => {
        const newArray = Array.from({ length: 25 }, () => Math.floor(Math.random() * 100)).sort((a,b) => a-b);
        setArray(newArray);
        setSteps([]);
        setCurrentStep(0);
        setMessage("Sorted Array Generated.");
        setIsPlaying(false);
    };

    const handleSearch = () => {
        const t = parseInt(target);
        if (isNaN(t)) return;
        
        const generator = generateExponentialSearchSteps(array, t);
        setSteps(Array.from(generator));
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const stepData = steps[currentStep] || { 
        array: array, 
        indices: [], 
        message: message, 
        found: false 
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/arrays/searching" />
            
            <div className="flex justify-between items-center">
                <div>
                     <h1 className="text-3xl font-bold text-foreground mb-2">Exponential Search</h1>
                     <p className="text-muted-foreground">Find range where element is present, then perform Binary Search. Good for unbounded or infinite arrays.</p>
                </div>
                <button onClick={generateSortedArray} className="px-4 py-2 bg-zinc-100 font-bold rounded hover:bg-zinc-200 text-sm">New Array</button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-8 min-h-[300px] flex items-center justify-center">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {stepData.array.map((val, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded transition-all duration-300
                                        ${stepData.found && stepData.indices.includes(idx) ? 'bg-emerald-500 text-white scale-110' : 
                                          stepData.indices.includes(idx) ? 'bg-indigo-500 text-white scale-110' : 
                                          'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'}`}
                                >
                                    {val}
                                </div>
                            ))}
                        </div>
                     </div>

                    {/* Controls */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
                        <div className="flex gap-4">
                            <input 
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder="Target"
                                className="px-3 py-2 rounded border w-24"
                                type="number"
                            />
                            <button onClick={handleSearch} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">
                                <Search className="w-4 h-4"/> Search
                            </button>
                        </div>
                        
                        <div className="flex justify-between items-center bg-white dark:bg-zinc-800 p-2 rounded">
                            <span className="font-mono text-sm text-zinc-600 dark:text-zinc-300 ml-2">{stepData.message}</span>
                            <button onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
                            </button>
                        </div>
                     </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                     <CodeHighlight code={exponentialSearchCode} activeLine={stepData.lineNumber} />
                     
                      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                            <h3 className="font-bold text-foreground">Complexity</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block mb-1">Time</span>
                                    <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">O(log i)</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Space</span>
                                    <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">O(1)</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Where i is the index of element.</p>
                        </div>
                </div>
            </div>
        </div>
    );
}
