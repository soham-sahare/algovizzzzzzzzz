"use client";

import { useEffect, useState, useRef } from "react";
import ArrayVisualizer from "@/components/visualizations/ArrayVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateKadanesSteps } from "@/lib/algorithms/techniques/kadanes";
import { SortingStep } from "@/lib/algorithms/sorting/selectionSort";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const kadanesCode = `function maxSubArray(arr)
  currentSum = arr[0]
  maxSum = arr[0]
  
  for i = 1 to n-1
    if arr[i] > currentSum + arr[i]
       currentSum = arr[i]
    else
       currentSum += arr[i]
    
    if currentSum > maxSum
       maxSum = currentSum
       
  return maxSum`;

export default function KadanesPage() {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
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
             setMessage(`Evaluating next element...`);
         } else if (step.lineNumber === 3) {
             const label = Object.values(step.labels || {})[0];
             if (label?.includes("Start New")) {
                 setMessage(`Current sum is negative (or less than element). Restarting subarray!`);
             } else {
                 setMessage(`Extending current subarray.`);
             }
         } else if (step.lineNumber === 5) {
             setMessage(`Found a larger sum! Updating Max Sum.`);
         } else if (step.lineNumber === 6) {
             setMessage(`Traversal complete. Max Subarray Highlighted.`);
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
    // Generate array with both positive and negative numbers
    const newArray = Array.from({ length: 14 }, () => Math.floor(Math.random() * 50) - 20);
    setArray(newArray);
    const generator = generateKadanesSteps(newArray);
    setSteps(Array.from(generator));
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
           <h1 className="text-3xl font-bold text-foreground mb-2">Kadane's Algorithm Visualization</h1>
           <p className="text-muted-foreground">Find the contiguous subarray with the largest sum in <strong>O(n)</strong> time.</p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={generateRandomArray}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
             >
                <RotateCcw className="w-4 h-4" /> New Random Array
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
                
                {/* Status Message */}
                <div className="text-center font-medium text-lg text-zinc-800 dark:text-zinc-200 animate-pulse min-h-[1.75rem]">
                    {message}
                </div>

                <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800" />

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
                <CodeHighlight code={kadanesCode} activeLine={currentStepData.lineNumber} />
            </div>

             <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-foreground mb-3 font-sans">Time Complexity</h3>
                <div className="space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">All Cases</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(n)</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                     <h4 className="font-semibold mb-2">Key Insight:</h4>
                     <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        If the current subarray sum becomes negative, it's better to restart from the next element than to carry the negative burden forward.
                     </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
