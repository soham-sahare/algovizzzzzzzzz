"use client";

import { useEffect, useState, useRef } from "react";
import ArrayVisualizer from "@/components/visualizations/ArrayVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateBubbleSortSteps, SortingStep } from "@/lib/algorithms/sorting/bubbleSort";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function BubbleSortPage() {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100); // ms delay
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    
    // Pre-calculate steps
    const generator = generateBubbleSortSteps(newArray);
    const generatedSteps: SortingStep[] = [];
    for (const step of generator) {
        generatedSteps.push(step);
    }
    setSteps(generatedSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  // Animation Loop
  useEffect(() => {
    if (isPlaying) {
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
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speed]);

  const currentStepData = steps[currentStep] || {
    array: array,
    comparing: [],
    swapping: [],
    sorted: []
  };

const bubbleSortCode = `for i = 0 to n-1
  for j = 0 to n-i-1
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-foreground mb-2">Bubble Sort Visualization</h1>
           <p className="text-muted-foreground">Repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.</p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={generateRandomArray}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
             >
                <RotateCcw className="w-4 h-4" /> New Array
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
            />
             {/* Controls */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-100 dark:hover:bg-white text-black rounded-full shadow-lg shadow-black/5 dark:shadow-white/10 transition-all active:scale-95"
                    >
                        {isPlaying ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current ml-1 w-5 h-5" />}
                    </button>
                    <div className="text-zinc-600 dark:text-zinc-400 font-mono text-sm">
                        Step: {currentStep} / {steps.length - 1}
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-zinc-500 text-sm font-medium">Speed</span>
                    <input 
                        type="range" 
                        min="10" 
                        max="500" 
                        value={510 - speed} 
                        onChange={(e) => setSpeed(510 - parseInt(e.target.value))}
                        className="w-full md:w-32 accent-zinc-900 dark:accent-white h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-zinc-900 dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                    />
                    <FastForward className="text-zinc-400 dark:text-zinc-500 w-4 h-4" />
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Pseudocode</h3>
                <CodeHighlight code={bubbleSortCode} activeLine={currentStepData.lineNumber} />
            </div>

             <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-foreground mb-3 font-sans">Time Complexity</h3>
                <div className="space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Best Case</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Average Case</span>
                        <span className="text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-400/10 px-2 py-0.5 rounded">O(n²)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Worst Case</span>
                        <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 px-2 py-0.5 rounded">O(n²)</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
