"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { generateBalancedParenthesesSteps, GenericStackStep } from "@/lib/algorithms/stack/challenges";
import { Play, Pause, RefreshCcw, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CODE = `function isBalanced(s):
  stack = []
  for char in s:
    if char in "({[":
      stack.push(char)
    else:
      if stack.empty or !match(stack.top, char):
        return false
      stack.pop()
  return stack.empty`;

export default function BalancedParenthesesPage() {
    const [input, setInput] = useState("{[()]}");
    const [steps, setSteps] = useState<GenericStackStep<string>[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);

     // Playback Loop
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
        setIsProcessing(true);
        const generator = generateBalancedParenthesesSteps(input);
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
                 <h1 className="text-3xl font-bold text-foreground mb-2">Balanced Parentheses</h1>
                 <p className="text-muted-foreground">Check if the expression has properly nested brackets.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer */}
                     <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 min-h-[400px] flex flex-col items-center justify-between">
                        
                        {/* Input Strip */}
                        <div className="flex gap-2 mb-8 flex-wrap justify-center">
                            {input.split("").map((char, i) => (
                                <div 
                                    key={i} 
                                    className={`w-10 h-10 flex items-center justify-center rounded border font-mono text-lg transition-colors
                                        ${stepData.inputIndex === i 
                                            ? "bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-200 scale-110" 
                                            : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-500"}
                                    `}
                                >
                                    {char}
                                </div>
                            ))}
                        </div>

                        {/* Stack Visualization */}
                         <div className="flex flex-col-reverse items-center justify-end w-32 min-h-[200px] border-b-4 border-zinc-400 dark:border-zinc-600 rounded-b-lg p-2 bg-zinc-50/50 dark:bg-zinc-900/20">
                             <AnimatePresence mode="popLayout">
                                {stepData.stack.map((char, i) => (
                                    <motion.div
                                        key={`${i}-${char}`}
                                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className={`w-full h-10 mb-1 rounded flex items-center justify-center font-bold shadow-sm border
                                            ${stepData.highlightedIndices.includes(i) 
                                                ? "bg-orange-100 border-orange-400 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200" 
                                                : "bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-foreground"}
                                        `}
                                    >
                                        {char}
                                    </motion.div>
                                ))}
                             </AnimatePresence>
                             {stepData.stack.length === 0 && <span className="text-xs text-zinc-400 mb-4">Empty</span>}
                         </div>
                         <span className="text-xs text-zinc-500 mt-2">Stack</span>
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
                             <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Input</h3>
                             <input 
                                type="text" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm font-mono"
                                placeholder="()[]{}"
                            />
                            <button 
                                onClick={handleRun} 
                                disabled={isProcessing && isPlaying}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4" /> Check Balance
                            </button>
                             <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setInput("([{}])")} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-xs py-1 rounded">Balanced</button>
                                <button onClick={() => setInput("([)]")} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-xs py-1 rounded">Unbalanced</button>
                                <button onClick={() => setInput("(((")} disabled={isProcessing} className="bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 text-xs py-1 rounded">Open</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
