"use client";

import { useEffect, useState, useRef } from "react";
import BackButton from "@/components/ui/BackButton";
import CodeHighlight from "@/components/visualizations/CodeHighlight";
import { 
    QueueStep, 
    generateCreateQueueSteps, 
    generateEnqueueSteps, 
    generateDequeueSteps, 
    generatePeekQueueSteps 
} from "@/lib/algorithms/queue/arrayQueue";
import { Play, Pause, Plus, Trash2, Eye, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ENQUEUE_CODE = `function enqueue(val):
  if rear == capacity - 1:
    return Overflow
  if front == -1: front = 0
  rear++
  queue[rear] = val`;

const DEQUEUE_CODE = `function dequeue():
  if front == -1 or front > rear:
    return Underflow
  val = queue[front]
  front++
  if front > rear:
    front = rear = -1
  return val`;

const PEEK_CODE = `function peek():
  if front == -1 or front > rear:
    return Empty
  return queue[front]`;

export default function ArrayQueuePage() {
    const [capacity, setCapacity] = useState(5);
    const [array, setArray] = useState<(number | null)[]>(new Array(5).fill(null));
    const [front, setFront] = useState(-1);
    const [rear, setRear] = useState(-1);
    
    const [steps, setSteps] = useState<QueueStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState("Queue is empty.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeCode, setActiveCode] = useState(ENQUEUE_CODE);
    const [activeLine, setActiveLine] = useState<number | undefined>(undefined);

    const [inputValue, setInputValue] = useState("10");
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
                        // Apply final state
                        if (steps.length > 0) {
                            const last = steps[steps.length - 1];
                            setArray(last.array);
                            setFront(last.front);
                            setRear(last.rear);
                            setMessage("Operation complete.");
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

    useEffect(() => {
        if (steps.length > 0 && currentStep < steps.length) {
            const step = steps[currentStep];
            setArray(step.array);
            setFront(step.front);
            setRear(step.rear);
            setMessage(step.message);
            setActiveLine(step.lineNumber);
        }
    }, [currentStep, steps]);

    const executeOperation = (generator: Generator<QueueStep>) => {
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

    const handleCreate = () => {
        if (isProcessing) return;
        const newArray = new Array(capacity).fill(null);
        setArray(newArray);
        setFront(-1);
        setRear(-1);
        setSteps([]);
        setMessage(`Queue reset with capacity ${capacity}`);
    };

    const handleEnqueue = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;
        setActiveCode(ENQUEUE_CODE);
        executeOperation(generateEnqueueSteps(array, front, rear, val, capacity));
    };

    const handleDequeue = () => {
        setActiveCode(DEQUEUE_CODE);
        executeOperation(generateDequeueSteps(array, front, rear));
    };

    const handlePeek = () => {
        setActiveCode(PEEK_CODE);
        executeOperation(generatePeekQueueSteps(array, front, rear));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <BackButton href="/dsa/queues" />
            <div>
                 <h1 className="text-3xl font-bold text-foreground mb-2">Array-Based Queue</h1>
                 <p className="text-muted-foreground">FIFO (First-In, First-Out) structure using a linear array.</p>
                 <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-2 bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded inline-block">
                     Note: In a simple linear implementation, removed spaces at the front are not reused. See "Circular Queue" for optimization.
                 </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Area */}
                    <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[400px] flex items-center justify-center relative flex-col">
                        
                        <div className="flex gap-1 relative pl-8 pr-8">
                            <AnimatePresence>
                                {array.map((value, index) => {
                                    const isFront = index === front;
                                    const isRear = index === rear;
                                    const isActive = index >= front && index <= rear && front !== -1; 
                                    const highlighted = steps.length > 0 && steps[currentStep]?.highlightedIndices.includes(index);

                                    return (
                                        <div key={index} className="relative flex flex-col items-center">
                                            {/* Pointers */}
                                            {isFront && front !== -1 && (
                                                <motion.div layoutId="front-ptr" className="absolute -top-8 text-xs font-bold text-emerald-600">FRONT</motion.div>
                                            )}
                                            
                                            <motion.div
                                                className={`
                                                    w-16 h-16 border-2 flex items-center justify-center text-xl font-bold rounded m-1
                                                    ${highlighted 
                                                        ? "bg-orange-100 border-orange-500 text-orange-700" 
                                                        : isActive 
                                                            ? "bg-white border-zinc-800 dark:bg-zinc-800 dark:border-zinc-600" 
                                                            : "bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-400"}
                                                `}
                                            >
                                                {value}
                                            </motion.div>
                                            
                                            {/* Index */}
                                            <span className="text-xs text-zinc-400 font-mono mt-1">{index}</span>

                                            {isRear && rear !== -1 && (
                                                <motion.div layoutId="rear-ptr" className="absolute -bottom-8 text-xs font-bold text-blue-600">REAR</motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </AnimatePresence>
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
                                    <button onClick={handleEnqueue} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Plus className="w-4 h-4" /> Enqueue
                                    </button>
                                </div>
                                
                                <button onClick={handleDequeue} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Trash2 className="w-4 h-4" /> Dequeue
                                </button>

                                <button onClick={handlePeek} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <Eye className="w-4 h-4" /> Peek
                                </button>
                            </div>

                             <div className="bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                               <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm">Capacity: {capacity}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setCapacity(Math.max(1, capacity - 1)); handleCreate(); }} className="px-2 py-1 bg-zinc-200 rounded text-sm hover:bg-zinc-300 disabled:opacity-50" disabled={isProcessing}>-</button>
                                        <button onClick={() => { setCapacity(capacity + 1); handleCreate(); }} className="px-2 py-1 bg-zinc-200 rounded text-sm hover:bg-zinc-300 disabled:opacity-50" disabled={isProcessing}>+</button>
                                    </div>
                                 </div>
                                 <button onClick={handleCreate} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white py-2 rounded text-sm font-medium transition disabled:opacity-50">
                                    <RotateCcw className="w-4 h-4" /> Reset Queue
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
