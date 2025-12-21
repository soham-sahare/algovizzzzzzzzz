"use client";

import { useEffect, useState, useRef } from "react";
import ArrayVisualizer from "@/components/visualizations/ArrayVisualizer";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generatePrefixSumSteps } from "@/lib/algorithms/techniques/prefixSum";
import { SortingStep } from "@/lib/algorithms/sorting/selectionSort";
import { Play, Pause, RotateCcw, Calculator } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

const prefixSumCode = `function buildPrefixSum(arr)
  P[0] = arr[0]
  for i = 1 to n-1
    P[i] = P[i-1] + arr[i]
  
  // Range Query(L, R)
  if L == 0: return P[R]
  return P[R] - P[L-1]`;

export default function PrefixSumPage() {
  const [array, setArray] = useState<number[]>([]);
  const [prefixArray, setPrefixArray] = useState<number[]>([]); // To show final state
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [message, setMessage] = useState("Ready to start");
  const [queryL, setQueryL] = useState(0);
  const [queryR, setQueryR] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    generateRandomArray();
  }, []);

  useEffect(() => {
    if (isPlaying) {
       if (currentStep < steps.length) {
         const step = steps[currentStep];
         
         if (step.lineNumber === 3) {
             const idx = step.comparing[0];
             setMessage(`P[${idx}] = P[${idx-1}] + arr[${idx}]`);
         } else if (step.lineNumber === 5 || step.lineNumber === 6) {
             setMessage(`Calculating Range Sum Query in O(1)...`);
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
    setMessage("Ready to build Prefix Sum Array");
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 20) + 1);
    setArray(newArray);
    
    // Initialize blank prefix visualization
    const P = new Array(10).fill(0);
    setPrefixArray(P);
    
    // Generate build steps
    const generator = generatePrefixSumSteps(newArray);
    setSteps(Array.from(generator));
  };

  const calculateQuery = () => {
    if (queryL > queryR || queryL < 0 || queryR >= array.length) {
       setMessage("Invalid Range (L <= R required)");
       return;
    }
    setIsPlaying(false);
    setMessage(`Querying Sum(${queryL}, ${queryR})...`);
    
    // Regenerate steps to include query
    const generator = generatePrefixSumSteps(array, { l: queryL, r: queryR });
    const newSteps = Array.from(generator);
    setSteps(newSteps);
    // Jump to near end where query happens ? Or just animate query part?
    // For simplicity, let's just animate the whole thing quickly or start from built state if already built?
    // Let's just replay build + query for clarity for now.
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const currentStepData = steps[currentStep] || { 
    array: prefixArray, // Visualizing the PREFIX array being built
    comparing: [], 
    swapping: [], 
    sorted: [],
    labels: {}
  };
  
  // Need to show Original Array too for context
  // But ArrayVisualizer is one instance. 
  // Let's render two visualizers? Or one visualizer for P and a static list for Arr?
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-foreground mb-2">Prefix Sum Visualization</h1>
           <p className="text-muted-foreground">Precompute sums to answer range sum queries in <strong>O(1)</strong> time.</p>
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
        <div className="lg:col-span-2 space-y-8">
            {/* Original Array Static/Simple View */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Original Array (arr)</h3>
                <div className="flex justify-center gap-1">
                    {array.map((val, idx) => (
                        <div key={idx} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold 
                            ${(idx >= queryL && idx <= queryR && isPlaying) ? 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 border border-yellow-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}
                        `}>
                            {val}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-1 mt-1">
                    {array.map((_, idx) => (
                        <div key={idx} className="w-8 text-center text-[10px] text-zinc-400">{idx}</div>
                    ))}
                </div>
            </div>

            <div>
                 <h3 className="text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">Prefix Sum Array (P)</h3>
                 <ArrayVisualizer 
                    array={currentStepData.array}
                    comparingIndices={currentStepData.comparing}
                    swappingIndices={currentStepData.swapping}
                    sortedIndices={currentStepData.sorted}
                    labels={currentStepData.labels}
                />
            </div>
             
             {/* Controls */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-6 shadow-sm dark:shadow-none">
                
                {/* Range Query Inputs */}
                <div className="flex w-full items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">L:</span>
                         <input 
                            type="number" 
                            value={queryL}
                            onChange={(e) => setQueryL(parseInt(e.target.value))}
                            className="w-16 px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">R:</span>
                         <input 
                            type="number" 
                            value={queryR}
                            onChange={(e) => setQueryR(parseInt(e.target.value))}
                            className="w-16 px-2 py-1 bg-white dark:bg-zinc-800 border rounded"
                        />
                    </div>
                     <button 
                        onClick={calculateQuery}
                        className="ml-auto px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center gap-2"
                    >
                        <Calculator className="w-4 h-4" /> Calculate Sum
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
                <CodeHighlight code={prefixSumCode} activeLine={currentStepData.lineNumber} />
            </div>

             <div className="bg-white dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-foreground mb-3 font-sans">Time Complexity</h3>
                <div className="space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Preprocessing</span>
                        <span className="text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">O(n)</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-600 dark:text-zinc-500">Range Query</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded">O(1)</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                     <h4 className="font-semibold mb-2">Usage:</h4>
                     <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Extremely useful for scenarios where the array is static but strict range sum queries are frequent.
                     </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
