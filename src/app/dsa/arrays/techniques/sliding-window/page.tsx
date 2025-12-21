"use client";

import { useEffect, useState, useRef } from "react";
import ArrayVisualizer from "@/components/visualizations/ArrayVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateSlidingWindowSteps } from "@/lib/algorithms/techniques/slidingWindow";
import { SortingStep } from "@/lib/algorithms/sorting/selectionSort";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const slidingWindowCode = `function maxSum(arr, k)
  currentSum = 0
  for i = 0 to k-1
    currentSum += arr[i]
  maxSum = currentSum
  
  for i = k to n-1
    currentSum += arr[i] - arr[i-k]
    maxSum = max(maxSum, currentSum)
  
  return maxSum`;

export default function SlidingWindowPage() {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [k, setK] = useState(3);
  const [message, setMessage] = useState("Ready to start");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateRandomArray();
  }, []);

  useEffect(() => {
    if (isPlaying) {
       if (currentStep < steps.length) {
         const step = steps[currentStep];
         
         if (step.lineNumber === 2) {
             setMessage(`Initializing window... Adding elements.`);
         } else if (step.lineNumber === 3) {
             setMessage(`Initial Window Sum Calculated.`);
         } else if (step.lineNumber === 5) {
             setMessage(`Sliding... Subtracting outgoing, Adding incoming.`);
         } else if (step.lineNumber === 7) {
             setMessage(`New Maximum Sum Found!`);
         } else if (step.lineNumber === 8) {
             setMessage(`Finished! Max Window Highlighted.`);
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

  const generateRandomArray = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setMessage("Ready to start");
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 50) + 10);
    setArray(newArray);
    setSteps([]);
  };

  const handleStart = () => {
    const kVal = parseInt(String(k));
    if (isNaN(kVal) || kVal <= 0 || kVal > array.length) {
        setMessage("Invalid Window Size (K)");
        return;
    }

    setCurrentStep(0);
    setMessage(`Finding max sum subarray of size ${kVal}...`);
    const generator = generateSlidingWindowSteps(array, kVal);
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
           <h1 className="text-3xl font-bold text-foreground mb-2">Sliding Window Visualization</h1>
           <p className="text-muted-foreground">Find the maximum sum of any contiguous subarray of size <strong>k</strong>.</p>
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
                labels={currentStepData.labels}
            />
             
             {/* Controls */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6 shadow-sm dark:shadow-none">
                
                {/* Window Size Input */}
                <div className="flex w-full items-center gap-4">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500">Window Size (K):</span>
                        <input 
                            type="number" 
                            value={k}
                            onChange={(e) => setK(parseInt(e.target.value))}
                            min="1"
                            max="15"
                            className="w-full pl-36 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 font-mono"
                        />
                    </div>
                    <button 
                        onClick={handleStart}
                        disabled={!k}
                        className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        Start
                    </button>
                </div>

                <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

                {/* Status Message */}
                <div className="text-center font-medium text-lg text-zinc-800 dark:text-zinc-200 animate-pulse min-h-[1.75rem]">
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
                           {steps.length > 0 ? `Step: ${currentStep} / ${steps.length - 1}` : "Ready"}
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
                <CodeHighlight code={slidingWindowCode} activeLine={currentStepData.lineNumber} />
            </div>

             <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-foreground mb-3 font-sans">Time Complexity</h3>
                <div className="space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Brute Force</span>
                        <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10 px-2 py-0.5 rounded">O(n*k)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Sliding Window</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(n)</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                     <h4 className="font-semibold mb-2">Why it works:</h4>
                     <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Instead of recalculating the sum of the entire window every time (which takes O(k)), we simply subtract the element going out and add the element coming in (O(1)).
                     </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
