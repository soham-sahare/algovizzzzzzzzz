"use client";

import { useEffect, useState, useRef } from "react";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateDNFSteps } from "@/lib/algorithms/techniques/dnf";
import { SortingStep } from "@/lib/algorithms/sorting/selectionSort";
import { Play, Pause, RotateCcw } from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { motion } from "framer-motion";

const dnfCode = `function sort012(arr)
  low = 0, mid = 0, high = n-1
  while mid <= high
    if arr[mid] == 0:
      swap(low, mid)
      low++, mid++
    else if arr[mid] == 1:
      mid++
    else: // arr[mid] == 2
      swap(mid, high)
      high--`;

export default function DNFPage() {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [message, setMessage] = useState("Ready to sort colors.");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateRandomArray();
  }, []);

  useEffect(() => {
    if (isPlaying) {
       if (currentStep < steps.length) {
         const step = steps[currentStep];
         const labels = step.labels || {};
         // Simple status update based on action
         if (labels[step.swapping[0]]) {
             setMessage("Swapping elements...");
         } else {
             setMessage("Checking element at Mid...");
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
    setMessage("Ready to sort colors.");
    // Generate 0s, 1s, 2s
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 3));
    setArray(newArray);
    const generator = generateDNFSteps(newArray);
    setSteps(Array.from(generator));
  };

  const currentStepData = steps[currentStep] || { 
    array: array, 
    comparing: [], 
    swapping: [], 
    sorted: [],
    labels: {}
  };

  const getBarColor = (val: number) => {
      if (val === 0) return "bg-red-500 dark:bg-red-600";
      if (val === 1) return "bg-zinc-200 dark:bg-zinc-600";
      return "bg-blue-500 dark:bg-blue-600";
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-foreground mb-2">Dutch National Flag Algorithm</h1>
           <p className="text-muted-foreground">Sort an array of 0s, 1s, and 2s in a single pass (O(n)).</p>
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
            {/* Custom Visualizer for DNF to show Colors clearly */}
            <div className="h-64 flex items-end justify-center gap-1 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {currentStepData.array.map((value, index) => {
                    const isSwapping = currentStepData.swapping.includes(index);
                    const isComparing = currentStepData.comparing.includes(index);
                    
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end group relative h-full">
                            {/* Labels */}
                            {currentStepData.labels?.[index] && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -top-10 z-10 whitespace-nowrap"
                                >
                                    <span className="px-2 py-1 text-xs font-bold bg-zinc-800 text-white rounded shadow-sm">
                                        {currentStepData.labels[index]}
                                    </span>
                                     <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-zinc-800 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                                </motion.div>
                            )}

                            {/* Bar */}
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`w-full max-w-[40px] rounded-t-lg relative ${getBarColor(value)} ${isSwapping ? 'brightness-125 scale-105 z-10 ring-2 ring-yellow-400' : ''} ${isComparing ? 'ring-2 ring-purple-400' : ''}`}
                                style={{ height: `${(value + 1) * 33}%` }} // Scale 0->33%, 1->66%, 2->99%
                            >
                                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold ${value === 1 ? 'text-zinc-800' : 'text-white'}`}>
                                    {value}
                                </span>
                            </motion.div>
                            
                            {/* Index */}
                            <span className="text-[10px] text-zinc-400 mt-2 font-mono">{index}</span>
                        </div>
                    );
                })}
            </div>
             
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
                <CodeHighlight code={dnfCode} activeLine={currentStepData.lineNumber} />
            </div>

             <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-foreground mb-3 font-sans">Time Complexity</h3>
                <div className="space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">One Pass</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(n)</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                     <h4 className="font-semibold mb-2">Strategy:</h4>
                     <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">
                        Maintain three regions:
                     </p>
                     <ul className="list-disc list-inside space-y-1 text-zinc-500 dark:text-zinc-400">
                        <li><span className="text-red-500 font-bold">0s</span>: [0 ... low-1]</li>
                        <li><span className="text-zinc-400 font-bold">1s</span>: [low ... high]</li>
                        <li><span className="text-blue-500 font-bold">2s</span>: [high+1 ... n]</li>
                     </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
