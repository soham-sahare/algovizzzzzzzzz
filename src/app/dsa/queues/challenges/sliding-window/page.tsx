"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    generateSlidingWindowMaxSteps, 
    SlidingWindowStep 
} from "@/lib/algorithms/queue/challenges";
import { Play, Pause, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CODE = `function maxSlidingWindow(nums, k):
  deque = [] // indices
  result = []
  for i, n in enumerate(nums):
    // 1. Remove out of window
    if deque and deque[0] < i - k + 1:
      deque.shift()
    // 2. Remove smaller elements from rear
    while deque and nums[deque[-1]] < n:
      deque.pop()
    deque.push(i)
    // 3. Add to result
    if i >= k - 1:
      result.push(nums[deque[0]])
  return result`;

export default function SlidingWindowPage() {
    const [array, setArray] = useState([1, 3, -1, -3, 5, 3, 6, 7]);
    const [k, setK] = useState(3);
    
    const [steps, setSteps] = useState<SlidingWindowStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [message, setMessage] = useState("Ready");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // We update UI based on steps only
    const step = steps[currentStep] || { 
        array: array, 
        windowStart: 0, 
        windowEnd: -1, 
        deque: [], 
        result: [], 
        highlightedIndices: [], 
        message: "Ready", 
        lineNumber: undefined 
    };

    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    const handleRun = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const gen = generateSlidingWindowMaxSteps(array, k);
        const newSteps = Array.from(gen);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setArray([1, 3, -1, -3, 5, 3, 6, 7]);
        setSteps([]);
        setCurrentStep(0);
        setIsProcessing(false);
        setIsPlaying(false);
        setMessage("Reset");
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/queues" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Sliding Window Maximum</h1>
                 <p className="text-muted-foreground">Find the maximum element in each window of size K using a Deque.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 min-h-[400px] flex flex-col items-center justify-between gap-8">
                        
                        {/* 1. Array with Window Box */}
                         <div className="flex gap-2 relative p-4 overflow-x-auto w-full justify-center">
                            {/* Window Highlight Overlay */}
                             {step.windowEnd >= 0 && (
                                 <motion.div 
                                     layoutId="window-box"
                                     className="absolute border-2 border-indigo-500 rounded-lg bg-indigo-500/10 pointer-events-none z-10"
                                     style={{
                                         left: `calc(50% - ${(array.length * 48) / 2}px + ${step.windowStart * 48}px - 4px)`,
                                         width: `${(step.windowEnd - step.windowStart + 1) * 48}px`,
                                         height: "100%",
                                         top: 0
                                     }}
                                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                 />
                             )}
                             
                            {step.array.map((val, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 w-10 shrink-0">
                                    <div className={`w-10 h-10 flex items-center justify-center border rounded font-bold bg-white dark:bg-zinc-800 z-0
                                         ${step.highlightedIndices?.includes(i) ? "bg-yellow-100 border-yellow-500" : "border-zinc-200 dark:border-zinc-700"}
                                    `}>
                                        {val}
                                    </div>
                                    <span className="text-[10px] text-zinc-400">{i}</span>
                                </div>
                            ))}
                        </div>

                         {/* 2. Deque Visualization */}
                        <div className="flex flex-col items-center w-full">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Deque (Indices)</h4>
                             <div className="flex gap-2 items-center justify-center min-h-[50px] border-2 border-dashed border-zinc-300 rounded-lg px-8 py-2 bg-zinc-50/50 dark:bg-zinc-900/20">
                                 <AnimatePresence>
                                     {step.deque.map((idx, i) => (
                                         <motion.div
                                             key={`${i}-${idx}`}
                                             initial={{ scale: 0 }} 
                                             animate={{ scale: 1 }}
                                             exit={{ scale: 0 }}
                                             className="flex flex-col items-center"
                                         >
                                             <div className="w-10 h-10 flex items-center justify-center rounded bg-purple-100 text-purple-700 border border-purple-300 font-bold dark:bg-purple-900/40 dark:text-purple-200">
                                                 {step.array[idx]}
                                             </div>
                                             <span className="text-[9px] text-zinc-400 mt-1">idx {idx}</span>
                                         </motion.div>
                                     ))}
                                 </AnimatePresence>
                                 {step.deque.length === 0 && <span className="text-xs text-zinc-400">Empty</span>}
                             </div>
                        </div>

                         {/* 3. Result Array */}
                         <div className="flex flex-col items-center w-full">
                             <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Result Array</h4>
                            <div className="flex gap-2 flex-wrap justify-center min-h-[40px]">
                                {step.result.map((val, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-emerald-100 text-emerald-700 font-bold text-sm border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200"
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status & Playback */}
                     <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{message}</span></span>
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
                        <CodeHighlight code={CODE} activeLine={step.lineNumber} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Parameters</h3>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium block">Array (comma sep)</label>
                                    <input 
                                        type="text" 
                                        value={array.join(", ")} 
                                        onChange={(e) => setArray(e.target.value.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x)))} 
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium block">Window Size (K)</label>
                                    <input 
                                        type="number" 
                                        value={k} 
                                        min="1"
                                        max={array.length}
                                        onChange={(e) => setK(parseInt(e.target.value))} 
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                        disabled={isProcessing}
                                    />
                                </div>
                                
                                <button onClick={handleRun} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Play className="w-4 h-4" /> Start Visualization
                                </button>
                                <button onClick={handleReset} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-foreground py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RefreshCcw className="w-4 h-4" /> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
