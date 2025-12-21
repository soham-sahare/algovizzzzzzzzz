"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    generateStackPushSteps, 
    generateStackPopSteps, 
    StackUsingQueuesStep 
} from "@/lib/algorithms/queue/challenges";
import { Play, Pause, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PUSH_CODE = `function push(x):
  q2.enqueue(x)
  while !q1.empty():
    q2.enqueue(q1.dequeue())
  swap(q1, q2)`;

const POP_CODE = `function pop():
  if q1.empty(): return Error
  return q1.dequeue()`;

export default function StackUsingQueuesPage() {
    const [q1, setQ1] = useState<number[]>([]);
    const [q2, setQ2] = useState<number[]>([]);
    
    const [steps, setSteps] = useState<StackUsingQueuesStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Ready");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeCode, setActiveCode] = useState(PUSH_CODE);
    const [activeLine, setActiveLine] = useState<number | undefined>(undefined);
    
    const [inputValue, setInputValue] = useState("1");
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
                         if (steps.length > 0) {
                            const last = steps[steps.length - 1];
                            setQ1(last.q1);
                            setQ2(last.q2);
                            setMessage("Done");
                            setActiveLine(undefined);
                        }
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

    // Apply steps
    useEffect(() => {
        if (steps.length > 0 && currentStep < steps.length) {
            const step = steps[currentStep];
            setQ1(step.q1);
            setQ2(step.q2);
            setMessage(step.message);
            setActiveLine(step.lineNumber);
        }
    }, [currentStep, steps]);

    const executeOperation = (generator: Generator<StackUsingQueuesStep>) => {
        if (isProcessing) return;
        setIsProcessing(true);
        const newSteps = Array.from(generator);
        if (newSteps.length === 0) {
            setIsProcessing(false);
            return;
        }
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handlePush = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        setActiveCode(PUSH_CODE);
        executeOperation(generateStackPushSteps(q1, q2, val));
        setInputValue((prev) => (parseInt(prev) + 1).toString()); // increment for convenience
    };

    const handlePop = () => {
        setActiveCode(POP_CODE);
        executeOperation(generateStackPopSteps(q1, q2));
    };

    const renderQueue = (queue: number[], name: string, highlightedIndices: number[] = []) => (
        <div className="flex flex-col items-center gap-2 min-h-[120px] bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 w-full relative">
            <span className="font-bold text-sm text-zinc-500 uppercase">{name}</span>
            <div className="flex items-center gap-1 overflow-x-auto w-full p-2 justify-start min-h-[60px]">
                {queue.length === 0 && <span className="text-xs text-zinc-400 w-full text-center">Empty</span>}
                 <AnimatePresence>
                    {queue.map((val, i) => (
                        <motion.div
                            key={`${i}-${val}`} // Simple key, might duplicate if vals duplicate but okay for demo
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className={`min-w-[40px] h-10 flex items-center justify-center border font-mono font-bold rounded shadow-sm bg-white dark:bg-zinc-800
                                ${highlightedIndices.includes(i) ? "border-orange-500 bg-orange-50" : "border-zinc-300 dark:border-zinc-600"}
                            `}
                        >
                            {val}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            {name === "Q1 (Main)" && queue.length > 0 && <span className="absolute bottom-2 left-6 text-[10px] text-zinc-400">Front (Top)</span>}
        </div>
    );

    const stepData = steps[currentStep];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/queues" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Stack using Queues</h1>
                 <p className="text-muted-foreground">Implement LIFO behavior using two FIFO Queues.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 min-h-[400px] flex flex-col justify-center gap-8">
                        {renderQueue(q1, "Q1 (Main)", stepData?.highlighted?.q1)}
                         <div className="flex justify-center text-zinc-300"><ArrowUpDown /></div>
                        {renderQueue(q2, "Q2 (Auxiliary)", stepData?.highlighted?.q2)}
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
                        <CodeHighlight code={activeCode} activeLine={activeLine} />

                        {/* Controls */}
                        <div className="grid grid-cols-1 gap-4 mt-6">
                            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={inputValue} 
                                        onChange={(e) => setInputValue(e.target.value)} 
                                        className="w-20 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm"
                                        placeholder="Val"
                                    />
                                    <button onClick={handlePush} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Plus className="w-4 h-4" /> Push (Fake Stack)
                                    </button>
                                </div>
                                
                                <button onClick={handlePop} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Trash2 className="w-4 h-4" /> Pop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
