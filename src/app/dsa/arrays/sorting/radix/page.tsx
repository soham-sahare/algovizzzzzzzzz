"use client";

import { useEffect, useState } from "react";
import ArrayVisualizer from "@/components/visualizations/ArrayVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateRadixSortSteps } from "@/lib/algorithms/sorting/radixSort";
import { SortingStep } from "@/lib/algorithms/sorting/selectionSort";
import { Play, Pause, RotateCcw } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const radixSortCode = `function radixSort(arr):
  max = getMax(arr)
  exp = 1
  while max / exp > 0:
    countingSortByDigit(arr, exp)
    exp *= 10`;

export default function RadixSortPage() {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    generateRandomArray();
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
  }, [isPlaying, speed, steps.length]);

  const generateRandomArray = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    // Radix sort usually for larger numbers
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 900) + 10);
    setArray(newArray);
    
    // Pre-calculate steps
    const generator = generateRadixSortSteps([...newArray]);
    setSteps(Array.from(generator));
  };

  const currentStepData = steps[currentStep] || { 
    array: array, 
    comparing: [], 
    swapping: [], 
    sorted: [] 
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton href="/dsa/arrays/sorting" />
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Radix Sort</h1>
        <p className="text-muted-foreground">Non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by individual digits.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ArrayVisualizer 
            array={currentStepData.array}
            comparingIndices={currentStepData.comparing}
            swappingIndices={currentStepData.swapping}
            sortedIndices={currentStepData.sorted}
          />

          {/* Controls */}
          <div className="p-6 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
             <div className="text-center font-mono font-medium text-lg min-h-[2rem]">
                 {currentStepData.message || "Ready"}
             </div>
             
             <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                     <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                     >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 transform ml-0.5" />}
                     </button>
                     <button 
                        onClick={generateRandomArray}
                        className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                     >
                        <RotateCcw className="w-5 h-5" />
                     </button>
                 </div>
                 
                  <div className="flex items-center gap-2 flex-grow">
                     <input 
                         type="range" 
                         min="1" 
                         max="1000" 
                         step="50"
                         value={1100 - speed} 
                         onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                         className="flex-grow accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                     />
                     <span className="text-xs text-zinc-500 font-mono w-16 text-right">
                         {(1100 - speed)}ms
                     </span>
                 </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <CodeHighlight code={radixSortCode} activeLine={currentStepData.lineNumber} />
          
           <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-bold text-foreground">Complexity</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground block mb-1">Time</span>
                        <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded">O(d * (n + k))</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block mb-1">Space</span>
                        <span className="font-mono bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded">O(n + k)</span>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Where d is digits, k is base (10).</p>
           </div>
        </div>
      </div>
    </div>
  );
}
