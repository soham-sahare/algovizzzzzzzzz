"use client";

import { useEffect, useState, useRef } from "react";
import ArrayVisualizer from "@/components/visualizations/ArrayVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateBinarySearchSteps } from "@/lib/algorithms/searching/binarySearch";
import { SortingStep } from "@/lib/algorithms/sorting/selectionSort";
import { Play, Pause, RotateCcw, FastForward, Search } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const binarySearchCode = `function binarySearch(arr, target)
  left = 0, right = n - 1
  while left <= right
    mid = left + (right - left) / 2
    if arr[mid] == target
      return mid
    if arr[mid] < target
      left = mid + 1
    else
      right = mid - 1
  return -1`;

export default function BinarySearchPage() {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("Ready to search");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateSortedArray();
  }, []);

  useEffect(() => {
    if (isPlaying) {
       if (currentStep < steps.length) {
         const step = steps[currentStep];
         // Logic based on lines or state
         if (step.lineNumber === 2) {
             setMessage(`Calculating mid...`);
         } else if (step.lineNumber === 4) {
             setMessage(`Found target at index ${step.sorted[0]}!`);
         } else if (step.lineNumber === 6) {
             setMessage(`Target > arr[mid]. Searching right half...`);
         } else if (step.lineNumber === 8) {
             setMessage(`Target < arr[mid]. Searching left half...`);
         } else if (step.lineNumber === 9) {
             setMessage(`Element not found in the array.`);
         }
      }

      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
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
  }, [isPlaying, speed, steps.length, currentStep]);

  const generateSortedArray = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setMessage("Ready to search");
    // Generate sorted array
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b);
    setArray(newArray);
    setSteps([]);
  };

  const handleSearch = () => {
    const targetVal = parseInt(target);
    if (isNaN(targetVal)) return;

    setCurrentStep(0);
    setMessage(`Starting binary search for ${targetVal}...`);
    const generator = generateBinarySearchSteps(array, targetVal);
    setSteps(Array.from(generator));
    setIsPlaying(true);
  };

  const currentStepData = steps[currentStep] || { 
    array: array, 
    comparing: [], 
    swapping: [], 
    sorted: [],
    labels: {}
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-foreground mb-2">Binary Search Visualization</h1>
           <p className="text-muted-foreground">Efficiently finds an element in a <strong>sorted</strong> array by repeatedly dividing the search interval in half.</p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={generateSortedArray}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
             >
                <RotateCcw className="w-4 h-4" /> New Sorted Array
             </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            <ArrayVisualizer 
                array={currentStepData.array}
                comparingIndices={currentStepData.comparing}
                swappingIndices={currentStepData.swapping}
                sortedIndices={currentStepData.sorted}
                labels={currentStepData.labels}
            />
             
             {/* Controls */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6 shadow-sm dark:shadow-none">
                
                {/* Search Input Row */}
                <div className="flex w-full items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            type="number" 
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="Enter number (must be in array to find)..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={!target}
                        className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        Search
                    </button>
                </div>

                <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

                {/* Status Message */}
                <div className="text-center font-medium text-lg text-zinc-800 dark:text-zinc-200 animate-pulse">
                    {message}
                </div>

                {/* Playback Controls */}
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            disabled={steps.length === 0}
                            className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-white text-black rounded-full shadow-lg shadow-black/5 dark:shadow-white/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current ml-1 w-5 h-5" />}
                        </button>
                        <div className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">
                           {steps.length > 0 ? `Step: ${currentStep} / ${steps.length - 1}` : "Ready to search"}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-zinc-500 text-sm font-medium">Speed</span>
                        <input 
                            type="range" 
                            min="10" 
                            max="500" 
                            value={510 - speed} 
                            onChange={(e) => setSpeed(510 - parseInt(e.target.value))}
                            className="w-24 md:w-32 accent-zinc-900 dark:accent-white h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Pseudocode</h3>
                <CodeHighlight code={binarySearchCode} activeLine={currentStepData.lineNumber} />
            </div>

             <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-foreground mb-3 font-sans">Time Complexity</h3>
                <div className="space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Best Case</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Average Case</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(log n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Worst Case</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(log n)</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
