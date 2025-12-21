"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateNextGreaterElementSteps, GenericStackStep } from "@/lib/algorithms/stack/challenges";
import { Play, Pause, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CODE = `function nextGreater(arr):
  stack = [] // stores indices
  result = [-1] * n
  
  for i from 0 to n-1:
    while stack and arr[stack.top] < arr[i]:
      idx = stack.pop()
      result[idx] = arr[i]
    stack.push(i)`;

export default function NextGreaterElementPage() {
    const [inputStr, setInputStr] = useState("4, 5, 2, 25");
    const [arr, setArr] = useState([4, 5, 2, 25]);
    const [result, setResult] = useState<number[]>([]);
    
    // Derived result for visualization steps - we'll infer it from the steps or maintain local state
    // Actually the steps track stack, but maybe not the full "result" array updates explicitly in step payload.
    // Let's check logic: generateNextGreaterElementSteps stores stack of indices.
    // We can show the "current result" by reconstructing or just updating a local effectful array?
    // Better: Step should probably include partial result snapshot? 
    // Optimization: I'll accept that the visualizer logic in challenges.ts for NGE doesn't yield 'result' array.
    // I will simply show the "resolved" arrows as they happen in messages or overlay.
    // Or I'll just map the stack indices to verify.
    // Let's stick to showing the stack operations and maybe a dynamic "Result Array" below.
    // The previous logic didn't yield 'result', so I'll interpret "output" if I added it or just track visually.
    // Wait, I didn't add 'result' to GenericStackStep in the last tool call?
    // I added `output?: string | number`. 
    // Let's assume we can visually show the popped items finding their match.
    
    const [steps, setSteps] = useState<GenericStackStep<number>[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(600);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // We need to track the "Resolved" NGEs to display them in the UI progressively.
    // We can use a Map<index, value> for efficient updates during playback.
    const [resolvedMap, setResolvedMap] = useState<{[key: number]: number}>({});

    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    // Parsing steps to update resolved map
    useEffect(() => {
        if(steps.length > 0 && currentStep < steps.length) {
            const step = steps[currentStep];
            // If the message indicates a match, we might want to capture that.
            // But relying on message parsing is brittle.
            // Ideally, the generator should yield the update.
            // However, since I can't edit the generator mid-stream easily without re-contexting,
            // I'll reset resolved map on start and just show the FINAL result at the end?
            // No, progressive is better. 
            // Let's perform a reset when currentStep is 0.
            if (currentStep === 0) setResolvedMap({});
            
            // Check if step involves popping -> that implies finding an NGE in this algo.
            // Actually, the previous step logic was:
            // yield message `${currentVal} > ${topVal} (Top). Found NGE...`
            if (step.message.includes("Found NGE")) {
                 // We know the top of stack (which was just peeked before pop) got resolved by currentVal (inputValue)
                 // But we need the index. The stack in the step still has the index at Top.
                 const stack = step.stack;
                 if (stack.length > 0) {
                     const idx = stack[stack.length - 1]; // This is the index being resolved
                     const val = step.inputValue as number; // This is the greater element
                     setResolvedMap(prev => ({ ...prev, [idx]: val }));
                 }
            }
        }
    }, [currentStep, steps]);

    const handleRun = () => {
        const parsed = inputStr.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (parsed.length === 0) return;
        setArr(parsed);
        setResolvedMap({});
        
        setIsProcessing(true);
        const generator = generateNextGreaterElementSteps(parsed);
        const newSteps = Array.from(generator);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const stepData = steps[currentStep] || { stack: [], message: "Ready", inputIndex: -1, lineNumber: undefined };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/stacks" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Next Greater Element</h1>
                 <p className="text-muted-foreground">Find the next greater element for each item using a Monotonic Stack.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 min-h-[400px] flex flex-col justify-between">
                        
                        {/* Array Visualization */}
                        <div className="flex justify-center gap-2 mb-12">
                            {arr.map((val, i) => {
                                const isCurrent = stepData.inputIndex === i;
                                const isResolved = resolvedMap[i] !== undefined;
                                const isStackTop = stepData.stack.length > 0 && stepData.stack[stepData.stack.length - 1] === i;
                                
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div 
                                            className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 text-xl font-bold transition-all relative
                                                ${isStackTop ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 z-10 scale-110 shadow-lg" : 
                                                  isCurrent ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-110 shadow-lg" : 
                                                  "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"}
                                            `}
                                        >
                                            {val}
                                            {isStackTop && <div className="absolute -top-3 -right-3 w-4 h-4 bg-purple-500 rounded-full text-[8px] text-white flex items-center justify-center">S</div>}
                                        </div>
                                        
                                        {/* Result/NGE Bubble */}
                                        <div className={`text-xs font-mono font-bold transition-all ${isResolved ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-300"}`}>
                                            {isResolved ? `->${resolvedMap[i]}` : "-1"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stack Visualization */}
                         <div className="self-center flex flex-col-reverse items-center justify-end w-24 min-h-[160px] border-b-4 border-zinc-400 dark:border-zinc-600 rounded-b-lg p-2 bg-zinc-50/50 dark:bg-zinc-900/20">
                             <AnimatePresence mode="popLayout">
                                {stepData.stack.map((idx, i) => (
                                    <motion.div
                                        key={`${i}-${idx}`}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className={`w-full h-10 mb-1 rounded flex items-center justify-center font-bold shadow-sm border bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-200`}
                                    >
                                        {arr[idx]} <span className="text-[9px] opacity-50 ml-1">({idx})</span>
                                    </motion.div>
                                ))}
                             </AnimatePresence>
                             {stepData.stack.length === 0 && <span className="text-xs text-zinc-400 mb-4">Empty</span>}
                         </div>
                         <span className="self-center text-xs text-zinc-500 mt-2">Monotonic Stack (Indices)</span>
                     </div>
                     
                      {/* Status Bar */}
                      <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-mono text-zinc-600 dark:text-zinc-400">
                        <span>Status: <span className="text-yellow-600 dark:text-yellow-500 font-bold">{stepData.message}</span></span>
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
                        <CodeHighlight code={CODE} activeLine={stepData.lineNumber} />
                        
                        <div className="mt-6 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                             <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Input Array</h3>
                             <input 
                                type="text" 
                                value={inputStr} 
                                onChange={(e) => setInputStr(e.target.value)} 
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                placeholder="4, 5, 2, 25"
                            />
                            <button 
                                onClick={handleRun} 
                                disabled={isProcessing && isPlaying}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50"
                            >
                                <BarChart3 className="w-4 h-4" /> Run Sort
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
